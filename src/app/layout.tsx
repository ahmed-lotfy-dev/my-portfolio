import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";

import { Nav } from "@/src/components/Nav";
import type { Metadata } from "next";
import { Toaster } from "@/src/components/ui/sonner";
import { ReactNode } from "react";
import { inter, josefinSans, josefinSlab } from "@/src/components/ui/fonts";
import UserButton from "../components/dashboard-components/UserButton";

export const metadata: Metadata = {
  title: "Ahmed Lotfy",
  description: "Portfolio of Ahmed Lotfy The Full Stack Developer",
};
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth max-h-svh">
      <body
        className={`${inter.className} ${josefinSans.className} ${josefinSlab.className} antialiased`}
      >
        <main className="font-main">
          <div className="w-full flex justify-center items-center">
            <Nav>
              <UserButton className="flex absolute right-16 md:ml-5 md:static" />
            </Nav>
          </div>
          {children}
          <GoogleAnalytics gaId={process.env.GA_ID} />
          <Toaster />
        </main>
      </body>
    </html>
  );
}
