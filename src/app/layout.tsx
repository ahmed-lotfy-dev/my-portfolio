import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import "./globals.css";
import { Josefin_Sans, Josefin_Slab } from "next/font/google";
import { NextAuthProvider } from "@/src/app/provider";

import Header from "@/src/components/Header";
import type { Metadata } from "next";
import { Suspense } from "react";

const josefinsans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--main-font",
});

const josefinslab = Josefin_Slab({
  subsets: ["latin"],
  variable: "--heading-font",
});

export const metadata: Metadata = {
  title: "Ahmed Lotfy",
  description: "Portfolio of Ahmed Lotfy The Full Stack Developer",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <NextAuthProvider>
      <html lang="en" className="scroll-smooth">
        <body className={`${josefinsans.variable}${josefinslab.variable}`}>
          <Header session={session} />
          {children}
        </body>
      </html>
    </NextAuthProvider>
  );
}
