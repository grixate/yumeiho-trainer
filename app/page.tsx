import Link from "next/link";
import { ArrowRight, Search, Waypoints } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LearningCard, LearningShell } from "@/components/learning-layout";
import { SearchForm } from "@/components/search-form";
import { ExerciseResultCard } from "@/components/practical-ui";

export default async function HomePage() {
  const [recentExercises, sequenceCount] = await Promise.all([
    prisma.exercise.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
    prisma.practiceSequence.count(),
  ]);

  return (
    <LearningShell width="narrow" className="space-y-6">
      <section className="space-y-5 border-b border-stone-200/80 pb-6">
        <div className="space-y-3">
          <Badge className="rounded-full">Yumeiho Trainer</Badge>
          <h1 className="text-pretty text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Найти прием. Вспомнить порядок. Вернуться к практике.
          </h1>
          <p className="text-base leading-7 text-stone-600">
            Минимальный рабочий экран для процедурной памяти: поиск, карточки приемов и потоки без лишней теории на пути.
          </p>
        </div>
        <SearchForm
          action="/exercises"
          placeholder="Искать номер, зону, цель или действие..."
          className="rounded-2xl border border-stone-200 bg-white/90 p-2 shadow-[0_18px_45px_rgba(41,37,36,0.05)]"
        />
        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="h-12 rounded-xl">
            <Link href="/exercises">
              <Search className="h-4 w-4" />
              Приемы
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-xl bg-white/80">
            <Link href="/sequences">
              <Waypoints className="h-4 w-4" />
              Потоки
            </Link>
          </Button>
        </div>
      </section>

      <LearningCard className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Последовательности</div>
          <p className="mt-1 text-sm leading-6 text-stone-600">{sequenceCount} потоков для повторения порядка блоков.</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full">
          <Link href="/sequences">
            Открыть <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </LearningCard>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-950">Недавние приемы</h2>
          <Link href="/exercises" className="text-sm font-medium text-stone-500 hover:text-stone-950">
            Все
          </Link>
        </div>
        <div className="space-y-3">
          {recentExercises.map((exercise) => (
            <ExerciseResultCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </section>
    </LearningShell>
  );
}
