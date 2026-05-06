import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExerciseForm } from "@/components/exercise-form";
import { PageHeader } from "@/components/page-header";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExercisePage({ params }: PageProps) {
  const { id } = await params;
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) notFound();
  return (
    <div className="space-y-6">
      <PageHeader title="Редактирование приема" description={exercise.title} />
      <ExerciseForm exercise={exercise} />
    </div>
  );
}
