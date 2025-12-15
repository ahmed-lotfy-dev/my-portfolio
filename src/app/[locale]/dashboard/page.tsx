import Welcome from "@/src/components/features/dashboard/Welcome"
import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"

import { Suspense } from "react"
import DashboardStats from "@/src/components/features/dashboard/analytics/DashboardStats"
import DashboardSkeleton from "@/src/components/skeletons/DashboardSkeleton"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Check if user is admin
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.email === process.env.ADMIN_EMAIL;

  return (
    <div className="flex flex-col gap-6 w-full p-5 pt-10">
      <Welcome />

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  )
}
