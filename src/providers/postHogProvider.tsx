"use client";
import React, { ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

  if (key) {
    posthog.init(key, {
      api_host: host,
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
      capture_exceptions: true,
    });
  } else if (process.env.NODE_ENV === "development") {
    console.warn("PostHog: NEXT_PUBLIC_POSTHOG_KEY is missing. Tracking disabled.");
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
