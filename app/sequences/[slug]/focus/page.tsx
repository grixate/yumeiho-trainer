import type { Exercise } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { orderedSequenceExercises, sequenceBlocks } from "@/lib/sequence-blocks";
import { practicalActions, practicalGoals, practicalWarnings } from "@/lib/practical-content";
import { asStringArray } from "@/lib/utils";
import { LearningShell } from "@/components/learning-layout";
import {
  FocusModeExercise,
  type PracticeExerciseView,
  type PracticeSequenceBlockView,
} from "@/components/sequence-practice";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SequenceFocusPage({ params }: PageProps) {
  const { slug } = await params;
  const sequence = await prisma.practiceSequence.findUnique({ where: { slug } });
  if (!sequence) notFound();

  const exercises = await prisma.exercise.findMany({
    where: { id: { in: sequence.exerciseIds } },
  });
  const ordered = orderedSequenceExercises(sequence, exercises);
  const blocks = sequenceBlocks(sequence, ordered).map<PracticeSequenceBlockView>((block) => ({
    title: block.title,
    description: block.description,
    exercises: block.exercises.map(toPracticeExerciseView),
  }));

  return (
    <LearningShell width="narrow">
      <FocusModeExercise
        sequence={{
          slug: sequence.slug,
          title: sequence.title,
          description: sequence.description,
          useCase: sequence.useCase,
          notes: sequence.notes,
        }}
        blocks={blocks}
      />
    </LearningShell>
  );
}

function toPracticeExerciseView(exercise: Exercise): PracticeExerciseView {
  return {
    id: exercise.id,
    slug: exercise.slug,
    title: exercise.title,
    originalNumber: exercise.originalNumber,
    category: exercise.category,
    difficulty: exercise.difficulty,
    bodyZones: exercise.bodyZones,
    goals: practicalGoals(exercise),
    clientPosition: exercise.clientPosition,
    practitionerPosition: exercise.practitionerPosition,
    steps: asStringArray(exercise.steps),
    keyActions: practicalActions(exercise),
    warnings: practicalWarnings(exercise),
  };
}
