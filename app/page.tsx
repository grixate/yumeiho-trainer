import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Brain, ClipboardList, Library, Waypoints } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getGlobalSearchResults } from "@/lib/search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseCard } from "@/components/exercise-card";
import { TheoryCardPreview } from "@/components/theory-card-preview";
import { EditorialHeader, LearningCard, LearningShell } from "@/components/learning-layout";
import { SearchForm } from "@/components/search-form";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Dashboard({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = param(params?.q) ?? "";
  const [recentExercises, recentTheory, reviewCount, searchResults] = await Promise.all([
    prisma.exercise.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
    prisma.theoryCard.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
    prisma.reviewResult.count(),
    getGlobalSearchResults(q),
  ]);

  const quickLinks = [
    { href: "/exercises", label: "Приемы", icon: Library },
    { href: "/theory", label: "Знания", icon: BookOpen },
    { href: "/study", label: "Тренировка", icon: Brain },
    { href: "/sequences", label: "Потоки", icon: Waypoints },
    { href: "/practice-log", label: "Журнал практики", icon: ClipboardList },
  ];

  return (
    <LearningShell width="wide" className="space-y-9">
      <section className="clinical-panel rounded-3xl border border-emerald-100/80 p-6 shadow-[0_22px_60px_rgba(41,37,36,0.06)] sm:p-8">
        <EditorialHeader
          eyebrow="Yumeiho Trainer"
          title="Память последовательностей для практики Юмейхо"
          description="Ищите, изучайте и повторяйте терапевтическую хореографию спокойно, структурно и без лишнего шума."
        >
        <SearchForm
          placeholder="Искать приемы, теорию, потоки..."
          defaultValue={q}
        />
        </EditorialHeader>
        <div className="mt-5 flex flex-wrap gap-2">
          {quickLinks.map((item) => (
            <Button key={item.href} asChild variant="outline" size="sm" className="rounded-full bg-white/75">
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {q ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Результаты поиска</h2>
          <div className="grid gap-3 lg:grid-cols-3">
            <ResultColumn title="Приемы">
              {searchResults.exercises.map((item) => (
                <ResultLink key={item.id} href={`/exercises/${item.slug}`} title={item.title} meta={item.category} />
              ))}
            </ResultColumn>
            <ResultColumn title="Знания">
              {searchResults.theoryCards.map((item) => (
                <ResultLink key={item.id} href={`/theory/${item.id}`} title={item.title} meta={item.topic} />
              ))}
            </ResultColumn>
            <ResultColumn title="Потоки">
              {searchResults.sequences.map((item) => (
                <ResultLink key={item.id} href={`/sequences/${item.slug}`} title={item.title} meta={item.useCase} />
              ))}
            </ResultColumn>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <LearningCard>
          <h2 className="mb-4 text-xl font-semibold text-stone-950">Продолжить тренировку</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild className="h-20 justify-between rounded-2xl px-5">
              <Link href="/study/theory-flashcards">
                Карточки теории <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="h-20 justify-between rounded-2xl px-5">
              <Link href="/study/practice-recall">
                Вспоминание приемов <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </LearningCard>
        <LearningCard>
          <h2 className="mb-4 text-xl font-semibold text-stone-950">История тренировки</h2>
            <div className="text-4xl font-semibold text-emerald-950">{reviewCount}</div>
            <p className="mt-2 text-sm text-stone-600">событий повторения сохранено для будущей интервальной тренировки.</p>
        </LearningCard>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Недавние приемы</h2>
          <Button asChild variant="ghost" size="sm"><Link href="/exercises">Все</Link></Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {recentExercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Недавние карточки знаний</h2>
          <Button asChild variant="ghost" size="sm"><Link href="/theory">Все</Link></Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {recentTheory.map((card) => <TheoryCardPreview key={card.id} card={card} />)}
        </div>
      </section>
    </LearningShell>
  );
}

function ResultColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

function ResultLink({ href, title, meta }: { href: string; title: string; meta: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-stone-200 bg-white/75 p-3 hover:border-emerald-700">
      <div className="font-medium">{title}</div>
      <Badge variant="secondary" className="mt-2">{meta}</Badge>
    </Link>
  );
}
