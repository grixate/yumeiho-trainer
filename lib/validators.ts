import { z } from "zod";

const stringArray = z.array(z.string().min(1));
const jsonStringArray = z.union([stringArray, z.unknown()]).transform((value) => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
});

const importSequenceBlockSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  exerciseIds: jsonStringArray.optional().default([]),
});

const importExerciseSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  originalNumber: z.string().optional(),
  category: z.string().min(1),
  difficulty: z.string().optional(),
  sequenceRole: z.string().optional(),
  intensity: z.string().optional(),
  requiresPreparation: z.coerce.boolean().optional().default(false),
  bodyZones: jsonStringArray,
  goals: jsonStringArray,
  clientPosition: z.string().optional(),
  practitionerPosition: z.string().optional(),
  steps: jsonStringArray,
  keyPoints: jsonStringArray.optional().default([]),
  commonMistakes: jsonStringArray.optional().default([]),
  contraindications: jsonStringArray.optional().default([]),
  relatedExercises: jsonStringArray.optional().default([]),
  relatedTheory: jsonStringArray.optional().default([]),
  preview: z
    .object({
      goal: jsonStringArray.optional().default([]),
      keyActions: jsonStringArray.optional().default([]),
      warnings: jsonStringArray.optional().default([]),
    })
    .optional(),
  expectedEffect: z.string().optional(),
  clientFeeling: z.string().optional(),
  sourceReference: z.string().optional(),
  personalNotes: z.string().optional(),
});

const importTheoryCardSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(1),
  title: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  practicalMeaning: z.string().optional(),
  tags: jsonStringArray.optional().default([]),
  difficulty: z.coerce.number().int().min(1).max(5).optional().default(1),
  sourceReference: z.string().optional(),
});

const importPracticeSequenceSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  useCase: z.string().min(1),
  blocks: z.array(importSequenceBlockSchema).optional().default([]),
  exerciseIds: jsonStringArray.optional().default([]),
  notes: z.string().optional(),
});

export const exerciseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  originalNumber: z.string().optional(),
  category: z.string().min(1),
  difficulty: z.string().default("basic"),
  sequenceRole: z.string().optional(),
  intensity: z.string().optional(),
  requiresPreparation: z.coerce.boolean().optional().default(false),
  bodyZones: stringArray.default([]),
  goals: stringArray.default([]),
  clientPosition: z.string().optional(),
  practitionerPosition: z.string().optional(),
  steps: stringArray.min(1, "Добавьте хотя бы один шаг."),
  keyPoints: stringArray.default([]),
  commonMistakes: stringArray.default([]),
  contraindications: stringArray.default([]),
  relatedExercises: stringArray.default([]),
  relatedTheory: stringArray.default([]),
  expectedEffect: z.string().optional(),
  clientFeeling: z.string().optional(),
  preview: z
    .object({
      goal: stringArray.default([]),
      keyActions: stringArray.default([]),
      warnings: stringArray.default([]),
    })
    .optional(),
  sourceReference: z.string().optional(),
  personalNotes: z.string().optional(),
});

export const theoryCardSchema = z.object({
  topic: z.string().min(1),
  title: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  practicalMeaning: z.string().optional(),
  tags: stringArray.default([]),
  difficulty: z.coerce.number().int().min(1).max(5).default(1),
  sourceReference: z.string().optional(),
});

export const practiceLogSchema = z.object({
  title: z.string().min(1),
  clientContext: z.string().optional(),
  sessionNotes: z.string().min(1),
  exerciseIds: stringArray.default([]),
  whatWorked: z.string().optional(),
  whatWasDifficult: z.string().optional(),
  followUpIdeas: z.string().optional(),
});

const reviewedImportSchema = z.object({
  exercises: z.array(importExerciseSchema).optional().default([]),
  theoryCards: z.array(importTheoryCardSchema).optional().default([]),
  practiceSequences: z.array(importPracticeSequenceSchema).optional().default([]),
});

const atomicImportSchema = z
  .object({
    items: z.array(
      z.discriminatedUnion("type", [
        z.object({ type: z.literal("exercise"), data: importExerciseSchema }),
        z.object({ type: z.literal("theoryCard"), data: importTheoryCardSchema }),
        z.object({ type: z.literal("practiceSequence"), data: importPracticeSequenceSchema }),
      ]),
    ),
    manifest: z.unknown().optional(),
  })
  .transform((payload) => ({
    exercises: payload.items.flatMap((item) => (item.type === "exercise" ? [item.data] : [])),
    theoryCards: payload.items.flatMap((item) => (item.type === "theoryCard" ? [item.data] : [])),
    practiceSequences: payload.items.flatMap((item) => (item.type === "practiceSequence" ? [item.data] : [])),
  }));

export const importSchema = z.union([atomicImportSchema, reviewedImportSchema]);

export type ImportPayload = z.infer<typeof importSchema>;
