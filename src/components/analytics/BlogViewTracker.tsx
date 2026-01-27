"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

interface BlogViewTrackerProps {
  blogId: string;
  blogTitle: string;
  categories?: string[];
}

export function BlogViewTracker({ blogId, blogTitle, categories }: BlogViewTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture("blog_viewed", {
        blog_id: blogId,
        blog_title: blogTitle,
        blog_categories: categories || [],
      });
    }
  }, [posthog, blogId, blogTitle, categories]);

  return null;
}