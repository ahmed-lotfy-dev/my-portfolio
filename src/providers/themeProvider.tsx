"use client";
import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("@/src/components/ui/sonner").then(m => m.Toaster), { 
  ssr: false 
});

type Props = { children: ReactNode };

export default function themeProvider({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
