import Welcome from "@/src/components/features/dashboard/Welcome"

import { Suspense } from "react"
import DashboardStats from "@/src/components/features/dashboard/analytics/DashboardStats"
import DashboardSkeleton from "@/src/components/skeletons/DashboardSkeleton"

export default async function Page() {
  return (
    <div className="flex flex-col gap-6 w-full p-5 pt-10">
      <Welcome />

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  )
}
