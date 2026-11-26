"use client";

import React, { useState } from "react";
import { Button } from "./button";

type ProjectCategoriesProps = {
  categories: string[];
  limit?: number;
};

export default function ProjectCategories({
  categories,
  limit = 5,
}: ProjectCategoriesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter out empty strings just in case
  const validCategories = categories.filter((c) => c && c.trim() !== "");

  if (validCategories.length === 0) return null;

  const showToggle = validCategories.length > limit;
  const visibleCategories = isExpanded
    ? validCategories
    : validCategories.slice(0, limit);

  return (
    <div
      className={`mt-auto flex flex-wrap gap-2 border-t border-white/[0.08] pt-5 transition-colors ${
        showToggle ? "cursor-pointer hover:bg-muted/10" : ""
      }`}
      onClick={(e) => {
        if (showToggle) {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
    >
      {visibleCategories.map((tech, index) => (
        <span
          key={index}
          className="rounded-md border border-white/[0.08] px-2 py-1 font-mono text-[11px] capitalize tracking-wide text-muted-foreground transition-colors hover:text-foreground"
        >
          {tech}
        </span>
      ))}
      {showToggle && (
        <Button
          variant="link"
          className="pointer-events-none h-auto p-0 text-xs text-primary hover:no-underline"
          tabIndex={-1}
        >
          {isExpanded ? "Show Less" : `+${validCategories.length - limit} More`}
        </Button>
      )}
    </div>
  );
}
