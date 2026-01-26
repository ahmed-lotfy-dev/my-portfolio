import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-eval'",
    "'unsafe-inline'",
    "*.googletagmanager.com",
    "*.posthog.com",
    "https://eu.i.posthog.com",
    "https://static.cloudflareinsights.com",
    "*.cloudflareinsights.com",
    "blob:",
  ],
  "script-src-elem": [
    "'self'",
    "'unsafe-inline'",
    "*.googletagmanager.com",
    "*.posthog.com",
    "https://eu.i.posthog.com",
    "https://static.cloudflareinsights.com",
    "*.cloudflareinsights.com",
    "blob:",
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:", "blob:"],
  "font-src": ["'self'", "data:"],
  "connect-src": [
    "'self'",
    "*.posthog.com",
    "https://us.i.posthog.com",
    "https://us-assets.i.posthog.com",
    "https://eu.i.posthog.com",
    "https://eu-assets.i.posthog.com",
    "https://static.cloudflareinsights.com",
    "*.cloudflareinsights.com",
  ],
  "frame-src": ["'self'", "*.youtube.com"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "block-all-mixed-content": [],
  "upgrade-insecure-requests": [],
};

const cspString = Object.entries(cspDirectives)
  .map(([key, values]) => `${key} ${values.join(" ")};`)
  .join(" ")
  .replace(/\s+/g, " ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: cspString },
];

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "react-icons",
      "@radix-ui/react-accordion",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
    ],
  },
  reactCompiler: false,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.ahmedlotfy.site", port: "", pathname: "/**" },
      { protocol: "https", hostname: "pub-49b2468145c64b14a4a172c257cf46b8.r2.dev", port: "", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", port: "", pathname: "/a/**" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", port: "" },
      { protocol: "https", hostname: "placehold.co", port: "" },
    ],
  },
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
      { source: "/ingest/decide", destination: "https://us.i.posthog.com/decide" },
      { source: "/:locale/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/:locale/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
      { source: "/:locale/ingest/decide", destination: "https://us.i.posthog.com/decide" },
      { source: "/:locale/robots.txt", destination: "/robots.txt" },
      { source: "/:locale/sitemap.xml", destination: "/sitemap.xml" },
    ];
  },

  async headers() {
    const cacheHeaders = { key: "Cache-Control", value: "public, max-age=31536000, immutable" };
    return [
      { source: "/_next/static/:path*", headers: [cacheHeaders] },
      { source: "/images/:path*", headers: [cacheHeaders] },
      { source: "/favicon.ico", headers: [cacheHeaders] },
      { source: "/fonts/:path*", headers: [cacheHeaders] },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" }] },
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
  },
});

const withNextIntl = createNextIntlPlugin();

export default withPWA(withNextIntl(nextConfig));
