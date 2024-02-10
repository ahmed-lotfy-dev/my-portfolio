import Aside from "@/src/components/dashboard-components/Aside";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <Aside />
      {children}
    </div>
  );
}
