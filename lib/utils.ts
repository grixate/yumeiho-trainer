import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function textToArray(value: FormDataEntryValue | null | undefined) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function firstItem(value: unknown) {
  return asStringArray(value)[0] ?? "";
}

export function optionalString(value: FormDataEntryValue | null | undefined) {
  const text = String(value ?? "").trim();
  return text.length ? text : undefined;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDifficulty(value?: string | null) {
  const labels: Record<string, string> = {
    basic: "базовый",
    intermediate: "средний",
    advanced: "продвинутый",
  };
  return value ? (labels[value] ?? value) : "не указано";
}
