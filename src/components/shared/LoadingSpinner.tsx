import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  /** Controls the diameter of the spinner. Default: "md" */
  size?: SpinnerSize;
  /** Optional text rendered beneath the spinner. */
  label?: string;
  /** Additional class names applied to the wrapper. */
  className?: string;
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const spinnerSizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

const labelSizeClasses: Record<SpinnerSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * A simple, accessible loading spinner.
 *
 * Usage:
 * ```tsx
 * <LoadingSpinner size="lg" label="Analyzing your app…" />
 * ```
 */
export function LoadingSpinner({
  size = "md",
  label,
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      {/* Spinner ring */}
      <div
        className={cn(
          "animate-spin rounded-full",
          "border-white/15 border-t-indigo-500",
          spinnerSizeClasses[size],
        )}
        aria-hidden="true"
      />

      {/* Optional label */}
      {label && (
        <p
          className={cn(
            "font-medium text-white/50 tracking-wide",
            labelSizeClasses[size],
          )}
        >
          {label}
        </p>
      )}

      {/* Screen-reader-only fallback when no visible label is present */}
      {!label && <span className="sr-only">Loading</span>}
    </div>
  );
}

export type { LoadingSpinnerProps, SpinnerSize };
