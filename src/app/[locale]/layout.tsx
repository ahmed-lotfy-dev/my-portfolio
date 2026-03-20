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
import Footer from "@/src/components/features/homepage/Footer";
import { PersonSchema } from "@/src/components/seo/PersonSchema";
import PostHogClient from "@/src/components/shared/PostHogClient";

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
      { url: "/as-mark.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/as-mark.svg",
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
  const posthogApiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_PROJECT_API_KEY || "";
  const posthogIngestHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || process.env.POSTHOG_INGEST_HOST || "/ingest";
  const posthogUiHost = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || process.env.POSTHOG_HOST;
  const isPostHogEnabled = Boolean(posthogApiKey);

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.ahmedlotfy.site" />
        <PersonSchema />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${sora.variable} ${isArabic ? tajawal.variable : ""
          } antialiased font-main`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary>
              {isPostHogEnabled ? (
                <PostHogClient
                  apiKey={posthogApiKey}
                  ingestHost={posthogIngestHost}
                  uiHost={posthogUiHost}
                >
                  <div className="relative">
                    <Nav>
                      <UserButton className="flex absolute right-16 md:ml-5 md:static" />
                    </Nav>
                    {children}
                    <Footer />
                  </div>
                </PostHogClient>
              ) : (
                <div className="relative">
                  <Nav>
                    <UserButton className="flex absolute right-16 md:ml-5 md:static" />
                  </Nav>
                  {children}
                  <Footer />
                </div>
              )}
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
