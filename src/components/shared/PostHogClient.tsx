"use client";

import { Suspense } from "react";
import { PostHogProvider } from "@/src/providers/postHogProvider";
import PostHogPageView from "@/src/components/shared/PostHogPageView";

type PostHogClientProps = {
  children: React.ReactNode;
  apiKey: string;
  ingestHost?: string;
  uiHost?: string;
};

export default function PostHogClient({ children, apiKey, ingestHost, uiHost }: PostHogClientProps) {
  return (
    <PostHogProvider apiKey={apiKey} ingestHost={ingestHost} uiHost={uiHost}>
      {children}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </PostHogProvider>
  );
}
