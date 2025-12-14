import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "standalone", // Enable standalone mode for optimized Docker builds
  compress: true,
  experimental: {
    // turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: "10mb", // Increased from default 1mb to allow image uploads
    },
    // Tree-shake large dependencies to reduce bundle size
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
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year - Aggressive caching for optimized images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ahmedlotfy.site",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ],
  },
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      // PostHog rewrites without locale
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      // PostHog rewrites with locale prefix
      {
        source: "/:locale/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/:locale/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/:locale/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      // Redirect locale-prefixed SEO files to root
      {
        source: "/:locale/robots.txt",
        destination: "/robots.txt",
      },
      {
        source: "/:locale/sitemap.xml",
        destination: "/sitemap.xml",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.posthog.com blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' *.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com; frame-src 'self' *.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },

};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
