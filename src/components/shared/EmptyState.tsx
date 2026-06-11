import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CTAButton {
  label: string;
  onClick: () => void;
  /** Button variant forwarded to the Button component. Default: "default" */
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  /** Lucide-react icon rendered to the left of the label. */
  icon?: React.ReactNode;
}

interface EmptyStateProps {
  /**
   * Icon displayed at the top of the empty state. Pass any React node —
   * a Lucide icon (w-10 h-10) works well here.
   */
  icon?: React.ReactNode;
  /** Short, descriptive title. */
  title: string;
  /** Longer explanation of why the state is empty and what the user can do. */
  description?: string;
  /** Optional call-to-action button config. */
  cta?: CTAButton;
  /** Additional class names applied to the wrapper. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * A reusable empty-state card for zero-data screens.
 *
 * Usage:
 * ```tsx
 * <EmptyState
 *   icon={<FolderOpen className="w-10 h-10 text-white/30" />}
 *   title="No projects yet"
 *   description="Start by analysing your first app."
 *   cta={{ label: "New analysis", onClick: () => router.push("/new") }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  cta,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        // Centred column layout
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        // Subtle glass surface (optional — remove if used on a plain bg)
        "rounded-xl border border-white/10 bg-white/[0.03]",
        className,
      )}
    >
      {/* Icon wrapper */}
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center",
            "h-16 w-16 rounded-2xl",
            "bg-white/5 border border-white/10",
            "text-white/30",
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      {/* Description */}
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-white/50">
          {description}
        </p>
      )}

      {/* CTA */}
      {cta && (
        <Button
          variant={cta.variant ?? "default"}
          onClick={cta.onClick}
          className="mt-2"
        >
          {cta.icon && <span aria-hidden="true">{cta.icon}</span>}
          {cta.label}
        </Button>
      )}
    </div>
  );
}

export type { EmptyStateProps, CTAButton };
