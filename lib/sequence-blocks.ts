import type { Exercise, PracticeSequence } from "@prisma/client";
import { asStringArray } from "@/lib/utils";

export type SequenceExercise = Exercise;

export type SequenceBlock = {
  title: string;
  description: string;
  exercises: SequenceExercise[];
};

const blockDescriptions: Record<string, string> = {
  "Релаксация мышц шеи и плечевого пояса": "Подготовка шеи и плечевого пояса перед коррекцией.",
  "Релаксация шеи": "Снижение защитного напряжения перед точными шейными приемами.",
  "Коррекция шейного отдела": "Контролируемая работа с подвижностью шейного отдела.",
  "Коррекция грудного отдела и плечевого пояса": "Переход от шеи к грудному отделу и плечевому поясу.",
  "Коррекция позвоночника": "Последовательное восстановление подвижности позвоночника.",
  "Коррекция поясничного отдела": "Ротационная работа с поясницей и тазовой фиксацией.",
  "Коррекция таза и крестца": "Фокус на крестце, тазе и крестцово-подвздошной зоне.",
  "Растяжение и декомпрессия": "Мягкое вытяжение и разгрузка тканей.",
  "Коррекция тазобедренных суставов": "Восстановление свободы движения в тазобедренной зоне.",
  "Массажно-давящее воздействие": "Ритмичная подготовка мягких тканей.",
  "Коррекция нижних конечностей": "Интеграция таза через колени, голеностопы и стопы.",
  "Растяжение мышечных цепей": "Закрепление свободы движения через мышечные цепи.",
  "Коррекция стопы": "Финишная работа с опорой и подвижностью стопы.",
};

export function orderedSequenceExercises(sequence: PracticeSequence, exercises: Exercise[]) {
  return sequence.exerciseIds
    .map((id) => exercises.find((exercise) => exercise.id === id))
    .filter((exercise): exercise is Exercise => Boolean(exercise));
}

export function inferSequenceBlocks(exercises: Exercise[]): SequenceBlock[] {
  const blocks: SequenceBlock[] = [];

  for (const exercise of exercises) {
    const current = blocks.at(-1);
    if (current?.title === exercise.category) {
      current.exercises.push(exercise);
    } else {
      blocks.push({
        title: exercise.category,
        description: blockDescriptions[exercise.category] ?? fallbackDescription(exercise),
        exercises: [exercise],
      });
    }
  }

  return blocks;
}

export function flowPreview(exercises: Exercise[]) {
  return inferSequenceBlocks(exercises).map((block) => block.title);
}

export function exerciseWarnings(exercise: Exercise) {
  const contraindications = asStringArray(exercise.contraindications);
  if (contraindications.length) return contraindications;
  return asStringArray(exercise.commonMistakes).slice(0, 2);
}

function fallbackDescription(exercise: Exercise) {
  const zone = exercise.bodyZones[0];
  return zone ? `Практический блок для зоны: ${zone}.` : "Практический блок последовательности.";
}
