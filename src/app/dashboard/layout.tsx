import Aside from "@/src/components/dashboard-components/Aside";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Aside />
      {children}
    </div>
  );
}
