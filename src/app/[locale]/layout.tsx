import { ErrorBoundary } from "@/src/components/shared/ErrorBoundary";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";

import "../globals.css";

import { Nav } from "@/src/components/features/homepage/Nav";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/src/components/ui/sonner";
import UserButton from "@/src/components/features/dashboard/layout/UserButton";
import { getMessages, setRequestLocale } from "next-intl/server";

import { inter, poppins, sora, tajawal } from "@/src/components/ui/fonts";
import { ThemeProvider } from "next-themes";
import { PostHogProvider } from "@/src/providers/postHogProvider";
import { Suspense } from "react";
import PostHogPageView from "@/src/components/shared/PostHogPageView";
import Footer from "@/src/components/features/homepage/Footer";
import { PersonSchema } from "@/src/components/seo/PersonSchema";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  metadataBase: new URL("https://ahmedlotfy.site"),
  title: {
    default: "Ahmed Lotfy – Full-Stack Software Engineer",
    template: "%s | Ahmed Lotfy",
  },
  description:
    "Portfolio of Ahmed Lotfy – Full-Stack Software Engineer. I build responsive and scalable web applications.",
  keywords: [
    "Ahmed Lotfy",
    "Full-Stack Developer",
    "Software Engineer",
    "Portfolio",
    "Web Development",
    "React",
    "Next.js",
    "Node.js",
  ],
  authors: [{ name: "Ahmed Lotfy", url: "https://ahmedlotfy.site" }],
  openGraph: {
    type: "website",
    url: "https://ahmedlotfy.site",
    title: "Ahmed Lotfy – Full-Stack Software Engineer",
    description:
      "Portfolio of Ahmed Lotfy – Full-Stack Software Engineer. I build responsive and scalable web applications.",
    siteName: "Ahmed Lotfy Portfolio",
    images: [
      {
        url: "https://ahmedlotfy.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Lotfy – Full-Stack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Lotfy – Full-Stack Software Engineer",
    description:
      "Portfolio of Ahmed Lotfy – Full-Stack Software Engineer. I build responsive and scalable web applications.",
    images: ["https://ahmedlotfy.site/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale); // Enable SSG for next-intl
  const isArabic = locale === "ar";

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      suppressHydrationWarning
      className="scroll-smooth max-h-svh "
    >
      <head>
        {/* Preload LCP image - Critical for performance */}
        <link
          rel="preload"
          href="/_next/static/media/improved_hero_background.42272c44.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />

        {/* Preconnect to external domains - Establish early connections */}
        <link
          rel="preconnect"
          href="https://images.ahmedlotfy.site"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://us.i.posthog.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://us-assets.i.posthog.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch as fallback for older browsers */}
        <link rel="dns-prefetch" href="https://images.ahmedlotfy.site" />
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />
        <link rel="dns-prefetch" href="https://us-assets.i.posthog.com" />
        <PersonSchema />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${sora.variable} ${isArabic ? tajawal.variable : ""
          } antialiased font-main`}
        suppressHydrationWarning
      >
        <PostHogProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider messages={messages}>
              <ErrorBoundary>
                <div className="relative">
                  <Nav>
                    <UserButton className="flex absolute right-16 md:ml-5 md:static" />
                  </Nav>
                  <Suspense fallback={null}>
                    <PostHogPageView />
                  </Suspense>
                  {children}
                  <Footer />
                </div>
              </ErrorBoundary>
            </NextIntlClientProvider>
          </ThemeProvider>
        </PostHogProvider>
        <Toaster />
      </body>
    </html>
  );
}
