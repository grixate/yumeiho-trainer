import { prisma } from "@/lib/prisma";
import { orderedSequenceExercises, sequenceBlocks } from "@/lib/sequence-blocks";
import { EmptyState } from "@/components/empty-state";
import { EditorialHeader, LearningShell } from "@/components/learning-layout";
import { SequenceCard } from "@/components/practical-ui";
import { sequenceOrderNumber } from "@/lib/practical-content";

export default async function SequencesPage() {
  const sequences = await prisma.practiceSequence.findMany();
  const allExerciseIds = [...new Set(sequences.flatMap((sequence) => sequence.exerciseIds))];
  const exercises = allExerciseIds.length
    ? await prisma.exercise.findMany({ where: { id: { in: allExerciseIds } } })
    : [];
  const sequenceCards = sequences
    .map((sequence) => {
      const ordered = orderedSequenceExercises(sequence, exercises);
      const blocks = sequenceBlocks(sequence, ordered);
      return {
        sequence,
        ordered,
        blockCount: blocks.length,
        order: sequenceOrderNumber(ordered),
      };
    })
    .sort((a, b) => a.order - b.order || a.sequence.title.localeCompare(b.sequence.title, "ru"));

  return (
    <LearningShell width="narrow" className="space-y-5">
      <EditorialHeader
        eyebrow="Порядок работы"
        title="Потоки"
        description="Сначала общий порядок блоков, затем детали только там, где они нужны."
      />
      {sequences.length ? (
        <div className="space-y-3">
          {sequenceCards.map(({ sequence, ordered, blockCount }) => {
            return (
              <SequenceCard
                key={sequence.id}
                sequence={sequence}
                exercises={ordered}
                blockCount={blockCount}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState title="Потоков пока нет">Импортируйте приемы, чтобы начать строить процедурную память.</EmptyState>
      )}
    </LearningShell>
  );
}
