import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { Josefin_Sans, Josefin_Slab, ABeeZee } from "next/font/google";

import { Nav } from "@/src/components/Nav";
import type { Metadata } from "next";
import { Toaster } from "@/src/components/ui/sonner";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import UserButton from "../components/dashboard-components/UserButton";
import { auth } from "@/src/auth";

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
