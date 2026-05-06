import Link from "next/link";
import { TheoryCard } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/learning-layout";

export function TheoryCardPreview({ card }: { card: TheoryCard }) {
  return (
    <LearningCard className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full bg-stone-50">{card.topic}</Badge>
            <Badge className="rounded-full">Уровень {card.difficulty}</Badge>
          </div>
          <h2 className="text-pretty text-2xl font-semibold leading-8 text-stone-950">{card.title}</h2>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href={`/theory/${card.id}`}>Открыть</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link href={`/study/theory-flashcards?cardId=${card.id}`}>Учить</Link>
          </Button>
        </div>
      </div>
      <p className="text-lg leading-8 text-stone-700">{card.question}</p>
      {card.practicalMeaning ? (
        <p className="rounded-xl bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-950">{card.practicalMeaning}</p>
      ) : null}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {card.tags.slice(0, 6).map((tag) => (
          <Badge key={tag} variant="secondary" className="shrink-0 rounded-full">
            {tag}
          </Badge>
        ))}
      </div>
    </LearningCard>
  );
}
