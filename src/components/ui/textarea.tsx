import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// ─── Component ────────────────────────────────────────────────────────────────

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Layout
          "flex min-h-[96px] w-full rounded-lg px-3 py-2.5",
          // Dark theme bg & border
          "bg-white/5 border border-white/10",
          // Typography
          "text-sm text-white placeholder:text-white/30 leading-relaxed",
          // Resize
          "resize-y",
          // Focus ring
          "outline-none ring-offset-black",
          "focus:border-indigo-500/60 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-1",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-40",
          // Scrollbar
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10",
          // Transition
          "transition-colors duration-150",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Textarea };
