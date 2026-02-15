"use client";
import React, { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

let posthogInitialized = false;

type PostHogConfig = {
  apiKey: string;
  ingestHost?: string;
  uiHost?: string;
};

function initPostHog(config: PostHogConfig) {
  if (posthogInitialized) return;

  const key = config.apiKey;
  const configuredHost = config.ingestHost;
  const apiHost = configuredHost?.startsWith("/") ? configuredHost : "/ingest";

  if (!key) return;

  const uiHost = config.uiHost ||
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

export function PostHogProvider({
  children,
  apiKey,
  ingestHost,
  uiHost,
}: {
  children: React.ReactNode;
  apiKey: string;
  ingestHost?: string;
  uiHost?: string;
}) {
  useEffect(() => {
    initPostHog({ apiKey, ingestHost, uiHost });
  }, [apiKey, ingestHost, uiHost]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
