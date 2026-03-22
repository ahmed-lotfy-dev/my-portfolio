"use client";

import Image from "next/image";
import { getProjectCoverImage } from "@/src/lib/constants/images";
import { cn } from "@/src/lib/utils";

interface ProjectThumbnailProps {
  coverImage?: string | null;
  title: string;
  className?: string;
}

export function ProjectThumbnail({
  coverImage,
  title,
  className,
}: ProjectThumbnailProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg ring-1 ring-border/50 hover:ring-primary/50 transition-all bg-muted",
        className
      )}
    >
      <Image
        src={getProjectCoverImage(coverImage)}
        alt={title}
        fill
        className="object-cover"
        sizes="96px"
        unoptimized={coverImage?.toLowerCase().endsWith(".gif") ?? false}
      />
    </div>
  );
}
