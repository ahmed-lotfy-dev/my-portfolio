import createMiddleware from "next-intl/middleware";
import { routing } from "@/src/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const handleI18n = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const acceptHeader = request.headers.get("accept") || "";

  // Rewrite /:locale/_next/... back to /_next/...
  // Cloudflare may cache 301s from the old broken proxy that redirected
  // /_next/foo.css → /en/_next/foo.css. This rewrite undoes that so the
  // Next.js static file handler can serve the actual file.
  const localeNextMatch = pathname.match(/^\/(en|ar)(\/_next\/.*)$/);
  if (localeNextMatch) {
    const url = request.nextUrl.clone();
    url.pathname = localeNextMatch[2]; // /_next/... without locale
    return NextResponse.rewrite(url);
  }

  if (
    acceptHeader.includes("text/markdown") &&
    (pathname === "/" || pathname === "/en" || pathname === "/ar")
  ) {
    const locale = pathname === "/ar" ? "ar" : "en";
    const url = request.nextUrl.clone();
    url.pathname = "/_agent/home.md";
    url.searchParams.set("locale", locale);
    return NextResponse.rewrite(url);
  }

  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/.well-known/") ||
    pathname.startsWith("/_agent/")
  ) {
    return NextResponse.next();
  }

  const response = handleI18n(request);

  const location = response.headers.get("location");
  if (response.status === 307 && location) {
    return NextResponse.redirect(new URL(location, request.url), 301);
  }

  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    `script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline' *.googletagmanager.com *.posthog.com https://eu.i.posthog.com https://static.cloudflareinsights.com *.cloudflareinsights.com blob:;`,
    "script-src-elem 'self' 'unsafe-inline' *.googletagmanager.com *.posthog.com https://eu.i.posthog.com https://static.cloudflareinsights.com *.cloudflareinsights.com blob:;",
    "style-src 'self' 'unsafe-inline' *.google.com *.gstatic.com;",
    "img-src 'self' data: https: blob:;",
    "font-src 'self' data: *.gstatic.com;",
    "connect-src 'self' *.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://eu.i.posthog.com https://eu-assets.i.posthog.com https://static.cloudflareinsights.com *.cloudflareinsights.com *.googletagmanager.com *.google.com;",
    "frame-src 'self' *.youtube.com *.google.com;",
    "object-src 'none'",
    "base-uri 'self'",
    !isDev ? "upgrade-insecure-requests" : "",
  ].filter(Boolean).join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|ingest|\\.well-known|_agent|robots\\.txt|sitemap\\.xml|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.svg|.*\\.ico|.*\\.pdf|.*\\.webmanifest).*)",
  ],
};
