"use client";
import React, { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

let posthogInitialized = false;

function initPostHog() {
  if (posthogInitialized) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

  if (!key) return;

  const uiHost = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ||
    (host.includes("eu.") ? "https://eu.posthog.com" : "https://us.posthog.com");

  posthog.init(key, {
    api_host: host,
    ui_host: uiHost,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    capture_exceptions: true,
  });
  posthogInitialized = true;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
