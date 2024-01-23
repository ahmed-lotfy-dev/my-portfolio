import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import "./globals.css";
import { Josefin_Sans, Josefin_Slab } from "next/font/google";
import { NextAuthProvider } from "@/src/app/provider";

import Nav from "@/src/app/components/Nav";
import type { Metadata } from "next";
import Loading from "./components/Loading";
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
      <html lang="en">
        <body className={`${josefinsans.variable}${josefinslab.variable}`}>
          <Suspense fallback={<div>Loading...</div>}>
            <Nav session={session} />
            {children}
          </Suspense>
        </body>
      </html>
    </NextAuthProvider>
  );
}
