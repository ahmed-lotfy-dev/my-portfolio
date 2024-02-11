import { auth } from "@/auth";
import Aside from "@/src/components/dashboard-components/Aside";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex h-screen w-screen">
      <Aside />
      {children}
    </div>
  );
}
