"use client";

import { SessionProvider } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Proiders({ children }: LayoutProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
