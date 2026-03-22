/**
 * Normalize remote media URLs so next/image and <video> can load paths with
 * reserved characters (e.g. filenames containing parentheses).
 */
export function isNonEmptyUrl(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** Path-based check so query strings (e.g. .gif?v=1) still match. */
export function urlPathEndsWithExtension(url: string, ext: string): boolean {
  try {
    return new URL(url).pathname.toLowerCase().endsWith(ext.toLowerCase());
  } catch {
    return url.toLowerCase().includes(ext.toLowerCase());
  }
}

export function isGifUrl(url: string): boolean {
  return urlPathEndsWithExtension(url, ".gif");
}

export function isHostedVideoFileUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(
    (() => {
      try {
        return new URL(url).pathname;
      } catch {
        return url;
      }
    })(),
  );
}

export function safeMediaUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("/") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  try {
    const u = new URL(trimmed);
    const parts = u.pathname.split("/").map((segment) => {
      if (!segment) return segment;
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    });
    u.pathname = parts.join("/");
    return u.href;
  } catch {
    return trimmed;
  }
}
