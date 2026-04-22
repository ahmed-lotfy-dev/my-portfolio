import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/src/components/shared/ErrorBoundary";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";

import "../globals.css";

import { Nav } from "@/src/components/features/homepage/Nav";
import type { Metadata, Viewport } from "next";
import { getMessages, setRequestLocale } from "next-intl/server";

 import { inter, poppins, sora, tajawal, playfair } from "@/src/components/ui/fonts";
 const Footer = dynamic(() => import("@/src/components/features/homepage/Footer"), {
   ssr: true,
 });
 import { PersonSchema } from "@/src/components/seo/PersonSchema";
 import { OrganizationSchema } from "@/src/components/seo/OrganizationSchema";
 import PostHogClient from "@/src/components/shared/PostHogClient";
 import { LazyMotion, domAnimation } from "motion/react";
 import { Toaster } from "@/src/components/ui/sonner";
 import { WebMcpProvider } from "@/src/components/agent/WebMcpProvider";

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
    default: "Ahmed Shoman – Full-Stack Software Engineer",
    template: "%s | Ahmed Shoman",
  },
  description:
    "Portfolio of Ahmed Shoman – Full-Stack Software Engineer. I build responsive and scalable web applications.",
  keywords: [
    "Ahmed Shoman",
    "Full-Stack Developer",
    "Software Engineer",
    "Portfolio",
    "Web Development",
    "React",
    "Next.js",
    "Node.js",
  ],
  authors: [{ name: "Ahmed Shoman", url: "https://ahmedlotfy.site" }],
  openGraph: {
    type: "website",
    url: "https://ahmedlotfy.site",
    title: "Ahmed Shoman – Full-Stack Software Engineer",
    description:
      "Portfolio of Ahmed Shoman – Full-Stack Software Engineer. I build responsive and scalable web applications.",
    siteName: "Ahmed Shoman Portfolio",
    images: [
      {
        url: "https://ahmedlotfy.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Shoman – Full-Stack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Shoman – Full-Stack Software Engineer",
    description:
      "Portfolio of Ahmed Shoman – Full-Stack Software Engineer. I build responsive and scalable web applications.",
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
      className="dark scroll-smooth max-h-svh"
      data-scroll-behavior="smooth"
    >
<head>
          <link rel="dns-prefetch" href="https://images.ahmedlotfy.site" />
          <link rel="preconnect" href="https://images.ahmedlotfy.site" />
          <link rel="preload" as="image" href="/images/optimized/About-Image.webp" />
          <PersonSchema />
         <OrganizationSchema />
       </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${sora.variable} ${playfair.variable} ${isArabic ? tajawal.variable : ""
          } antialiased font-main`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <WebMcpProvider />
          <LazyMotion features={domAnimation} strict>
            <ErrorBoundary>
              {isPostHogEnabled ? (
                <PostHogClient
                  apiKey={posthogApiKey}
                  ingestHost={posthogIngestHost}
                  uiHost={posthogUiHost}
                >
                  <div className="relative">
                    <Nav />
                    {children}
                    <Footer />
                  </div>
                </PostHogClient>
              ) : (
                <div className="relative">
                  <Nav />
                  {children}
                    <Footer />
                  </div>
                )}
              </ErrorBoundary>
            </LazyMotion>
            <Toaster richColors closeButton position="top-center" />
          </NextIntlClientProvider>
        </body>
    </html>
  );
}
