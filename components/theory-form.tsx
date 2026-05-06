import { TheoryCard } from "@prisma/client";
import { createTheoryCardAction, updateTheoryCardAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, TextAreaField } from "@/components/field";

export function TheoryForm({ card }: { card?: TheoryCard }) {
  return (
    <form action={card ? updateTheoryCardAction : createTheoryCardAction} className="space-y-6">
      {card ? <input type="hidden" name="id" value={card.id} /> : null}
      <Card>
        <CardContent className="grid gap-5 p-5 sm:grid-cols-2">
          <Field label="Тема" name="topic" defaultValue={card?.topic} required />
          <Field label="Название" name="title" defaultValue={card?.title} required />
          <Field label="Сложность" name="difficulty" defaultValue={card?.difficulty ?? 1} />
          <TextAreaField label="Теги" name="tags" defaultValue={card?.tags.join("\n")} help="Один тег на строку." />
          <TextAreaField label="Вопрос" name="question" defaultValue={card?.question} required rows={5} />
          <TextAreaField label="Ответ" name="answer" defaultValue={card?.answer} required rows={7} />
          <TextAreaField
            label="Практический смысл"
            name="practicalMeaning"
            defaultValue={card?.practicalMeaning}
            rows={5}
          />
          <Field label="Источник" name="sourceReference" defaultValue={card?.sourceReference} />
        </CardContent>
      </Card>
      <Button type="submit">{card ? "Сохранить карточку" : "Создать карточку"}</Button>
    </form>
  );
}
