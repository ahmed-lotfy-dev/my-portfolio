"use client";

import dynamic from "next/dynamic";
import { useIsClient } from "@/src/hooks/useIsClient";

const Toaster = dynamic(() => import("@/src/components/ui/sonner").then(m => m.Toaster), { 
  ssr: false 
});

const UserButton = dynamic(() => import("@/src/components/features/dashboard/layout/UserButton"), { 
  ssr: false 
});

export function DynamicToaster() {
  const isClient = useIsClient();
  if (!isClient) return null;
  return <Toaster />;
}

export function DynamicUserButton({ className }: { className?: string }) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return <UserButton className={className} />;
}
