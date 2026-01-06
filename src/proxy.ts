import createMiddleware from 'next-intl/middleware';
import { routing } from '@/src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // 1. Run next-intl middleware (handles redirects and locale)
  const response = handleI18n(request);

  // ============================================
  // SECURITY HEADERS
  // ============================================

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.posthog.com blob:;",
    "style-src 'self' 'unsafe-inline';",
    "img-src 'self' data: https: blob:;",
    "font-src 'self' data:;",
    "connect-src 'self' *.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com *.googletagmanager.com;",
    "frame-src 'self' *.youtube.com;",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "block-all-mixed-content",
    "upgrade-insecure-requests"
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // ============================================
  // CACHING HEADERS
  // ============================================

  if (request.nextUrl.pathname.startsWith("/_next/static/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  if (
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/)
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000");
  }

  return response;
}

export const config = {
  matcher: [
    // Enable a comprehensive source matcher to ensure that
    // the middleware runs on all relevant paths
    // Exclude: API routes, Next.js internals, and static files from public folder
    "/((?!api|_next/static|_next/image|ingest|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.svg|.*\\.ico|.*\\.pdf|.*\\.webmanifest).*)",
  ],
};