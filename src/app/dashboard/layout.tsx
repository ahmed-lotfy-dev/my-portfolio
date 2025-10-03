import Aside from "@/src/components/dashboard-components/Aside"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen ">
      <Aside />
      <div className="flex-1 overflow-auto">
        <div className="">{children}</div>
      </div>
    </div>
  )
}
