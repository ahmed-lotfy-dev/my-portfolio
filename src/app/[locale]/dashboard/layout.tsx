import { cookies, headers } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import Aside from "@/src/components/features/dashboard/layout/Aside";
import { auth } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Aside user={user} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
