import createMiddleware from 'next-intl/middleware';
import { routing } from '@/src/i18n/routing';
import { NextRequest } from 'next/server';

const handleI18n = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Run next-intl middleware first
  const response = handleI18n(request);

  // ============================================
  // SECURITY HEADERS
  // ============================================

  const isDev = process.env.NODE_ENV === 'development';

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.posthog.com *.google.com *.gstatic.com blob:;",
    "style-src 'self' 'unsafe-inline' *.google.com *.gstatic.com;",
    "img-src 'self' data: https: blob:;",
    "font-src 'self' data: *.gstatic.com;",
    "connect-src 'self' *.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://eu.i.posthog.com https://eu-assets.i.posthog.com *.googletagmanager.com *.google.com;",
    "frame-src 'self' *.youtube.com *.google.com;",
    "object-src 'none'",
    "base-uri 'self'",
    // Only upgrade insecure requests in production to avoid issues on localhost
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
    "/((?!api|_next/static|_next/image|ingest|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.svg|.*\\.ico|.*\\.pdf|.*\\.webmanifest).*)",
  ],
};