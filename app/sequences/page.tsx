import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { flowPreview } from "@/lib/sequence-blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { EditorialHeader, LearningCard, LearningShell } from "@/components/learning-layout";

export default async function SequencesPage() {
  const sequences = await prisma.practiceSequence.findMany({ orderBy: { title: "asc" } });
  const allExerciseIds = [...new Set(sequences.flatMap((sequence) => sequence.exerciseIds))];
  const exercises = allExerciseIds.length
    ? await prisma.exercise.findMany({ where: { id: { in: allExerciseIds } } })
    : [];

  return (
    <LearningShell>
      <EditorialHeader
        eyebrow="Терапевтический поток"
        title="Потоки"
        description="Упорядоченные последовательности для запоминания подготовки, коррекции и интеграции как единого ритма."
      />
      {sequences.length ? (
        <div className="space-y-4">
          {sequences.map((sequence) => {
            const ordered = sequence.exerciseIds
              .map((id) => exercises.find((exercise) => exercise.id === id))
              .filter((exercise): exercise is NonNullable<typeof exercise> => Boolean(exercise));
            const preview = flowPreview(ordered).slice(0, 5);

            return (
              <LearningCard key={sequence.id} className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge variant="outline" className="mb-3 rounded-full bg-stone-50">
                      {sequence.useCase}
                    </Badge>
                    <h2 className="text-2xl font-semibold tracking-tight text-stone-950">{sequence.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-stone-600">{sequence.description}</p>
                  </div>
                  <Badge className="w-fit rounded-full">{sequence.exerciseIds.length} приемов</Badge>
                </div>
                {preview.length ? (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {preview.map((block, index) => (
                      <span
                        key={`${block}-${index}`}
                        className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600"
                      >
                        {block}
                      </span>
                    ))}
                  </div>
                ) : null}
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={`/sequences/${sequence.slug}`}>Открыть поток</Link>
                </Button>
              </LearningCard>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Потоков пока нет">Импортируйте приемы, чтобы начать строить процедурную память.</EmptyState>
      )}
    </LearningShell>
  );
}
