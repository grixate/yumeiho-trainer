import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { asStringArray } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MemoryList } from "@/components/exercise-memory-card";
import { EditorialHeader, LearningCard, LearningShell } from "@/components/learning-layout";
import { SearchForm } from "@/components/search-form";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuickReferencePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = param(params?.q)?.trim() ?? "";
  const where: Prisma.ExerciseWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { bodyZones: { has: q } },
          { goals: { has: q } },
        ],
      }
    : {};
  const exercises = await prisma.exercise.findMany({ where, orderBy: { title: "asc" } });

  return (
    <LearningShell>
      <EditorialHeader
        eyebrow="Быстрый поиск"
        title="Быстрая справка"
        description="Спокойный режим просмотра для подготовки к сеансу без проверки."
      >
      <SearchForm placeholder="Искать справочные карточки..." defaultValue={q} />
      </EditorialHeader>
      <div className="grid gap-4">
        {exercises.map((exercise) => (
          <LearningCard key={exercise.id} className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-stone-950">{exercise.title}</h2>
              <p className="mt-1 text-sm text-stone-500">{exercise.category}</p>
            </div>
            <div className="grid gap-4 text-sm leading-6 text-stone-700 sm:grid-cols-2">
              <MemoryList title="Цель" items={exercise.goals.slice(0, 2)} />
              <MemoryList title="Ключевые действия" items={asStringArray(exercise.steps).slice(0, 3)} />
              <MemoryList title="Положение" items={[exercise.clientPosition || "Не указано"]} />
              <MemoryList title="Предупреждения" items={asStringArray(exercise.contraindications).slice(0, 2)} caution />
            </div>
              <Button asChild variant="outline" size="sm" className="w-fit rounded-full">
                <Link href={`/exercises/${exercise.slug}`}>Открыть полную карточку</Link>
              </Button>
          </LearningCard>
        ))}
      </div>
    </LearningShell>
  );
}
