import Link from "next/link";
import { Plus } from "lucide-react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ExerciseCard } from "@/components/exercise-card";
import { EditorialHeader, LearningShell } from "@/components/learning-layout";
import { LearningSearch } from "@/components/learning-search";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ExercisesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = param(params?.q)?.trim() ?? "";
  const category = param(params?.category);
  const bodyZone = param(params?.bodyZone);
  const goal = param(params?.goal);

  const where: Prisma.ExerciseWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
              { expectedEffect: { contains: q, mode: "insensitive" } },
              { bodyZones: { has: q } },
              { goals: { has: q } },
            ],
          }
        : {},
      category ? { category } : {},
      bodyZone ? { bodyZones: { has: bodyZone } } : {},
      goal ? { goals: { has: goal } } : {},
    ],
  };

  const [exercises, allExercises] = await Promise.all([
    prisma.exercise.findMany({ where, orderBy: { title: "asc" } }),
    prisma.exercise.findMany({ orderBy: { title: "asc" } }),
  ]);

  const categories = [...new Set(allExercises.map((item) => item.category))];
  const bodyZones = [...new Set(allExercises.flatMap((item) => item.bodyZones))];
  const goals = [...new Set(allExercises.flatMap((item) => item.goals))];

  return (
    <LearningShell>
      <EditorialHeader
        eyebrow="Память приемов"
        title="Приемы"
        description="Практические карточки для повторения перед сеансом, тренировки вспоминания и быстрого поиска."
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/exercises/new">
              <Plus className="h-4 w-4" />
              Новый прием
            </Link>
          </Button>
        }
      >
        <LearningSearch
          placeholder="Искать приемы, зоны, цели..."
          defaultValue={q}
          filters={[
            { name: "category", label: "Категория", options: categories },
            { name: "bodyZone", label: "Зона тела", options: bodyZones },
            { name: "goal", label: "Цель", options: goals },
          ]}
        />
      </EditorialHeader>
      {exercises.length ? (
        <div className="space-y-4">
          {exercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}
        </div>
      ) : (
        <EmptyState title="Приемы не найдены">Попробуйте другой поиск или добавьте первый прием.</EmptyState>
      )}
    </LearningShell>
  );
}
