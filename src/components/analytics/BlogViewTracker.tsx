"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { incrementViews } from "@/src/app/actions/analytics";

interface BlogViewTrackerProps {
  blogId: string;
  blogTitle: string;
  categories?: string[];
}

export function BlogViewTracker({ blogId, blogTitle, categories }: BlogViewTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    // Increment DB views
    incrementViews(blogId, "blog");

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