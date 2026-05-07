import Link from "next/link";
import { Exercise } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { asStringArray, formatDifficulty } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/learning-layout";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const keyActions = asStringArray(exercise.keyPoints).length
    ? asStringArray(exercise.keyPoints)
    : asStringArray(exercise.steps);
  const preview = readPreview(exercise.preview);
  const goals = preview.goal.length ? preview.goal : exercise.goals;
  const actions = preview.keyActions.length ? preview.keyActions : keyActions;

  return (
    <LearningCard className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full bg-stone-50">{exercise.category}</Badge>
            {exercise.originalNumber ? <Badge variant="secondary" className="rounded-full">№ {exercise.originalNumber}</Badge> : null}
            <Badge className="rounded-full">{formatDifficulty(exercise.difficulty)}</Badge>
          </div>
          <h2 className="text-pretty text-2xl font-semibold leading-8 text-stone-950">{exercise.title}</h2>
        </div>
        <Button asChild variant="outline" size="sm" className="w-fit rounded-full">
          <Link href={`/exercises/${exercise.slug}`}>
            Открыть <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 text-sm leading-6 text-stone-700 sm:grid-cols-3">
        <PreviewBlock title="Цель" items={goals.slice(0, 2)} />
        <PreviewBlock title="Ключевые действия" items={actions.slice(0, 2)} />
        <PreviewBlock title="Зоны" items={exercise.bodyZones.slice(0, 3)} />
      </div>
      <div>
        {exercise.expectedEffect ? (
          <p className="text-sm leading-6 text-stone-600">{exercise.expectedEffect}</p>
        ) : null}
      </div>
    </LearningCard>
  );
}

function readPreview(value: unknown) {
  if (!value || typeof value !== "object") return { goal: [], keyActions: [] };
  const preview = value as Record<string, unknown>;
  return {
    goal: asStringArray(preview.goal),
    keyActions: asStringArray(preview.keyActions),
  };
}

function PreviewBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{title}</div>
      <ul className="space-y-1">
        {(items.length ? items : ["Не указано"]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
