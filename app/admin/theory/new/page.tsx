import { TheoryForm } from "@/components/theory-form";
import { PageHeader } from "@/components/page-header";

export default function NewTheoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Новая карточка теории" description="Создать карточку вопрос-ответ с практическим смыслом." />
      <TheoryForm />
    </div>
  );
}
