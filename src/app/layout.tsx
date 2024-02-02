import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { Josefin_Sans, Josefin_Slab } from "next/font/google";
import { NextAuthProvider } from "@/src/app/provider";

import { Nav } from "@/src/components/Nav";
import type { Metadata } from "next";

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
      <html lang="en" className="scroll-smooth max-h-svh">
        <body className={`${josefinsans.variable}${josefinslab.variable}`}>
          <Nav session={session} />
          {children}
          <GoogleAnalytics gaId={process.env.GA_ID} />
        </body>
      </html>
    </NextAuthProvider>
  );
}
