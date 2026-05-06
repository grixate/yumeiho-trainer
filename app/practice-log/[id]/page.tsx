import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PracticeLogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const log = await prisma.practiceLog.findUnique({ where: { id } });
  if (!log) notFound();
  const exercises = await prisma.exercise.findMany({ where: { id: { in: log.exerciseIds } } });

  return (
    <div className="space-y-6">
      <PageHeader title={log.title} description={`Записано ${formatDate(log.createdAt)}`} />
      <Card>
        <CardContent className="flex flex-wrap gap-2 p-5">
          {exercises.map((exercise) => (
            <Button key={exercise.id} asChild variant="outline" size="sm">
              <Link href={`/exercises/${exercise.slug}`}>{exercise.title}</Link>
            </Button>
          ))}
          {!exercises.length ? <Badge variant="secondary">Приемы не выбраны</Badge> : null}
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <LogSection title="Контекст клиента" value={log.clientContext} />
        <LogSection title="Заметки сеанса" value={log.sessionNotes} />
        <LogSection title="Что сработало" value={log.whatWorked} />
        <LogSection title="Что было сложным" value={log.whatWasDifficult} />
        <LogSection title="Идеи для продолжения" value={log.followUpIdeas} />
      </div>
    </div>
  );
}

function LogSection({ title, value }: { title: string; value?: string | null }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="leading-7 text-stone-700">{value || "Не указано"}</CardContent>
    </Card>
  );
}
