"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";

export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const search = searchParams.toString();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || !posthog) return;

    const url = `${window.origin}${pathname}${search ? `?${search}` : ""}`;
    if (lastTrackedUrl.current === url) return;

    if (!(posthog as typeof posthog & { __loaded?: boolean }).__loaded) {
      return;
    }

    lastTrackedUrl.current = url;
    posthog.capture("$pageview", {
      $current_url: url,
    });
  }, [pathname, search, posthog]);

  return null;
}
