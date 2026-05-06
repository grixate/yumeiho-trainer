import { ExerciseForm } from "@/components/exercise-form";
import { PageHeader } from "@/components/page-header";

export default function NewExercisePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Новый прием" description="Создать практическую карточку приема Юмейхо." />
      <ExerciseForm />
    </div>
  );
}
