import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LearningShell({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "narrow" | "default" | "wide";
}) {
  const widths = {
    narrow: "max-w-[760px]",
    default: "max-w-[860px]",
    wide: "max-w-5xl",
  };

  return <div className={cn("mx-auto w-full space-y-7", widths[width], className)}>{children}</div>;
}

export function EditorialHeader({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="space-y-5 border-b border-stone-200/80 pb-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? (
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900/70">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            {title}
          </h1>
          {description ? <p className="mt-3 text-pretty text-base leading-7 text-stone-600">{description}</p> : null}
        </div>
        {action ? <div className="flex shrink-0 gap-2">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function LearningCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200/80 bg-white/82 p-5 shadow-[0_18px_45px_rgba(41,37,36,0.045)] backdrop-blur transition-colors hover:border-emerald-900/20",
        className,
      )}
      {...props}
    />
  );
}
