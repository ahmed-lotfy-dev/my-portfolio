"use client";

import { Suspense } from "react";
import { PostHogProvider } from "@/src/providers/postHogProvider";
import PostHogPageView from "@/src/components/shared/PostHogPageView";

export default function PostHogClient({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      {children}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </PostHogProvider>
  );
}
