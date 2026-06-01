"use client";

import { useFlags } from "@/src/providers/feature-flags";
import MaintenancePage from "./MaintenancePage";

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { maintenance } = useFlags();

  // Don't block render while loading -- flags default to false (off)
  // This prevents a blank screen on first render
  if (maintenance) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
