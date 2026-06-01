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
        <div className="error-page">
          <div className="error-ambient">
            <div className="error-orb error-orb-1" />
            <div className="error-orb error-orb-2" />
          </div>
          <div className="error-content">
            <div className="error-code">
              <span className="error-code-digit">5</span>
              <div className="error-code-divider" />
              <span className="error-code-digit">0</span>
              <div className="error-code-divider" />
              <span className="error-code-digit">0</span>
            </div>
            <div className="error-icon">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="26" stroke="hsl(var(--destructive))" strokeWidth="1" opacity="0.2" />
                <circle cx="28" cy="28" r="20" stroke="hsl(var(--destructive))" strokeWidth="1" opacity="0.15" />
                <path d="M28 18V30" stroke="hsl(var(--destructive))" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <circle cx="28" cy="36" r="1.5" fill="hsl(var(--destructive))" opacity="0.6" />
              </svg>
            </div>
            <h1 className="error-title">Something went wrong</h1>
            <p className="error-subtitle">
              An unexpected error occurred. Our systems have been notified.
            </p>
            {this.state.error?.message && (
              <div className="error-detail">
                <code>{this.state.error.message}</code>
              </div>
            )}
            <div className="error-actions">
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Try Again
              </button>
              <a href="/" className="btn btn-ghost">
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
