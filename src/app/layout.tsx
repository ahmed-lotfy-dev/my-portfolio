"use client";

import "./globals.css";
import { Josefin_Sans, Josefin_Slab } from "@next/font/google";
import Nav from "../components/nav";
import Providers from "@/src/components/providers";

const josefinsans = Josefin_Sans({
  variable: "--main-font",
});

const josefinslab = Josefin_Slab({
  variable: "--heading-font",
});

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${josefinsans.variable} ${josefinslab.variable} min-h-[100dvh]`}
    >
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="h-screen">
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
