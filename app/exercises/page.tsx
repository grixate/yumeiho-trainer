import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/empty-state";
import { EditorialHeader, LearningShell } from "@/components/learning-layout";
import { LearningSearch } from "@/components/learning-search";
import { ExerciseResultCard } from "@/components/practical-ui";
import { exerciseOrderNumber, filterExercises, getExerciseFilterOptions } from "@/lib/practical-content";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ExercisesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = {
    q: param(params?.q)?.trim() ?? "",
    category: param(params?.category),
    bodyZone: param(params?.bodyZone),
    difficulty: param(params?.difficulty),
    sequenceRole: param(params?.sequenceRole),
  };

  const allExercises = (await prisma.exercise.findMany()).sort(
    (a, b) => exerciseOrderNumber(a) - exerciseOrderNumber(b) || a.title.localeCompare(b.title, "ru"),
  );
  const exercises = filterExercises(allExercises, filters);
  const options = getExerciseFilterOptions(allExercises);

  return (
    <LearningShell width="narrow" className="space-y-5">
      <EditorialHeader
        eyebrow="Быстрый поиск"
        title="Приемы"
        description="Откройте нужную карточку за несколько секунд: цель, положение, шаги и осторожность без лишнего слоя."
      >
        <LearningSearch
          placeholder="Номер, название, зона или действие..."
          defaultValue={filters.q}
          filters={[
            { name: "bodyZone", label: "Зона тела", options: options.bodyZones },
            { name: "category", label: "Категория", options: options.categories },
            { name: "difficulty", label: "Сложность", options: options.difficulties },
            { name: "sequenceRole", label: "Роль в потоке", options: options.sequenceRoles },
          ]}
        />
      </EditorialHeader>

      <div className="text-sm text-stone-500">
        {exercises.length} из {allExercises.length} приемов
      </div>

      {exercises.length ? (
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <ExerciseResultCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <EmptyState title="Приемы не найдены">Снимите фильтр или попробуйте другое слово из карточки.</EmptyState>
      )}
    </LearningShell>
  );
}
