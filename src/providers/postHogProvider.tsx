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
  if (!key) return;

  const uiHost =
    config.uiHost ||
    (config.ingestHost?.includes("eu.") ? "https://eu.posthog.com" : "https://us.posthog.com");

  posthog.init(key, {
    api_host: "/ingest",
    ui_host: uiHost,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    capture_exceptions: true,
    autocapture: true,
    // Lighthouse was flagging PostHog Session Replay (rrweb-record) and Surveys assets as
    // "Legacy JavaScript" that weren’t needed for this site (recording already not working).
    // These flags prevent PostHog from loading those dependencies.
    disable_session_recording: true,
    disable_surveys: true,
    disable_external_dependency_loading: true,
    loaded: (client) => {
      posthogInitialized = true;
      client.capture("$pageview", {
        $current_url: window.location.href,
      });
    },
  });
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
