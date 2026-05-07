import Link from "next/link";
import type { ReactNode } from "react";
import type { Exercise, PracticeSequence } from "@prisma/client";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LearningCard } from "@/components/learning-layout";
import { BulletList, WarningBox } from "@/components/practical-bits";
import {
  practicalGoals,
  practicalWarnings,
  mainBodyZones,
} from "@/lib/practical-content";
import { asStringArray, formatDifficulty } from "@/lib/utils";

export function ExerciseResultCard({ exercise }: { exercise: Exercise }) {
  const goals = practicalGoals(exercise).slice(0, 2);

  return (
    <Link
      href={`/exercises/${exercise.slug}`}
      className="block rounded-2xl border border-stone-200/85 bg-white/90 p-4 shadow-[0_14px_36px_rgba(41,37,36,0.04)] transition hover:border-emerald-900/30 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {exercise.originalNumber ? (
              <Badge variant="outline" className="rounded-full bg-stone-50">
                № {exercise.originalNumber.replace(/^Прием\s*№?\s*/i, "")}
              </Badge>
            ) : null}
            <Badge variant="secondary" className="rounded-full">
              {formatDifficulty(exercise.difficulty)}
            </Badge>
          </div>
          <h2 className="text-pretty text-lg font-semibold leading-7 text-stone-950">{exercise.title}</h2>
          <p className="mt-1 text-sm text-stone-500">{exercise.category}</p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-stone-400" />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {exercise.bodyZones.slice(0, 4).map((zone) => (
          <span
            key={zone}
            className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600"
          >
            {zone}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <div className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Цель</div>
        <BulletList items={goals} className="text-sm leading-6" />
      </div>
    </Link>
  );
}

export function ExerciseDetailCard({
  exercise,
  sequenceContext,
}: {
  exercise: Exercise;
  sequenceContext?: {
    sequenceSlug?: string;
    previousExerciseSlug?: string;
    nextExerciseSlug?: string;
  };
}) {
  const goals = practicalGoals(exercise);
  const warnings = practicalWarnings(exercise);
  const defaultAccordions = [
    asStringArray(exercise.keyPoints).length ? "key-points" : "",
    asStringArray(exercise.commonMistakes).length ? "common-mistakes" : "",
  ].filter(Boolean);

  return (
    <div className="space-y-5 pb-20 sm:pb-0">
      <Link href="/exercises" className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-950">
        <ChevronLeft className="h-4 w-4" />
        Все приемы
      </Link>

      <LearningCard className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {exercise.originalNumber ? (
              <Badge className="rounded-full">№ {exercise.originalNumber.replace(/^Прием\s*№?\s*/i, "")}</Badge>
            ) : null}
            <Badge variant="outline" className="rounded-full bg-white">
              {formatDifficulty(exercise.difficulty)}
            </Badge>
            {exercise.sequenceRole ? (
              <Badge variant="secondary" className="rounded-full">
                {exercise.sequenceRole}
              </Badge>
            ) : null}
            {exercise.intensity ? (
              <Badge variant="secondary" className="rounded-full">
                {exercise.intensity}
              </Badge>
            ) : null}
          </div>
          <h1 className="text-pretty text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            {exercise.title}
          </h1>
          <p className="text-sm text-stone-500">{exercise.category}</p>
        </div>

        <PracticalSection title="Цель">
          <BulletList items={goals} />
        </PracticalSection>

        <PracticalSection title="Положение">
          <div className="grid gap-3 text-[15px] leading-7 sm:grid-cols-2">
            <InfoLine label="Пациент" value={exercise.clientPosition} />
            <InfoLine label="Терапевт" value={exercise.practitionerPosition} />
          </div>
        </PracticalSection>

        <PracticalSection title="Шаги">
          <BulletList items={asStringArray(exercise.steps)} ordered />
        </PracticalSection>

        <WarningBox items={warnings} />
      </LearningCard>

      <LearningCard className="p-1 sm:p-2">
        <Accordion type="multiple" defaultValue={defaultAccordions} className="px-4">
          <DetailAccordionItem value="key-points" title="Ключевые моменты" items={asStringArray(exercise.keyPoints)} />
          <DetailAccordionItem
            value="common-mistakes"
            title="Частые ошибки"
            items={asStringArray(exercise.commonMistakes)}
          />
          <DetailAccordionText value="expected-effect" title="Ожидаемый эффект" text={exercise.expectedEffect} />
          <DetailAccordionText value="client-feeling" title="Ощущение пациента" text={exercise.clientFeeling} />
          <DetailAccordionItem value="related-exercises" title="Связанные приемы" items={exercise.relatedExercises} />
          <DetailAccordionText value="source" title="Источник" text={exercise.sourceReference} />
        </Accordion>
      </LearningCard>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/92 px-4 py-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-[760px] gap-2">
          <Button asChild variant="outline" className="h-11 flex-1 rounded-xl">
            <Link href="/exercises">Назад</Link>
          </Button>
          {sequenceContext?.sequenceSlug ? (
            <Button asChild variant="secondary" className="h-11 flex-1 rounded-xl">
              <Link href={`/sequences/${sequenceContext.sequenceSlug}`}>В потоке</Link>
            </Button>
          ) : null}
          {sequenceContext?.nextExerciseSlug ? (
            <Button asChild className="h-11 flex-1 rounded-xl">
              <Link href={`/exercises/${sequenceContext.nextExerciseSlug}`}>Дальше</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SequenceCard({
  sequence,
  exercises,
  blockCount,
}: {
  sequence: PracticeSequence;
  exercises: Exercise[];
  blockCount: number;
}) {
  return (
    <LearningCard className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge variant="outline" className="mb-3 rounded-full bg-stone-50">
            {sequence.useCase}
          </Badge>
          <h2 className="text-pretty text-2xl font-semibold tracking-tight text-stone-950">{sequence.title}</h2>
          {sequence.description ? (
            <p className="mt-2 text-sm leading-6 text-stone-600">{sequence.description}</p>
          ) : null}
        </div>
        <Button asChild size="sm" className="shrink-0 rounded-full">
          <Link href={`/sequences/${sequence.slug}`}>Открыть</Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="secondary" className="rounded-full">
          {blockCount} блоков
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          {sequence.exerciseIds.length} приемов
        </Badge>
        {mainBodyZones(exercises).map((zone) => (
          <Badge key={zone} variant="outline" className="rounded-full bg-white">
            {zone}
          </Badge>
        ))}
      </div>
    </LearningCard>
  );
}

function PracticalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/75">{title}</h2>
      {children}
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl bg-stone-50 px-3 py-2">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{label}</div>
      <div className="mt-1 text-stone-800">{value || "Не указано"}</div>
    </div>
  );
}

function DetailAccordionItem({ value, title, items }: { value: string; title: string; items: string[] }) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <BulletList items={items} />
      </AccordionContent>
    </AccordionItem>
  );
}

function DetailAccordionText({ value, title, text }: { value: string; title: string; text?: string | null }) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <p className="text-[15px] leading-7 text-stone-700">{text || "Не указано"}</p>
      </AccordionContent>
    </AccordionItem>
  );
}
