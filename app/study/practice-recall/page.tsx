import { prisma } from "@/lib/prisma";
import { EditorialHeader, LearningShell } from "@/components/learning-layout";
import { PracticeRecall } from "@/components/study-decks";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PracticeRecallPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cards = await prisma.exercise.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });
  return (
    <LearningShell width="narrow">
      <EditorialHeader
        eyebrow="Практическая память"
        title="Вспоминание приемов"
        description="Вспомните структуру приема до открытия практической карточки."
      />
      <PracticeRecall cards={cards} firstId={param(params?.exerciseId)} />
    </LearningShell>
  );
}
