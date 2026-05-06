import { createPracticeLogAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Field, TextAreaField } from "@/components/field";
import { PageHeader } from "@/components/page-header";

export default async function NewPracticeLogPage() {
  const exercises = await prisma.exercise.findMany({ orderBy: { title: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader title="Новая запись практики" description="Зафиксируйте наблюдения, выбор приемов и идеи для продолжения." />
      <form action={createPracticeLogAction} className="space-y-6">
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2">
            <Field label="Название" name="title" required />
            <TextAreaField label="Контекст клиента" name="clientContext" />
            <TextAreaField label="Заметки сеанса" name="sessionNotes" required rows={7} />
            <div className="grid gap-3">
              <Label>Использованные приемы</Label>
              <div className="max-h-72 space-y-3 overflow-auto rounded-md border border-stone-200 bg-white p-3">
                {exercises.map((exercise) => (
                  <label key={exercise.id} className="flex items-center gap-3 text-sm">
                    <Checkbox name="exerciseIds" value={exercise.id} />
                    {exercise.title}
                  </label>
                ))}
              </div>
            </div>
            <TextAreaField label="Что сработало" name="whatWorked" />
            <TextAreaField label="Что было сложным" name="whatWasDifficult" />
            <TextAreaField label="Идеи для продолжения" name="followUpIdeas" />
          </CardContent>
        </Card>
        <Button type="submit">Сохранить запись</Button>
      </form>
    </div>
  );
}
