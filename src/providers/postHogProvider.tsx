"use client";
import React, { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

let posthogInitialized = false;

function initPostHog() {
  if (posthogInitialized) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const configuredHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const apiHost = configuredHost?.startsWith("/") ? configuredHost : "/ingest";

  if (!key) return;

  const uiHost = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ||
    (configuredHost?.includes("eu.") ? "https://eu.posthog.com" : "https://us.posthog.com");

  posthog.init(key, {
    api_host: apiHost,
    ui_host: uiHost,
    person_profiles: "identified_only",
    capture_pageview: false,
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
