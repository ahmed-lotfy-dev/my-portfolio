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
      className={`flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/50 transition-colors ${
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
          className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md border border-border capitalize hover:bg-muted/80 transition-colors"
        >
          {tech}
        </span>
      ))}
      {showToggle && (
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-primary hover:no-underline pointer-events-none"
          tabIndex={-1}
        >
          {isExpanded ? "Show Less" : `+${validCategories.length - limit} More`}
        </Button>
      )}
    </div>
  );
}
