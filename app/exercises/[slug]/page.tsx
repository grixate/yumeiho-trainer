import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit, Brain } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { exerciseWarnings } from "@/lib/sequence-blocks";
import { asStringArray, formatDifficulty } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MemoryList } from "@/components/exercise-memory-card";
import { EditorialHeader, LearningCard, LearningShell } from "@/components/learning-layout";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ExerciseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const exercise = await prisma.exercise.findUnique({ where: { slug } });
  if (!exercise) notFound();
  const keyActions = asStringArray(exercise.keyPoints).length
    ? asStringArray(exercise.keyPoints)
    : asStringArray(exercise.steps);

  return (
    <LearningShell>
      <EditorialHeader
        eyebrow={exercise.originalNumber ? `Прием ${exercise.originalNumber}` : exercise.category}
        title={exercise.title}
        description={`${exercise.category} · ${formatDifficulty(exercise.difficulty)}`}
        action={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/admin/exercises/${exercise.id}/edit`}>
                <Edit className="h-4 w-4" />
                Править
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href={`/study/practice-recall?exerciseId=${exercise.id}`}>
                <Brain className="h-4 w-4" />
                Вспомнить
              </Link>
            </Button>
          </>
        }
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {exercise.bodyZones.slice(0, 5).map((zone) => (
            <Badge key={zone} variant="outline" className="shrink-0 rounded-full bg-white">
              {zone}
            </Badge>
          ))}
        </div>
      </EditorialHeader>

      <LearningCard className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <MemoryList title="Цель" items={exercise.goals.slice(0, 3)} />
          <MemoryList title="Ключевые действия" items={keyActions.slice(0, 3)} />
          <MemoryList title="Предупреждения" items={exerciseWarnings(exercise).slice(0, 3)} caution />
          <section className="text-sm leading-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Ожидаемый эффект</div>
            <p className="text-stone-700">{exercise.expectedEffect || "Не указано"}</p>
          </section>
        </div>
        <Separator />
        <div className="grid gap-5 text-sm leading-7 sm:grid-cols-2">
            <InfoLine label="Пациент" value={exercise.clientPosition} />
            <InfoLine label="Терапевт" value={exercise.practitionerPosition} />
        </div>
      </LearningCard>

      <LearningCard>
        <h2 className="mb-4 text-xl font-semibold text-stone-950">Пошаговый алгоритм</h2>
          <ol className="grid list-decimal gap-3 pl-5 leading-7 text-stone-700">
            {asStringArray(exercise.steps).map((step) => <li key={step}>{step}</li>)}
          </ol>
      </LearningCard>

      <div className="grid gap-4">
        <Section title="Ключевые моменты" items={asStringArray(exercise.keyPoints)} />
        <Section title="Частые ошибки" items={asStringArray(exercise.commonMistakes)} />
        <Section title="Противопоказания / осторожность" items={asStringArray(exercise.contraindications)} caution />
      </div>

      <LearningCard className="grid gap-5">
          <TextBlock title="Ощущение пациента" value={exercise.clientFeeling} />
          <Separator />
          <TextBlock title="Личные заметки" value={exercise.personalNotes} />
          <Separator />
          <TextBlock title="Источник" value={exercise.sourceReference} />
      </LearningCard>
    </LearningShell>
  );
}

function InfoLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</div>
      <div className="text-stone-800">{value || "Не указано"}</div>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value?: string | null }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-stone-950">{title}</h2>
      <p className="leading-7 text-stone-700">{value || "Не указано"}</p>
    </section>
  );
}

function Section({ title, items, caution }: { title: string; items: string[]; caution?: boolean }) {
  return (
    <LearningCard>
      <h2 className="mb-3 text-lg font-semibold text-stone-950">{title}</h2>
        <ul className="space-y-2 text-sm leading-6 text-stone-700">
          {(items.length ? items : ["Не указано"]).map((item) => (
            <li key={item} className={caution ? "text-amber-900" : ""}>- {item}</li>
          ))}
        </ul>
    </LearningCard>
  );
}
