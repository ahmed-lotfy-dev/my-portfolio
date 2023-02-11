import Aside from "./components/aside";
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-full">
      {/* Include shared UI here e.g. a header or sidebar */}
      <Aside />
      {children}
    </section>
  );
}
