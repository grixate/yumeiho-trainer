import type { Exercise } from "@prisma/client";
import { asStringArray } from "@/lib/utils";

export type ExercisePreview = {
  goal: string[];
  keyActions: string[];
  warnings: string[];
};

export function readExercisePreview(value: unknown): ExercisePreview {
  if (!value || typeof value !== "object") return { goal: [], keyActions: [], warnings: [] };
  const preview = value as Record<string, unknown>;
  return {
    goal: asStringArray(preview.goal),
    keyActions: asStringArray(preview.keyActions),
    warnings: asStringArray(preview.warnings),
  };
}

export function practicalGoals(exercise: Exercise) {
  const preview = readExercisePreview(exercise.preview);
  return preview.goal.length ? preview.goal : exercise.goals;
}

export function practicalActions(exercise: Exercise) {
  const preview = readExercisePreview(exercise.preview);
  const keyPoints = asStringArray(exercise.keyPoints);
  return preview.keyActions.length ? preview.keyActions : keyPoints.length ? keyPoints : asStringArray(exercise.steps);
}

export function practicalWarnings(exercise: Exercise) {
  const preview = readExercisePreview(exercise.preview);
  const contraindications = asStringArray(exercise.contraindications);
  if (preview.warnings.length || contraindications.length) {
    return [...preview.warnings, ...contraindications];
  }
  return asStringArray(exercise.commonMistakes).slice(0, 2);
}

export function uniqueCompact(items: string[]) {
  return [...new Set(items.filter((item) => item.trim().length > 0))];
}

export function filterExercises(
  exercises: Exercise[],
  filters: {
    q?: string;
    category?: string;
    bodyZone?: string;
    difficulty?: string;
    sequenceRole?: string;
  },
) {
  const query = filters.q?.trim().toLocaleLowerCase("ru-RU");
  return exercises.filter((exercise) => {
    if (filters.category && exercise.category !== filters.category) return false;
    if (filters.bodyZone && !exercise.bodyZones.includes(filters.bodyZone)) return false;
    if (filters.difficulty && exercise.difficulty !== filters.difficulty) return false;
    if (filters.sequenceRole && exercise.sequenceRole !== filters.sequenceRole) return false;
    if (!query) return true;

    const preview = readExercisePreview(exercise.preview);
    const haystack = [
      exercise.title,
      exercise.originalNumber ?? "",
      exercise.category,
      exercise.expectedEffect ?? "",
      ...exercise.bodyZones,
      ...exercise.goals,
      ...preview.goal,
      ...preview.keyActions,
    ].join(" ").toLocaleLowerCase("ru-RU");

    return haystack.includes(query);
  });
}

export function getExerciseFilterOptions(exercises: Exercise[]) {
  return {
    categories: uniqueCompact(exercises.map((exercise) => exercise.category)).sort(),
    bodyZones: uniqueCompact(exercises.flatMap((exercise) => exercise.bodyZones)).sort(),
    difficulties: uniqueCompact(exercises.map((exercise) => exercise.difficulty)).sort(),
    sequenceRoles: uniqueCompact(exercises.map((exercise) => exercise.sequenceRole ?? "")).sort(),
  };
}

export function mainBodyZones(exercises: Exercise[], limit = 4) {
  const counts = new Map<string, number>();
  for (const zone of exercises.flatMap((exercise) => exercise.bodyZones)) {
    counts.set(zone, (counts.get(zone) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ru"))
    .slice(0, limit)
    .map(([zone]) => zone);
}

export function exerciseOrderNumber(exercise: Pick<Exercise, "originalNumber" | "slug">) {
  const fromOriginalNumber = exercise.originalNumber?.match(/\d+/)?.[0];
  const fromSlug = exercise.slug.match(/priem-(\d+)/)?.[1];
  const value = Number(fromOriginalNumber ?? fromSlug);
  return Number.isFinite(value) && value > 0 ? value : Number.MAX_SAFE_INTEGER;
}

export function sequenceOrderNumber(exercises: Exercise[]) {
  return exercises.reduce(
    (lowest, exercise) => Math.min(lowest, exerciseOrderNumber(exercise)),
    Number.MAX_SAFE_INTEGER,
  );
}
