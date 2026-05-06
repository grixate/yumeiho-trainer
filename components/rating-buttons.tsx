"use client";

import { Button } from "@/components/ui/button";

export type ReviewRatingValue = "again" | "hard" | "good" | "easy";

const ratings: { value: ReviewRatingValue; label: string }[] = [
  { value: "again", label: "Снова" },
  { value: "hard", label: "Сложно" },
  { value: "good", label: "Хорошо" },
  { value: "easy", label: "Легко" },
];

export function RatingButtons({
  disabled,
  onRate,
}: {
  disabled?: boolean;
  onRate: (rating: ReviewRatingValue) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {ratings.map((rating) => (
        <Button
          key={rating.value}
          type="button"
          variant={rating.value === "again" ? "outline" : rating.value === "easy" ? "secondary" : "default"}
          disabled={disabled}
          onClick={() => onRate(rating.value)}
        >
          {rating.label}
        </Button>
      ))}
    </div>
  );
}
