"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Value from 0–100. */
  value?: number;
  /** Show animated shimmer on the fill. Default: true when value > 0 and < 100. */
  animated?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, animated, ...props }, ref) => {
  const isAnimated = animated ?? (value > 0 && value < 100);
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
        className,
      )}
      value={clampedValue}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          // Gradient fill
          "bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500",
          // Animated shimmer overlay
          isAnimated && [
            "relative overflow-hidden",
            "after:absolute after:inset-0",
            "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
            "after:animate-[shimmer_1.5s_infinite]",
            "after:translate-x-[-100%]",
          ],
        )}
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Progress };
