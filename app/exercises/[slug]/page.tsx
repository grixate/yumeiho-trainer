import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExerciseDetailCard } from "@/components/practical-ui";
import { LearningShell } from "@/components/learning-layout";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ExerciseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const exercise = await prisma.exercise.findUnique({ where: { slug } });
  if (!exercise) notFound();

  return (
    <LearningShell width="narrow">
      <ExerciseDetailCard exercise={exercise} />
    </LearningShell>
  );
}
