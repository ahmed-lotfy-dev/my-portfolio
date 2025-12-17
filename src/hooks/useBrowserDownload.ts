/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
"use client";

import { useCallback } from "react";

/**
 * Hook that provides browser-based file download utilities.
 * This is SSR-safe and only executes on the client.
 */
export function useBrowserDownload() {
  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, []);

  const openInNewTab = useCallback((url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  return { downloadBlob, openInNewTab };
}
