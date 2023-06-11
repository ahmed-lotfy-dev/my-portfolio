import "./globals.css"
import { Josefin_Sans, Josefin_Slab } from "next/font/google"
import { NextAuthProvider } from "@/src/app/provider"

import Nav from "@/src/components/Nav"
import type { Metadata } from "next"

const josefinsans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--main-font",
})

const josefinslab = Josefin_Slab({
  subsets: ["latin"],
  variable: "--heading-font",
})

export const metadata: Metadata = {
  title: "Ahmed Lotfy",
  description: "Portfolio of Ahmed Lotfy The Full Stack Developer",
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextAuthProvider>
      <html lang='en'>
        <body className={`${josefinsans.variable}${josefinslab.variable}`}>
          <Nav />
          {children}
        </body>
      </html>
    </NextAuthProvider>
  )
}
