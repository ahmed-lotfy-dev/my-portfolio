import Welcome from "@/src/components/dashboard-components/Welcome"
import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"
import SystemHealth from "@/src/components/dashboard-components/SystemHealth"
import { Suspense } from "react"
import DashboardStats from "@/src/components/dashboard-components/DashboardStats"
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

      {/* System Health & Backups */}
      <SystemHealth
        isAdmin={!!isAdmin}
        cfAccountId={process.env.CF_ACCOUNT_ID}
        cfBucketName={process.env.CF_BUCKET_NAME}
      />
    </div>
  )
}
