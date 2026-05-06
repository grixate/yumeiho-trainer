import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-emerald-950 text-white",
      secondary: "bg-stone-100 text-stone-700",
      outline: "border border-stone-300 bg-white text-stone-700",
      caution: "bg-amber-100 text-amber-900",
    },
  },
  defaultVariants: { variant: "secondary" },
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
