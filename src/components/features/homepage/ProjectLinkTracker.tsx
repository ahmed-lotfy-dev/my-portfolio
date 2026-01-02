"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { ReactNode } from "react";

interface ProjectLinkTrackerProps {
  href: string;
  projectTitle: string;
  projectId: string;
  linkType: "live" | "repo" | "case_study";
  target?: string;
  className?: string;
  children: ReactNode;
}

export function ProjectLinkTracker({
  href,
  projectTitle,
  projectId,
  linkType,
  target,
  className,
  children,
}: ProjectLinkTrackerProps) {
  const handleClick = () => {
    posthog.capture("project_link_clicked", {
      project_title: projectTitle,
      project_id: projectId,
      link_type: linkType,
      destination_url: href,
    });
  };

  return (
    <Link
      href={href}
      target={target}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
