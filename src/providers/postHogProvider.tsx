"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

type Props = { children: ReactNode };

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog immediately on mount
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false, // Automatically capture pageviews
        capture_pageleave: true,
        // Enable exception capture for error tracking
        capture_exceptions: true,
        // Disable session recording by default for better performance
        // disable_session_recording: false, 
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
