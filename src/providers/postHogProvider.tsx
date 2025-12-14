"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

type Props = { children: ReactNode };

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Lazy load PostHog after 3 seconds or user interaction
    const initPostHog = () => {
      if (typeof window !== "undefined" && !isInitialized) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: "/ingest",
          ui_host: "https://us.posthog.com",
          person_profiles: "identified_only",
          capture_pageview: true,
          capture_pageleave: true,
          // Disable session recording by default for better performance
          // disable_session_recording: false,
          // Load script asynchronously
          loaded: () => setIsInitialized(true),
        });
      }
    };

    // Initialize after 3 seconds
    const timer = setTimeout(initPostHog, 3000);

    // Or initialize on first user interaction
    const events = ["mousedown", "touchstart", "keydown", "scroll"];
    const handleInteraction = () => {
      clearTimeout(timer);
      initPostHog();
      events.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
    };

    events.forEach((event) =>
      window.addEventListener(event, handleInteraction, { once: true, passive: true })
    );

    return () => {
      clearTimeout(timer);
      events.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
    };
  }, [isInitialized]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
