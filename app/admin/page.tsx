import Link from "next/link";
import { FileJson, Library, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function AdminPage() {
  const actions = [
    {
      href: "/admin/exercises/new",
      title: "Новый прием",
      description: "Создать практическую карточку с шагами, целями, положениями и предупреждениями.",
      icon: Library,
    },
    {
      href: "/admin/theory/new",
      title: "Новая карточка теории",
      description: "Создать учебную карточку, связывающую понятие с практикой.",
      icon: NotebookPen,
    },
    {
      href: "/admin/import",
      title: "Импорт JSON",
      description: "Вставить структурированные приемы, карточки теории и последовательности.",
      icon: FileJson,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Управление" description="Простые инструменты редактирования для развития личной библиотеки практики." />
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Card key={action.href}>
            <CardHeader>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-950 text-white">
                <action.icon className="h-5 w-5" />
              </div>
              <CardTitle>{action.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-stone-600">{action.description}</p>
              <Button asChild variant="outline">
                <Link href={action.href}>Открыть</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
