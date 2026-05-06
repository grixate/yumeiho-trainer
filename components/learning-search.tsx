"use client";

import { FormEvent, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type FilterGroup = {
  name: string;
  label: string;
  options: string[];
};

export function LearningSearch({
  placeholder,
  defaultValue,
  filters,
}: {
  placeholder: string;
  defaultValue?: string;
  filters: FilterGroup[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(defaultValue ?? "");

  const activeFilters = useMemo(
    () =>
      filters.flatMap((group) => {
        const value = params.get(group.name);
        return value ? [{ ...group, value }] : [];
      }),
    [filters, params],
  );

  function push(next: URLSearchParams) {
    const search = next.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(params);
    const trimmed = query.trim();
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    push(next);
  }

  function setFilter(name: string, value: string) {
    const next = new URLSearchParams(params);
    if (next.get(name) === value) next.delete(name);
    else next.set(name, value);
    push(next);
  }

  function clearFilter(name: string) {
    const next = new URLSearchParams(params);
    next.delete(name);
    push(next);
  }

  return (
    <div className="space-y-3">
      <form onSubmit={submit} className="flex gap-2">
        <Input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="h-12 rounded-xl border-stone-200 bg-white/90 px-4 text-base shadow-sm"
        />
        <Button type="submit" variant="outline" className="h-12 rounded-xl px-4">
          Искать
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="secondary" className="h-12 rounded-xl px-4">
              <SlidersHorizontal className="h-4 w-4" />
              Фильтр
            </Button>
          </SheetTrigger>
          <SheetContent className="left-auto right-0 w-[min(92vw,420px)] overflow-y-auto border-l border-r-0 bg-stone-50">
            <div className="mb-7 pr-8">
              <div className="text-sm font-semibold text-stone-950">Фильтры</div>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                Добавляйте только нужные ограничения. Выбранные фильтры сохраняются в ссылке.
              </p>
            </div>
            <div className="space-y-7">
              {filters.map((group) => (
                <section key={group.name} className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const selected = params.get(group.name) === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFilter(group.name, option)}
                          className={
                            selected
                              ? "rounded-full bg-emerald-950 px-3 py-2 text-sm text-white"
                              : "rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 transition-colors hover:border-emerald-900/30 hover:text-stone-950"
                          }
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
            <SheetClose asChild>
              <Button className="mt-8 w-full rounded-xl" type="button">
                Готово
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </form>
      {(activeFilters.length || params.get("q")) ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {params.get("q") ? (
            <Badge variant="outline" className="shrink-0 rounded-full bg-white">
              поиск: {params.get("q")}
            </Badge>
          ) : null}
          {activeFilters.map((filter) => (
            <button
              key={filter.name}
              type="button"
              onClick={() => clearFilter(filter.name)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm"
            >
              {filter.value}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
