"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { incrementViews } from "@/src/app/actions/analytics";

interface ProjectViewTrackerProps {
  projectId: string;
  projectTitle: string;
  categories: string[];
}

export function ProjectViewTracker({ projectId, projectTitle, categories }: ProjectViewTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    // Increment DB views
    incrementViews(projectId, "project");

    if (posthog) {
      posthog.capture("project_viewed", {
        project_id: projectId,
        project_title: projectTitle,
        project_categories: categories,
      });
    }
  }, [posthog, projectId, projectTitle, categories]);

  return null;
}
