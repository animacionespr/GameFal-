import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Variants ─────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg",
    "text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-indigo-600 text-white shadow-sm",
          "hover:bg-indigo-500 active:bg-indigo-700",
          "focus-visible:ring-indigo-500",
        ],
        destructive: [
          "bg-red-600 text-white shadow-sm",
          "hover:bg-red-500 active:bg-red-700",
          "focus-visible:ring-red-500",
        ],
        outline: [
          "border border-white/10 bg-transparent text-white shadow-sm",
          "hover:bg-white/5 hover:border-white/20 active:bg-white/10",
          "focus-visible:ring-white/30",
        ],
        secondary: [
          "bg-white/10 text-white shadow-sm",
          "hover:bg-white/15 active:bg-white/20",
          "focus-visible:ring-white/30",
        ],
        ghost: [
          "text-white/70",
          "hover:bg-white/5 hover:text-white active:bg-white/10",
          "focus-visible:ring-white/30",
        ],
        link: [
          "text-indigo-400 underline-offset-4",
          "hover:underline hover:text-indigo-300",
          "focus-visible:ring-indigo-500",
        ],
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 py-1 text-xs",
        lg: "h-12 rounded-lg px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, renders the button's child element directly using Radix Slot,
   * merging all props onto the child. Useful for wrapping links.
   */
  asChild?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Button, buttonVariants };
