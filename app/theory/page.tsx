import Link from "next/link";
import { Plus } from "lucide-react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { EditorialHeader, LearningShell } from "@/components/learning-layout";
import { LearningSearch } from "@/components/learning-search";
import { TheoryCardPreview } from "@/components/theory-card-preview";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TheoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = param(params?.q)?.trim() ?? "";
  const topic = param(params?.topic);
  const difficulty = param(params?.difficulty);
  const tag = param(params?.tag);

  const where: Prisma.TheoryCardWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { topic: { contains: q, mode: "insensitive" } },
              { title: { contains: q, mode: "insensitive" } },
              { question: { contains: q, mode: "insensitive" } },
              { answer: { contains: q, mode: "insensitive" } },
              { tags: { has: q } },
            ],
          }
        : {},
      topic ? { topic } : {},
      difficulty ? { difficulty: Number(difficulty) } : {},
      tag ? { tags: { has: tag } } : {},
    ],
  };

  const [cards, allCards] = await Promise.all([
    prisma.theoryCard.findMany({ where, orderBy: [{ topic: "asc" }, { title: "asc" }] }),
    prisma.theoryCard.findMany({ orderBy: { title: "asc" } }),
  ]);

  const topics = [...new Set(allCards.map((item) => item.topic))];
  const difficulties = [...new Set(allCards.map((item) => String(item.difficulty)))];
  const tags = [...new Set(allCards.flatMap((item) => item.tags))];

  return (
    <LearningShell>
      <EditorialHeader
        eyebrow="Карточки знаний"
        title="Знания"
        description="Принципы, диагностика, логика метода и практический смысл для повторения перед работой."
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/theory/new">
              <Plus className="h-4 w-4" />
              Новая карточка
            </Link>
          </Button>
        }
      >
        <LearningSearch
          placeholder="Искать понятия, вопросы, теги..."
          defaultValue={q}
          filters={[
            { name: "topic", label: "Тема", options: topics },
            { name: "difficulty", label: "Сложность", options: difficulties },
            { name: "tag", label: "Тег", options: tags },
          ]}
        />
      </EditorialHeader>
      {cards.length ? (
        <div className="space-y-4">
          {cards.map((card) => <TheoryCardPreview key={card.id} card={card} />)}
        </div>
      ) : (
        <EmptyState title="Карточки не найдены">Попробуйте другой поиск или добавьте первую карточку.</EmptyState>
      )}
    </LearningShell>
  );
}
