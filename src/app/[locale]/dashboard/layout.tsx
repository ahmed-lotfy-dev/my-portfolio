import Aside from "@/src/components/dashboard-components/Aside";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <div className="flex min-h-screen w-full">
      <Aside />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
