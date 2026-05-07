import Link from "next/link";
import type { Exercise } from "@prisma/client";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { exerciseWarnings } from "@/lib/sequence-blocks";
import { asStringArray, formatDifficulty } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/learning-layout";

export function ExerciseMemoryCard({
  exercise,
  index,
  compact = false,
}: {
  exercise: Exercise;
  index?: number;
  compact?: boolean;
}) {
  const actions = asStringArray(exercise.keyPoints).length
    ? asStringArray(exercise.keyPoints)
    : asStringArray(exercise.steps);
  const preview = readPreview(exercise.preview);
  const goals = preview.goal.length ? preview.goal : exercise.goals;
  const keyActions = preview.keyActions.length ? preview.keyActions : actions;
  const warnings = preview.warnings.length ? preview.warnings : exerciseWarnings(exercise);

  return (
    <LearningCard className={compact ? "p-4" : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {index !== undefined ? (
              <span className="rounded-full bg-emerald-950 px-2.5 py-1 text-xs font-semibold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            {exercise.originalNumber ? <Badge variant="outline">Прием {exercise.originalNumber}</Badge> : null}
            <Badge variant="secondary">{formatDifficulty(exercise.difficulty)}</Badge>
          </div>
          <h3 className="text-pretty text-xl font-semibold leading-7 text-stone-950">{exercise.title}</h3>
          <p className="mt-1 text-sm text-stone-500">{exercise.category}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 text-sm leading-6 text-stone-700">
        <MemoryList title="Цель" items={goals.slice(0, compact ? 2 : 3)} />
        <MemoryList title="Ключевые действия" items={keyActions.slice(0, compact ? 2 : 3)} />
        <MemoryList title="Предупреждения" items={warnings.slice(0, compact ? 1 : 2)} caution />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {exercise.bodyZones.slice(0, 3).map((zone) => (
          <Badge key={zone} variant="outline" className="rounded-full bg-stone-50">
            {zone}
          </Badge>
        ))}
      </div>

      <Button asChild variant="ghost" size="sm" className="mt-4 rounded-full px-0 text-emerald-950 hover:bg-transparent">
        <Link href={`/exercises/${exercise.slug}`}>
          Открыть полную карточку <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </LearningCard>
  );
}

function readPreview(value: unknown) {
  if (!value || typeof value !== "object") return { goal: [], keyActions: [], warnings: [] };
  const preview = value as Record<string, unknown>;
  return {
    goal: asStringArray(preview.goal),
    keyActions: asStringArray(preview.keyActions),
    warnings: asStringArray(preview.warnings),
  };
}

export function MemoryList({ title, items, caution }: { title: string; items: string[]; caution?: boolean }) {
  const visible = items.length ? items : ["Не указано"];
  return (
    <section>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        {caution ? <TriangleAlert className="h-3.5 w-3.5 text-amber-700" /> : null}
        {title}
      </div>
      <ul className="space-y-1.5">
        {visible.map((item) => (
          <li key={item} className={caution ? "text-amber-950" : undefined}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
