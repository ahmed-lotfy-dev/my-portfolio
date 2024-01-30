import Aside from "@/src/components/dashboardcomponents/Aside";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh w-full pt-20">
      <Aside />
      {children}
    </div>
  );
}
