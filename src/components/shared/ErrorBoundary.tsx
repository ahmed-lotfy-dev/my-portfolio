"use client";

import { Component, ReactNode } from "react";
import { logger } from "@/src/lib/utils/logger";
import posthog from "posthog-js";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing when a component error occurs
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Error caught by boundary:", error, errorInfo);

    // Capture error in PostHog
    posthog.capture("error_boundary_triggered", {
      error_message: error.message,
      error_name: error.name,
      component_stack: errorInfo.componentStack,
    });
    // Also use PostHog's exception capture
    posthog.captureException(error);

    if (error.message.includes("Failed to find Server Action")) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md rounded-3xl border border-border bg-card/80 p-8 text-center shadow-xl backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-bold text-destructive">
              Something went wrong
            </h2>
            <p className="mb-6 text-muted-foreground">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
