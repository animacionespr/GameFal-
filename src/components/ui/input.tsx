import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// ─── Component ────────────────────────────────────────────────────────────────

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Layout
          "flex h-10 w-full rounded-lg px-3 py-2",
          // Dark theme bg & border
          "bg-white/5 border border-white/10",
          // Typography
          "text-sm text-white placeholder:text-white/30",
          // Focus ring
          "outline-none ring-offset-black",
          "focus:border-indigo-500/60 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-1",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-40",
          // File input reset
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white",
          // Autofill override
          "autofill:bg-transparent",
          // Transition
          "transition-colors duration-150",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Input };
