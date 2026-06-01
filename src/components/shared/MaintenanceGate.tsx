"use client";

import { useFlags } from "@/src/providers/feature-flags";
import MaintenancePage from "./MaintenancePage";

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { maintenance, loaded } = useFlags();

  if (!loaded) return null; // Don't flash content while loading flags

  if (maintenance) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
