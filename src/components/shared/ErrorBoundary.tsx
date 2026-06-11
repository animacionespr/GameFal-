"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  /** The subtree to protect. */
  children: ReactNode;
  /**
   * Custom fallback UI. Receives the caught error and a reset callback so the
   * caller can render a bespoke recovery screen.
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Called whenever the boundary catches an error. Useful for logging. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Additional class names on the default fallback wrapper. */
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * React class-based error boundary.
 *
 * Catches errors thrown during rendering, in lifecycle methods, and in
 * constructors of any child component tree.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary onError={(err) => Sentry.captureException(err)}>
 *   <MyFeature />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
    }
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  reset(): void {
    this.setState({ hasError: false, error: null });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, className } = this.props;

    if (!hasError || !error) {
      return children;
    }

    // Caller-supplied fallback takes precedence
    if (fallback) {
      return fallback(error, this.reset);
    }

    // Default fallback UI
    return <DefaultFallback error={error} onReset={this.reset} className={className} />;
  }
}

// ─── Default Fallback UI ──────────────────────────────────────────────────────

interface DefaultFallbackProps {
  error: Error;
  onReset: () => void;
  className?: string;
}

function DefaultFallback({ error, onReset, className }: DefaultFallbackProps) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex flex-col items-center justify-center gap-5 rounded-xl p-10 text-center",
        "border border-red-500/20 bg-red-500/5",
        className,
      )}
    >
      {/* Icon */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-400"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
        <p className="max-w-sm text-sm leading-relaxed text-white/50">
          An unexpected error occurred. Try refreshing the page or resetting this
          section.
        </p>
      </div>

      {/* Error detail (dev only) */}
      {isDev && (
        <details className="w-full max-w-lg rounded-lg border border-white/10 bg-white/5 text-left">
          <summary className="cursor-pointer px-4 py-2 text-xs font-medium text-white/40 hover:text-white/60 transition-colors">
            Error details (dev only)
          </summary>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words px-4 pb-4 pt-2 text-xs text-red-400 font-mono leading-relaxed">
            {error.message}
            {error.stack ? `\n\n${error.stack}` : ""}
          </pre>
        </details>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onReset}>
          Try again
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
          className="text-white/50"
        >
          Refresh page
        </Button>
      </div>
    </div>
  );
}

export type { ErrorBoundaryProps };
