"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// ─── Root ─────────────────────────────────────────────────────────────────────

const Tabs = TabsPrimitive.Root;

// ─── TabsList ─────────────────────────────────────────────────────────────────

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-start gap-1 rounded-lg",
      "bg-white/5 p-1 border border-white/10",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// ─── TabsTrigger ──────────────────────────────────────────────────────────────

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Layout & shape
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5",
      // Typography
      "text-sm font-medium",
      // Default state
      "text-white/50 transition-all duration-200",
      // Hover
      "hover:text-white/80 hover:bg-white/5",
      // Focus
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-black",
      // Active / selected
      "data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm",
      // Disabled
      "disabled:pointer-events-none disabled:opacity-40",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// ─── TabsContent ──────────────────────────────────────────────────────────────

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-black",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2",
      // Subtle entry animation
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1",
      "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Tabs, TabsList, TabsTrigger, TabsContent };
