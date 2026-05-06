"use client";

import { useMemo, useState, useTransition } from "react";
import { saveReviewAction } from "@/lib/actions";
import { asStringArray, firstItem } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingButtons, type ReviewRatingValue } from "@/components/rating-buttons";

type TheoryStudyCard = {
  id: string;
  topic: string;
  title: string;
  question: string;
  answer: string;
  practicalMeaning: string | null;
  difficulty: number;
  tags: string[];
};

type ExerciseStudyCard = {
  id: string;
  title: string;
  category: string;
  bodyZones: string[];
  goals: string[];
  clientPosition: string | null;
  practitionerPosition: string | null;
  steps: unknown;
  keyPoints: unknown;
  commonMistakes: unknown;
  contraindications: unknown;
};

function shuffle<T>(items: T[], firstId?: string) {
  const copy = [...items].sort(() => Math.random() - 0.5);
  if (!firstId) return copy;
  const index = copy.findIndex((item) => "id" in (item as object) && (item as { id: string }).id === firstId);
  if (index <= 0) return copy;
  const [first] = copy.splice(index, 1);
  return [first, ...copy];
}

export function TheoryFlashcards({ cards, firstId }: { cards: TheoryStudyCard[]; firstId?: string }) {
  const deck = useMemo(() => shuffle(cards, firstId), [cards, firstId]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const current = deck[index];

  if (!current) return <Card><CardContent className="p-8">Карточек теории пока нет.</CardContent></Card>;

  function rate(rating: ReviewRatingValue) {
    startTransition(async () => {
      await saveReviewAction({
        cardType: "theory",
        cardId: current.id,
        mode: "theory_flashcard",
        rating,
      });
      setRevealed(false);
      setIndex((value) => (value + 1) % deck.length);
    });
  }

  return (
    <Card className="mx-auto max-w-3xl rounded-2xl border-stone-200/80 bg-white/86 shadow-[0_18px_45px_rgba(41,37,36,0.05)]">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-stone-500">
          <span>Прогресс {index + 1}/{deck.length}</span>
          <span className="flex items-center gap-2">
            <Badge variant="outline">{current.topic}</Badge>
            <Badge>Уровень {current.difficulty}</Badge>
          </span>
        </div>
        <CardTitle className="text-2xl leading-9">{current.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!revealed ? (
          <Button onClick={() => setRevealed(true)}>Показать ответ</Button>
        ) : (
          <>
            <section className="rounded-xl bg-stone-50 p-4">
              <h2 className="mb-2 text-sm font-semibold text-stone-950">Ответ</h2>
              <p className="leading-7 text-stone-700">{current.answer}</p>
            </section>
            {current.practicalMeaning ? (
              <section className="rounded-xl bg-emerald-50 p-4">
                <h2 className="mb-2 text-sm font-semibold text-emerald-950">Практический смысл</h2>
                <p className="leading-7 text-emerald-950">{current.practicalMeaning}</p>
              </section>
            ) : null}
            <RatingButtons disabled={isPending} onRate={rate} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function PracticeRecall({ cards, firstId }: { cards: ExerciseStudyCard[]; firstId?: string }) {
  const deck = useMemo(() => shuffle(cards, firstId), [cards, firstId]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const current = deck[index];

  if (!current) return <Card><CardContent className="p-8">Приемов пока нет.</CardContent></Card>;

  function rate(rating: ReviewRatingValue) {
    startTransition(async () => {
      await saveReviewAction({
        cardType: "exercise",
        cardId: current.id,
        mode: "practice_recall",
        rating,
      });
      setRevealed(false);
      setIndex((value) => (value + 1) % deck.length);
    });
  }

  return (
    <Card className="mx-auto max-w-3xl rounded-2xl border-stone-200/80 bg-white/86 shadow-[0_18px_45px_rgba(41,37,36,0.05)]">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-stone-500">
          <span>Прогресс {index + 1}/{deck.length}</span>
          <span className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{current.category}</Badge>
            {current.bodyZones.slice(0, 3).map((zone) => <Badge key={zone}>{zone}</Badge>)}
          </span>
        </div>
        <CardTitle className="text-2xl leading-9">{current.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!revealed ? (
          <>
            <div className="rounded-xl bg-stone-50 p-4">
              <h2 className="mb-3 text-sm font-semibold text-stone-950">Попробуйте вспомнить</h2>
              <ul className="grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
                {["Цель", "Положение пациента", "Положение терапевта", "Шаги", "Ключевые моменты", "Частые ошибки", "Противопоказания"].map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <Button onClick={() => setRevealed(true)}>Показать карточку</Button>
          </>
        ) : (
          <>
            <section className="rounded-xl bg-emerald-50 p-4">
              <h2 className="mb-2 text-sm font-semibold text-emerald-950">Цель</h2>
              <p className="leading-7 text-emerald-950">{current.goals.join(", ")}</p>
            </section>
            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-4">
                <h2 className="mb-2 text-sm font-semibold">Пациент</h2>
                <p>{current.clientPosition || "Не указано"}</p>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <h2 className="mb-2 text-sm font-semibold">Терапевт</h2>
                <p>{current.practitionerPosition || "Не указано"}</p>
              </div>
            </section>
            <section>
              <h2 className="mb-3 text-sm font-semibold">Шаги</h2>
              <ol className="grid list-decimal gap-2 pl-5 text-sm leading-6 text-stone-700">
                {asStringArray(current.steps).map((step) => <li key={step}>{step}</li>)}
              </ol>
            </section>
            <section className="grid gap-3 sm:grid-cols-3">
              <MiniList title="Ключевые моменты" items={asStringArray(current.keyPoints)} />
              <MiniList title="Ошибки" items={asStringArray(current.commonMistakes)} />
              <MiniList title="Главное предупреждение" items={[firstItem(current.contraindications)].filter(Boolean)} />
            </section>
            <RatingButtons disabled={isPending} onRate={rate} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg bg-stone-50 p-4">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <ul className="space-y-1 text-sm leading-6 text-stone-700">
        {(items.length ? items : ["Не указано"]).map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
