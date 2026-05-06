import Link from "next/link";
import { BookOpen, Brain, Compass, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditorialHeader, LearningCard, LearningShell } from "@/components/learning-layout";

export default function StudyPage() {
  const modes = [
    {
      href: "/study/theory-flashcards",
      title: "Карточки теории",
      description: "Учить принципы через вспоминание вопроса и ответа.",
      icon: BookOpen,
      disabled: false,
    },
    {
      href: "/study/practice-recall",
      title: "Вспоминание приемов",
      description: "Вспомнить структуру приема до открытия карточки.",
      icon: Brain,
      disabled: false,
    },
    {
      href: "/study/quick-reference",
      title: "Быстрая справка",
      description: "Быстрый обзор перед сеансом без режима проверки.",
      icon: TimerReset,
      disabled: false,
    },
    {
      href: "#",
      title: "Сценарии",
      description: "Заготовка для будущих тренировок клинического мышления.",
      icon: Compass,
      disabled: true,
    },
  ];

  return (
    <LearningShell>
      <EditorialHeader
        eyebrow="Тренировка памяти"
        title="Тренировка"
        description="Тренируйте логику метода и практическую хореографию через спокойное повторение."
      />
      <div className="space-y-4">
        {modes.map((mode) => (
          <LearningCard key={mode.title} className={mode.disabled ? "opacity-70" : ""}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-white">
                <mode.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-stone-950">{mode.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{mode.description}</p>
                </div>
              </div>
              {mode.disabled ? (
                <Badge variant="secondary">Позже</Badge>
              ) : (
                <Button asChild className="w-fit rounded-full">
                  <Link href={mode.href}>Начать</Link>
                </Button>
              )}
            </div>
          </LearningCard>
        ))}
      </div>
    </LearningShell>
  );
}
