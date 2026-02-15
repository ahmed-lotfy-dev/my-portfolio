import { cookies, headers } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import Aside from "@/src/components/features/dashboard/layout/Aside";
import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN" || user?.email === process.env.ADMIN_EMAIL;

  if (!user) {
    redirect(`/${locale}/login`);
  }

  if (!isAdmin) {
    redirect(`/${locale}`);
  }

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
