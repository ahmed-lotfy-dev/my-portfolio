import { GoogleAnalytics } from "@next/third-parties/google"

import "./globals.css"

import { Nav } from "@/src/components/Nav"
import type { Metadata } from "next"
import { Toaster } from "@/src/components/ui/sonner"
import { ReactNode } from "react"
import { inter, josefinSans, josefinSlab } from "@/src/components/ui/fonts"
import UserButton from "../components/dashboard-components/UserButton"
import Providers from "./provider"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Ahmed Lotfy",
  description: "Portfolio of Ahmed Lotfy The Full Stack Developer",
}
export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="en"
      className="scroll-smooth max-h-svh"
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} ${josefinSans.className} ${josefinSlab.className} antialiased`}
      >
        <main className="font-main">
          <Providers>
            <Nav>
              <UserButton className="flex absolute right-16 md:ml-5 md:static" />
            </Nav>

            {children}
            <GoogleAnalytics gaId={process.env.GA_ID} />
            <Toaster />
          </Providers>
        </main>
      </body>
    </html>
  )
}
