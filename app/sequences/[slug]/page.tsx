import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { inferSequenceBlocks, orderedSequenceExercises } from "@/lib/sequence-blocks";
import { Badge } from "@/components/ui/badge";
import { ExerciseMemoryCard } from "@/components/exercise-memory-card";
import { EditorialHeader, LearningCard, LearningShell } from "@/components/learning-layout";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SequenceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const sequence = await prisma.practiceSequence.findUnique({ where: { slug } });
  if (!sequence) notFound();

  const exercises = await prisma.exercise.findMany({
    where: { id: { in: sequence.exerciseIds } },
  });
  const ordered = orderedSequenceExercises(sequence, exercises);
  const blocks = inferSequenceBlocks(ordered);

  return (
    <LearningShell>
      <EditorialHeader eyebrow="Последовательность" title={sequence.title} description={sequence.description ?? sequence.useCase}>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full bg-white">{sequence.useCase}</Badge>
          <Badge className="rounded-full">{ordered.length} приемов</Badge>
        </div>
      </EditorialHeader>
      {sequence.notes ? (
        <LearningCard className="border-amber-200 bg-amber-50/70 text-sm leading-6 text-amber-950">
          {sequence.notes}
        </LearningCard>
      ) : null}
      <div className="relative space-y-8 pl-6 before:absolute before:bottom-8 before:left-[11px] before:top-2 before:w-px before:bg-stone-200">
        {blocks.map((block) => {
          let runningIndex = 0;
          for (const previous of blocks.slice(0, blocks.indexOf(block))) runningIndex += previous.exercises.length;

          return (
            <section key={`${block.title}-${runningIndex}`} className="relative space-y-4">
              <div className="absolute -left-6 top-1.5 h-5 w-5 rounded-full border-4 border-stone-50 bg-emerald-950 shadow-sm" />
              <div className="rounded-2xl border border-stone-200/80 bg-stone-100/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900/75">Блок</div>
                <h2 className="mt-1 text-xl font-semibold text-stone-950">{block.title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{block.description}</p>
              </div>
              <div className="space-y-4">
                {block.exercises.map((exercise, index) => (
                  <ExerciseMemoryCard
                    key={exercise.id}
                    exercise={exercise}
                    index={runningIndex + index}
                    compact
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <Link href="/sequences" className="inline-flex text-sm font-medium text-stone-500 hover:text-stone-950">
        Назад к потокам
      </Link>
    </LearningShell>
  );
}
