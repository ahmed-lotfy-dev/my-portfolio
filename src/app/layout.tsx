import "./globals.css"
import { Josefin_Sans, Josefin_Slab } from "next/font/google"
// import AuthContext from "@/src/app/AuthContext"
import { ClerkProvider } from "@clerk/nextjs"

import Nav from "./components/nav"
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
    <ClerkProvider>
      <html lang='en'>
        <body className={`${josefinsans.variable}${josefinslab.variable}`}>
          {/* @ts-ignore */}
          {/* <AuthContext session={session}> */}
          <Nav />
          {children}
          {/* </AuthContext> */}
        </body>
      </html>
    </ClerkProvider>
  )
}
