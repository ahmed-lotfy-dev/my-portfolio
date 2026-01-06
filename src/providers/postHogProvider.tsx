"use client";
import React, { ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    capture_exceptions: true,
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
