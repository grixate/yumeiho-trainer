import { prisma } from "@/lib/prisma";
import { EditorialHeader, LearningShell } from "@/components/learning-layout";
import { TheoryFlashcards } from "@/components/study-decks";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TheoryFlashcardsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cards = await prisma.theoryCard.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });
  return (
    <LearningShell width="narrow">
      <EditorialHeader
        eyebrow="Вспоминание теории"
        title="Карточки"
        description="Откройте ответ, свяжите его с практикой и оцените вспоминание."
      />
      <TheoryFlashcards cards={cards} firstId={param(params?.cardId)} />
    </LearningShell>
  );
}
