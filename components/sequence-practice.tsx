"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ListCollapse, ListTree, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BulletList, WarningBox } from "@/components/practical-bits";
import { cn } from "@/lib/utils";

export type PracticeExerciseView = {
  id: string;
  slug: string;
  title: string;
  originalNumber?: string | null;
  category: string;
  difficulty: string;
  bodyZones: string[];
  goals: string[];
  clientPosition?: string | null;
  practitionerPosition?: string | null;
  steps: string[];
  keyActions: string[];
  warnings: string[];
};

export type PracticeSequenceBlockView = {
  title: string;
  description: string;
  exercises: PracticeExerciseView[];
};

export type PracticeSequenceView = {
  slug: string;
  title: string;
  description?: string | null;
  useCase: string;
  notes?: string | null;
};

export function SequenceDetailClient({
  sequence,
  blocks,
}: {
  sequence: PracticeSequenceView;
  blocks: PracticeSequenceBlockView[];
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [timelineMode, setTimelineMode] = useState(false);

  const expandedSet = useMemo(() => new Set(expanded), [expanded]);
  const allOpen = expanded.length === blocks.length;

  function toggleBlock(title: string) {
    setExpanded((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    );
  }

  function expandAll() {
    const next = allOpen ? [] : blocks.map((block) => block.title);
    setExpanded(next);
    if (next.length) setTimelineMode(true);
  }

  return (
    <div className="space-y-5">
      <header className="space-y-4 border-b border-stone-200/80 pb-5">
        <Link href="/sequences" className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-950">
          <ChevronLeft className="h-4 w-4" />
          Все потоки
        </Link>
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full bg-white">
              {sequence.useCase}
            </Badge>
            <Badge className="rounded-full">
              {blocks.reduce((sum, block) => sum + block.exercises.length, 0)} приемов
            </Badge>
          </div>
          <h1 className="text-pretty text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            {sequence.title}
          </h1>
          {sequence.description ? (
            <p className="mt-3 text-base leading-7 text-stone-600">{sequence.description}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={expandAll}>
            <ListCollapse className="h-4 w-4" />
            {allOpen ? "Свернуть" : "Развернуть"}
          </Button>
          <Button
            type="button"
            variant={timelineMode ? "default" : "outline"}
            className="h-11 rounded-xl"
            onClick={() => setTimelineMode((value) => !value)}
          >
            <ListTree className="h-4 w-4" />
            Линия
          </Button>
          <Button asChild className="col-span-2 h-11 rounded-xl sm:col-span-1">
            <Link href={`/sequences/${sequence.slug}/focus`}>
              <Maximize2 className="h-4 w-4" />
              Фокус
            </Link>
          </Button>
        </div>
      </header>

      {sequence.notes ? (
        <WarningBox items={[sequence.notes]} compact />
      ) : null}

      <div
        className={cn(
          "space-y-3",
          timelineMode &&
            "relative pl-5 before:absolute before:bottom-7 before:left-[9px] before:top-5 before:w-px before:bg-stone-200",
        )}
      >
        {blocks.map((block, index) => {
          const isOpen = expandedSet.has(block.title);
          return (
            <section key={`${block.title}-${index}`} className="relative">
              {timelineMode ? (
                <div className="absolute -left-5 top-5 h-4 w-4 rounded-full border-4 border-stone-50 bg-emerald-950" />
              ) : null}
              <button
                type="button"
                onClick={() => toggleBlock(block.title)}
                className="w-full rounded-2xl border border-stone-200 bg-white/90 p-4 text-left shadow-[0_12px_32px_rgba(41,37,36,0.035)] transition hover:border-emerald-900/25"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/70">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h2 className="text-pretty text-lg font-semibold text-stone-950">{block.title}</h2>
                    {block.description ? (
                      <p className="mt-1 text-sm leading-6 text-stone-600">{block.description}</p>
                    ) : null}
                  </div>
                  <Badge variant="secondary" className="shrink-0 rounded-full">
                    {block.exercises.length} приемов
                  </Badge>
                </div>
              </button>
              {(isOpen || timelineMode) ? (
                <div className={cn("mt-3 space-y-3", timelineMode && "pl-3")}>
                  {block.exercises.map((exercise) => (
                    <SequenceExercisePreview key={exercise.id} exercise={exercise} />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function FocusModeExercise({
  sequence,
  blocks,
}: {
  sequence: PracticeSequenceView;
  blocks: PracticeSequenceBlockView[];
}) {
  const routerHref = `/sequences/${sequence.slug}`;
  const items = useMemo(
    () =>
      blocks.flatMap((block) =>
        block.exercises.map((exercise) => ({
          blockTitle: block.title,
          exercise,
        })),
      ),
    [blocks],
  );
  const [index, setIndex] = useState(0);
  const current = items[index];

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") setIndex((value) => Math.max(0, value - 1));
      if (event.key === "ArrowRight") setIndex((value) => Math.min(items.length - 1, value + 1));
      if (event.key === "Escape") window.location.href = routerHref;
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [items.length, routerHref]);

  if (!current) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-stone-950">{sequence.title}</h1>
        <p className="text-stone-600">В этом потоке пока нет приемов.</p>
        <Button asChild className="rounded-xl">
          <Link href={routerHref}>Назад к потоку</Link>
        </Button>
      </div>
    );
  }

  const exercise = current.exercise;

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col gap-5">
      <header className="space-y-3 border-b border-stone-200 pb-4">
        <Link href={routerHref} className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-950">
          <ChevronLeft className="h-4 w-4" />
          Выйти
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/70">{sequence.title}</p>
          <h1 className="mt-1 text-pretty text-2xl font-semibold tracking-tight text-stone-950">
            {exercise.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full">
            {index + 1} / {items.length}
          </Badge>
          <Badge variant="outline" className="rounded-full bg-white">
            {current.blockTitle}
          </Badge>
        </div>
      </header>

      <main className="grid flex-1 gap-5">
        <FocusSection title="Цель">
          <BulletList items={exercise.goals} />
        </FocusSection>
        <FocusSection title="Положение">
          <div className="grid gap-3 text-[15px] leading-7">
            <div className="rounded-xl bg-stone-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">Пациент</div>
              <div className="mt-1 text-stone-800">{exercise.clientPosition || "Не указано"}</div>
            </div>
            <div className="rounded-xl bg-stone-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">Терапевт</div>
              <div className="mt-1 text-stone-800">{exercise.practitionerPosition || "Не указано"}</div>
            </div>
          </div>
        </FocusSection>
        <FocusSection title="Шаги">
          <BulletList items={exercise.steps} ordered />
        </FocusSection>
        <WarningBox items={exercise.warnings} />
      </main>

      <nav className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-2 border-t border-stone-200 bg-stone-50/94 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl"
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </Button>
        <Button
          type="button"
          className="h-12 rounded-xl"
          disabled={index >= items.length - 1}
          onClick={() => setIndex((value) => Math.min(items.length - 1, value + 1))}
        >
          Дальше
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}

function SequenceExercisePreview({ exercise }: { exercise: PracticeExerciseView }) {
  return (
    <article className="rounded-2xl border border-stone-200/85 bg-white p-4 shadow-[0_12px_30px_rgba(41,37,36,0.035)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap gap-2">
            {exercise.originalNumber ? (
              <Badge variant="outline" className="rounded-full bg-stone-50">
                № {exercise.originalNumber.replace(/^Прием\s*№?\s*/i, "")}
              </Badge>
            ) : null}
            <Badge variant="secondary" className="rounded-full">
              {exercise.category}
            </Badge>
          </div>
          <h3 className="text-pretty text-lg font-semibold leading-7 text-stone-950">{exercise.title}</h3>
        </div>
      </div>
      <div className="grid gap-4">
        <MiniSection title="Цель" items={exercise.goals.slice(0, 2)} />
        <MiniSection title="Ключевые действия" items={exercise.keyActions.slice(0, 2)} />
        <WarningBox items={exercise.warnings.slice(0, 2)} compact />
      </div>
      <Button asChild variant="ghost" size="sm" className="mt-3 rounded-full px-0 text-emerald-950 hover:bg-transparent">
        <Link href={`/exercises/${exercise.slug}`}>
          Открыть полную карточку <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </article>
  );
}

function MiniSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <div className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{title}</div>
      <BulletList items={items} className="text-sm leading-6" />
    </section>
  );
}

function FocusSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/75">{title}</h2>
      {children}
    </section>
  );
}
