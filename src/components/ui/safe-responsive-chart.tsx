"use client";

import { useEffect, useRef, useState } from "react";
import { ResponsiveContainer } from "recharts";

import { cn } from "@/src/lib/utils";

type Props = {
  className?: string;
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
};

export default function SafeResponsiveChart({ className, children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setIsReady(width > 0 && height > 0);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("h-full w-full min-w-0 min-h-0", className)}>
      {isReady ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
