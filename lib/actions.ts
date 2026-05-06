"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { importReviewedContent, parseImportJson } from "@/lib/import-content";
import { slugify } from "@/lib/slugify";
import { optionalString, textToArray } from "@/lib/utils";
import {
  exerciseSchema,
  practiceLogSchema,
  theoryCardSchema,
} from "@/lib/validators";

function formToExercise(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  return exerciseSchema.parse({
    slug: optionalString(formData.get("slug")) ?? slugify(title),
    title,
    originalNumber: optionalString(formData.get("originalNumber")),
    category: String(formData.get("category") ?? ""),
    difficulty: optionalString(formData.get("difficulty")) ?? "basic",
    bodyZones: textToArray(formData.get("bodyZones")),
    goals: textToArray(formData.get("goals")),
    clientPosition: optionalString(formData.get("clientPosition")),
    practitionerPosition: optionalString(formData.get("practitionerPosition")),
    steps: textToArray(formData.get("steps")),
    keyPoints: textToArray(formData.get("keyPoints")),
    commonMistakes: textToArray(formData.get("commonMistakes")),
    contraindications: textToArray(formData.get("contraindications")),
    expectedEffect: optionalString(formData.get("expectedEffect")),
    clientFeeling: optionalString(formData.get("clientFeeling")),
    sourceReference: optionalString(formData.get("sourceReference")),
    personalNotes: optionalString(formData.get("personalNotes")),
  });
}

function formToTheory(formData: FormData) {
  return theoryCardSchema.parse({
    topic: String(formData.get("topic") ?? ""),
    title: String(formData.get("title") ?? ""),
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    practicalMeaning: optionalString(formData.get("practicalMeaning")),
    tags: textToArray(formData.get("tags")),
    difficulty: formData.get("difficulty") ?? "1",
    sourceReference: optionalString(formData.get("sourceReference")),
  });
}

export async function createExerciseAction(formData: FormData) {
  const data = formToExercise(formData);
  const exercise = await prisma.exercise.create({
    data: {
      ...data,
      steps: data.steps,
      keyPoints: data.keyPoints,
      commonMistakes: data.commonMistakes,
      contraindications: data.contraindications,
    },
  });
  revalidatePath("/");
  revalidatePath("/exercises");
  redirect(`/exercises/${exercise.slug}`);
}

export async function updateExerciseAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = formToExercise(formData);
  const exercise = await prisma.exercise.update({
    where: { id },
    data: {
      ...data,
      steps: data.steps,
      keyPoints: data.keyPoints,
      commonMistakes: data.commonMistakes,
      contraindications: data.contraindications,
    },
  });
  revalidatePath("/");
  revalidatePath("/exercises");
  revalidatePath(`/exercises/${exercise.slug}`);
  redirect(`/exercises/${exercise.slug}`);
}

export async function createTheoryCardAction(formData: FormData) {
  const data = formToTheory(formData);
  const card = await prisma.theoryCard.create({ data });
  revalidatePath("/");
  revalidatePath("/theory");
  redirect(`/theory/${card.id}`);
}

export async function updateTheoryCardAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = formToTheory(formData);
  const card = await prisma.theoryCard.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/theory");
  revalidatePath(`/theory/${card.id}`);
  redirect(`/theory/${card.id}`);
}

export async function createPracticeLogAction(formData: FormData) {
  const selected = formData.getAll("exerciseIds").map(String);
  const data = practiceLogSchema.parse({
    title: String(formData.get("title") ?? ""),
    clientContext: optionalString(formData.get("clientContext")),
    sessionNotes: String(formData.get("sessionNotes") ?? ""),
    exerciseIds: selected,
    whatWorked: optionalString(formData.get("whatWorked")),
    whatWasDifficult: optionalString(formData.get("whatWasDifficult")),
    followUpIdeas: optionalString(formData.get("followUpIdeas")),
  });
  const log = await prisma.practiceLog.create({ data });
  revalidatePath("/practice-log");
  redirect(`/practice-log/${log.id}`);
}

export async function saveReviewAction(input: {
  cardType: "exercise" | "theory";
  cardId: string;
  mode: string;
  rating: "again" | "hard" | "good" | "easy";
  notes?: string;
}) {
  await prisma.reviewResult.create({
    data: {
      cardType: input.cardType,
      cardId: input.cardId,
      mode: input.mode,
      rating: input.rating,
      notes: input.notes,
    },
  });
  revalidatePath("/study");
}

export async function importJsonAction(formData: FormData) {
  const raw = String(formData.get("payload") ?? "");
  let data;
  try {
    data = parseImportJson(raw);
  } catch {
    redirect("/admin/import?status=invalid-json");
  }

  const summary = await prisma.$transaction((tx) => importReviewedContent(tx, data));
  revalidatePath("/");
  revalidatePath("/exercises");
  revalidatePath("/theory");
  revalidatePath("/sequences");
  redirect(
    `/admin/import?status=success&exercises=${summary.exercises}&theory=${summary.theoryCards}&sequences=${summary.practiceSequences}`,
  );
}
