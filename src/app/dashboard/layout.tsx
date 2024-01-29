import Aside from "@/src/components/dashboardcomponents/Aside";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh_-_11vh)] w-full">
      <Aside />
      {children}
    </div>
  );
}
