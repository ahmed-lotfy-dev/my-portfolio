import Aside from "@/src/components/dashboard-components/Aside";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh w-full">
      <Aside />
      {children}
    </div>
  );
}
