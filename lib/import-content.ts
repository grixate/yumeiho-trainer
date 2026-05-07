import { Prisma, PrismaClient } from "@prisma/client";
import { slugify } from "./slugify";
import { importSchema, type ImportPayload } from "./validators";

export type ImportSummary = {
  exercises: number;
  theoryCards: number;
  practiceSequences: number;
};

export function parseImportPayload(payload: unknown): ImportPayload {
  return importSchema.parse(payload);
}

export function parseImportJson(raw: string): ImportPayload {
  return parseImportPayload(JSON.parse(raw));
}

export async function importReviewedContent(
  prisma: PrismaClient | Prisma.TransactionClient,
  payload: ImportPayload,
): Promise<ImportSummary> {
  const exercises = payload.exercises.map((exercise) => ({
    ...exercise,
    slug: exercise.slug ?? slugify(exercise.title),
    difficulty: exercise.difficulty ?? "basic",
    steps: exercise.steps,
    keyPoints: exercise.keyPoints,
    commonMistakes: exercise.commonMistakes,
    contraindications: exercise.contraindications,
  }));

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      create: exercise,
      update: exercise,
    });
  }

  for (const theoryCard of payload.theoryCards) {
    if (theoryCard.id) {
      await prisma.theoryCard.upsert({
        where: { id: theoryCard.id },
        create: theoryCard,
        update: theoryCard,
      });
    } else {
      await prisma.theoryCard.create({ data: theoryCard });
    }
  }

  const sequenceExerciseRefs = [
    ...new Set(
      payload.practiceSequences.flatMap((sequence) => [
        ...sequence.exerciseIds,
        ...sequence.blocks.flatMap((block) => block.exerciseIds),
      ]),
    ),
  ];
  const referencedExercises = sequenceExerciseRefs.length
    ? await prisma.exercise.findMany({
        where: {
          OR: [{ id: { in: sequenceExerciseRefs } }, { slug: { in: sequenceExerciseRefs } }],
        },
        select: { id: true, slug: true },
      })
    : [];
  const exerciseRefToId = new Map<string, string>();
  for (const exercise of referencedExercises) {
    exerciseRefToId.set(exercise.id, exercise.id);
    exerciseRefToId.set(exercise.slug, exercise.id);
  }

  const unresolvedRefs = sequenceExerciseRefs.filter((ref) => !exerciseRefToId.has(ref));
  if (unresolvedRefs.length) {
    throw new Error(`Unresolved practice sequence exercise references: ${unresolvedRefs.join(", ")}`);
  }

  const practiceSequences = payload.practiceSequences.map((sequence) => ({
    ...sequence,
    slug: sequence.slug ?? slugify(sequence.title),
    exerciseIds: (sequence.exerciseIds.length
      ? sequence.exerciseIds
      : sequence.blocks.flatMap((block) => block.exerciseIds)
    ).map((ref) => exerciseRefToId.get(ref) ?? ref),
    blocks: sequence.blocks.length
      ? sequence.blocks.map((block) => ({
          ...block,
          exerciseIds: block.exerciseIds.map((ref) => exerciseRefToId.get(ref) ?? ref),
        }))
      : undefined,
  }));

  for (const sequence of practiceSequences) {
    await prisma.practiceSequence.upsert({
      where: { slug: sequence.slug },
      create: sequence,
      update: sequence,
    });
  }

  return {
    exercises: exercises.length,
    theoryCards: payload.theoryCards.length,
    practiceSequences: practiceSequences.length,
  };
}
