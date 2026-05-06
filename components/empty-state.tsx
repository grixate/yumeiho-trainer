import { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50/70 p-8 text-center">
      <h3 className="text-base font-semibold text-stone-950">{title}</h3>
      {children ? <div className="mt-2 text-sm leading-6 text-stone-600">{children}</div> : null}
    </div>
  );
}
