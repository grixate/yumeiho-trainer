import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { TheoryForm } from "@/components/theory-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTheoryPage({ params }: PageProps) {
  const { id } = await params;
  const card = await prisma.theoryCard.findUnique({ where: { id } });
  if (!card) notFound();
  return (
    <div className="space-y-6">
      <PageHeader title="Редактирование карточки теории" description={card.title} />
      <TheoryForm card={card} />
    </div>
  );
}
