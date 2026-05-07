"use client";

import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function BulletList({
  items,
  ordered,
  className,
}: {
  items: string[];
  ordered?: boolean;
  className?: string;
}) {
  const visible = items.length ? items : ["Не указано"];
  const Comp = ordered ? "ol" : "ul";

  return (
    <Comp
      className={cn(
        "space-y-2 text-[15px] leading-7 text-stone-700",
        ordered ? "list-decimal pl-5" : "list-disc pl-5",
        className,
      )}
    >
      {visible.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Comp>
  );
}

export function WarningBox({ items, compact = false }: { items: string[]; compact?: boolean }) {
  const visible = items.filter(Boolean);
  if (!visible.length) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-[0_16px_42px_rgba(146,64,14,0.08)]",
        compact && "rounded-xl p-3",
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-800">
        <ShieldAlert className="h-4 w-4" />
        Осторожность
      </div>
      <BulletList items={visible} className={compact ? "text-sm leading-6" : undefined} />
    </section>
  );
}
