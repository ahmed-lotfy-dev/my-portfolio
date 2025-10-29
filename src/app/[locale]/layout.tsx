import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { GoogleAnalytics } from "@next/third-parties/google";

import "../globals.css";

import { Nav } from "@/src/components/homepage/Nav";
import type { Metadata } from "next";
import { Toaster } from "@/src/components/ui/sonner";
import UserButton from "@/src/components/dashboard-components/UserButton";
import Providers from "@/src/app/provider";
import { getMessages } from "next-intl/server";
import { inter, sora, tajawal } from "@/src/components/ui/fonts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
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
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
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
      className="scroll-smooth max-h-svh"
    >
      <body
        className={`${inter.variable}  ${sora.variable} ${
          isArabic ? tajawal.variable : ""
        } antialiased font-main`}
        suppressHydrationWarning
      >
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Nav>
              <UserButton className="flex absolute right-16 md:ml-5 md:static" />
            </Nav>
            {children}
          </NextIntlClientProvider>
        </Providers>

        <GoogleAnalytics gaId="G-97J3PKW2DK" />
        <Toaster />
      </body>
    </html>
  );
}
