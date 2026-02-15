"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const search = searchParams.toString();

  useEffect(() => {
    if (pathname && posthog) {
      const url = `${window.origin}${pathname}${search ? `?${search}` : ""}`;
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, search, posthog]);

  return null;
}
