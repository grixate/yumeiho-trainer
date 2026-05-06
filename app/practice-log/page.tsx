import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default async function PracticeLogPage() {
  const logs = await prisma.practiceLog.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Журнал практики"
        description="Заметки после сеансов, которые превращают реальную работу в лучшее вспоминание и более точные следующие сессии."
        action={
          <Button asChild>
            <Link href="/practice-log/new">
              <Plus className="h-4 w-4" />
              Новая запись
            </Link>
          </Button>
        }
      />
      {logs.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardHeader>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{formatDate(log.createdAt)}</p>
                <CardTitle>{log.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm leading-6 text-stone-600">
                <p>{log.clientContext || "Контекст клиента не указан"}</p>
                <p>{log.whatWorked || "Что сработало - пока не указано"}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href={`/practice-log/${log.id}`}>Открыть</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Записей пока нет">Создайте первую заметку после сеанса.</EmptyState>
      )}
    </div>
  );
}
