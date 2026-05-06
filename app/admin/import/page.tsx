import { importJsonAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const example = `{
  "exercises": [
    {
      "title": "Проверенный прием из книги",
      "slug": "proverennyy-priem-iz-knigi",
      "originalNumber": "Прием № 1",
      "category": "Диагностика",
      "bodyZones": ["таз"],
      "goals": ["оценить состояние"],
      "steps": ["Первый шаг"],
      "keyPoints": ["Работать мягко и контролируемо"],
      "commonMistakes": [],
      "contraindications": ["Предупреждение: не работать через острую боль"],
      "sourceReference": "Книга, стр. 12, Прием № 1"
    }
  ],
  "theoryCards": [
    {
      "topic": "Основы",
      "title": "Проверенная карточка теории",
      "question": "Что важно?",
      "answer": "Практическая связь.",
      "practicalMeaning": "Используйте это как проверку перед выбором приема.",
      "tags": ["книга", "проверено"],
      "sourceReference": "Книга, стр. 4"
    }
  ],
  "practiceSequences": [
    {
      "slug": "proverennaya-posledovatelnost",
      "title": "Проверенная последовательность",
      "useCase": "Практический поток из проверенного источника",
      "description": "Короткая последовательность, собранная после ручной проверки.",
      "exerciseIds": [],
      "notes": "При необходимости замените exerciseIds на импортированные ID приемов после проверки."
    }
  ]
}`;

export default async function ImportPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = param(params?.status);
  const exerciseCount = param(params?.exercises);
  const theoryCount = param(params?.theory);
  const sequenceCount = param(params?.sequences);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Импорт JSON"
        description="Вставьте проверенный JSON из книги для приемов, карточек теории и практических последовательностей."
      />
      {status === "success" ? (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5 text-sm text-emerald-950">
            Импортировано: приемов - {exerciseCount ?? 0}, карточек теории - {theoryCount ?? 0}, последовательностей - {sequenceCount ?? 0}.
          </CardContent>
        </Card>
      ) : null}
      {status === "invalid-json" ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-5 text-sm text-red-900">
            Вставленный текст не является корректным JSON или не соответствует схеме проверенного импорта.
          </CardContent>
        </Card>
      ) : null}
      <form action={importJsonAction} className="space-y-4">
        <Textarea name="payload" defaultValue={example} rows={20} className="font-mono text-xs" />
        <Button type="submit">Импортировать</Button>
      </form>
    </div>
  );
}
