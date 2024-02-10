import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";

import { Roboto_Serif, Roboto_Slab } from "next/font/google";

import { Nav } from "@/src/components/Nav";
import type { Metadata } from "next";
import { Toaster } from "@/src/components/ui/sonner";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/src/auth";

const josefinsans = Roboto_Serif({
  subsets: ["latin"],
  variable: "--main-font",
});

const josefinslab = Roboto_Slab({
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
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className="scroll-smooth max-h-svh">
      <body className={`${josefinsans.variable} ${josefinslab.variable}`}>
        <main className="font-main">
          <SessionProvider session={session}>
            <Nav />
            {children}
            <GoogleAnalytics gaId={process.env.GA_ID} />
            <Toaster />
          </SessionProvider>
        </main>
      </body>
    </html>
  );
}
