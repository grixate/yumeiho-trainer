import { Exercise } from "@prisma/client";
import { createExerciseAction, updateExerciseAction } from "@/lib/actions";
import { asStringArray } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Field, TextAreaField } from "@/components/field";

export function ExerciseForm({ exercise }: { exercise?: Exercise }) {
  return (
    <form action={exercise ? updateExerciseAction : createExerciseAction} className="space-y-6">
      {exercise ? <input type="hidden" name="id" value={exercise.id} /> : null}
      <Card>
        <CardContent className="grid gap-5 p-5 sm:grid-cols-2">
          <Field label="Название" name="title" defaultValue={exercise?.title} required />
          <Field label="Slug" name="slug" defaultValue={exercise?.slug} help="Оставьте читаемым и уникальным." />
          <Field label="Исходный номер" name="originalNumber" defaultValue={exercise?.originalNumber} />
          <Field label="Категория" name="category" defaultValue={exercise?.category} required />
          <div className="grid gap-2">
            <Label htmlFor="difficulty">Сложность</Label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={exercise?.difficulty ?? "basic"}
              className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm outline-none transition-colors focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            >
              <option value="basic">Базовый</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
          <TextAreaField
            label="Зоны тела"
            name="bodyZones"
            defaultValue={exercise?.bodyZones.join("\n")}
            help="Одна зона на строку."
          />
          <TextAreaField
            label="Цели"
            name="goals"
            defaultValue={exercise?.goals.join("\n")}
            help="Одна цель на строку."
          />
          <TextAreaField label="Положение пациента" name="clientPosition" defaultValue={exercise?.clientPosition} />
          <TextAreaField
            label="Положение терапевта"
            name="practitionerPosition"
            defaultValue={exercise?.practitionerPosition}
          />
          <TextAreaField
            label="Шаги"
            name="steps"
            defaultValue={asStringArray(exercise?.steps).join("\n")}
            required
            rows={8}
            help="Один шаг на строку."
          />
          <TextAreaField
            label="Ключевые моменты"
            name="keyPoints"
            defaultValue={asStringArray(exercise?.keyPoints).join("\n")}
          />
          <TextAreaField
            label="Частые ошибки"
            name="commonMistakes"
            defaultValue={asStringArray(exercise?.commonMistakes).join("\n")}
          />
          <TextAreaField
            label="Противопоказания"
            name="contraindications"
            defaultValue={asStringArray(exercise?.contraindications).join("\n")}
          />
          <TextAreaField label="Ожидаемый эффект" name="expectedEffect" defaultValue={exercise?.expectedEffect} />
          <TextAreaField label="Ощущение пациента" name="clientFeeling" defaultValue={exercise?.clientFeeling} />
          <TextAreaField label="Личные заметки" name="personalNotes" defaultValue={exercise?.personalNotes} />
          <Field label="Источник" name="sourceReference" defaultValue={exercise?.sourceReference} />
        </CardContent>
      </Card>
      <Button type="submit">{exercise ? "Сохранить прием" : "Создать прием"}</Button>
    </form>
  );
}
