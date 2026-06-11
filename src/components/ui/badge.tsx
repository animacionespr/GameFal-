import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Variants ─────────────────────────────────────────────────────────────────

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
    "text-xs font-medium leading-none transition-colors",
    "border",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
        ],
        secondary: [
          "border-white/10 bg-white/5 text-white/70",
        ],
        destructive: [
          "border-red-500/30 bg-red-500/10 text-red-400",
        ],
        outline: [
          "border-white/20 bg-transparent text-white/80",
        ],
        success: [
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        ],
        warning: [
          "border-amber-500/30 bg-amber-500/10 text-amber-400",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

// ─── Component ────────────────────────────────────────────────────────────────

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Badge, badgeVariants };
