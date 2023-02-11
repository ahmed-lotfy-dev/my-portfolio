"use client";

import "./globals.css";
import { Josefin_Sans, Josefin_Slab } from "@next/font/google";
import Nav from "../components/nav";
import { usePathname } from "next/navigation";

const josefinsans = Josefin_Sans({
  variable: "--main-font",
});

const josefinslab = Josefin_Slab({
  variable: "--heading-font",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <Nav />
          {children}
      </body>
    </html>
  );
}
