import { NextIntlClientProvider, hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@/src/i18n/routing"

import { GoogleAnalytics } from "@next/third-parties/google"

import "../globals.css"

import { Nav } from "@/src/components/homepage/Nav"
import type { Metadata } from "next"
import { Toaster } from "@/src/components/ui/sonner"
import { ReactNode } from "react"
import { inter, plusJakarta, sora } from "@/src/components/ui/fonts"
import UserButton from "@/src/components/dashboard-components/UserButton"
import Providers from "@/src/app/provider"
import { getMessages } from "next-intl/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmedlotfy.site"), // your production domain
  title: {
    default: "Ahmed Lotfy – Full-Stack Software Engineer",
    template: "%s | Ahmed Lotfy",
  },
  description:
    "Portfolio of Ahmed Lotfy – Full-Stack Software Engineer. I build responsive, and scalable web applications. Let's create something amazing together.",
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
  creator: "Ahmed Lotfy",
  publisher: "Ahmed Lotfy",
  openGraph: {
    type: "website",
    url: "https://ahmedlotfy.site",
    title: "Ahmed Lotfy – Full-Stack Software Engineer",
    description:
      "Portfolio of Ahmed Lotfy – Full-Stack Software Engineer. I build responsive, and scalable web applications.",
    siteName: "Ahmed Lotfy Portfolio",
    images: [
      {
        url: "https://ahmedlotfy.site/og-image.png", // make a custom OG image
        width: 1200,
        height: 630,
        alt: "Ahmed Lotfy – Full-Stack Software Engineer",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Lotfy – Full-Stack Software Engineer",
    description:
      "Portfolio of Ahmed Lotfy – Full-Stack Software Engineer. I build responsive, and scalable web applications.",
    creator: "@yourTwitterHandle",
    images: ["https://ahmedlotfy.site/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ahmedlotfy.site",
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params 
  const isArabic = locale === "ar" ? "rtl" : "ltr"

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={isArabic}
      className="scroll-smooth max-h-svh"
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} ${plusJakarta.variable} ${sora.variable} antialiased`}
      >
        <main className="font-main ">
          <Providers>
            <NextIntlClientProvider messages={messages}>
              <Nav>
                <UserButton className="flex absolute right-16 md:ml-5 md:static" />
              </Nav>

              {children}
            </NextIntlClientProvider>
          </Providers>
          <GoogleAnalytics gaId={"G-97J3PKW2DK"} />
          <Toaster />
        </main>
      </body>
    </html>
  )
}
