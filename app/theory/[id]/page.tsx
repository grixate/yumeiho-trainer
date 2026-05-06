import Link from "next/link";
import { notFound } from "next/navigation";
import { Brain, Edit } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditorialHeader, LearningCard, LearningShell } from "@/components/learning-layout";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TheoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const card = await prisma.theoryCard.findUnique({ where: { id } });
  if (!card) notFound();

  return (
    <LearningShell width="narrow">
      <EditorialHeader
        eyebrow={card.topic}
        title={card.title}
        description={`Сложность ${card.difficulty}`}
        action={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/admin/theory/${card.id}/edit`}>
                <Edit className="h-4 w-4" />
                Править
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href={`/study/theory-flashcards?cardId=${card.id}`}>
                <Brain className="h-4 w-4" />
                Учить
              </Link>
            </Button>
          </>
        }
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {card.tags.map((tag) => <Badge key={tag} className="shrink-0 rounded-full">{tag}</Badge>)}
        </div>
      </EditorialHeader>
      <LearningCard>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">Вопрос</h2>
        <p className="text-xl leading-9 text-stone-800">{card.question}</p>
      </LearningCard>
      <LearningCard>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">Ответ</h2>
        <p className="leading-8 text-stone-700">{card.answer}</p>
      </LearningCard>
      <LearningCard className="border-emerald-200 bg-emerald-50/70">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-900/75">Практический смысл</h2>
        <p className="leading-8 text-emerald-950">
          {card.practicalMeaning || "Добавьте практическую связь при редактировании карточки."}
        </p>
      </LearningCard>
      <LearningCard>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">Источник</h2>
        <p className="leading-7 text-stone-700">{card.sourceReference || "Не указано"}</p>
      </LearningCard>
    </LearningShell>
  );
}
