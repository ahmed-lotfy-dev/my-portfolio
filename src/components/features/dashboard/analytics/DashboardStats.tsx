import { Card } from "@/src/components/ui/card"
import { getAllCertificates } from "@/src/app/actions/certificatesActions"
import { getAllProjects } from "@/src/app/actions/projectsActions"
import { getPostHogAnalytics } from "@/src/app/actions/analytics"
import AnalyticsDashboard from "@/src/components/features/dashboard/analytics/AnalyticsDashboard"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function DashboardStats() {
  const [{ allCertificates }, { allProjects }, analyticsData] = await Promise.all([
    getAllCertificates(),
    getAllProjects(),
    getPostHogAnalytics(),
  ]);

  const projectsCount = allProjects?.length || 0;
  const certificatesCount = allCertificates?.length || 0;
  const t = await getTranslations("dashboard");

  return (
    <>
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-start">
        <Link href={"/dashboard/projects"}>
          <Card className="flex flex-col justify-center items-center gap-4 cursor-pointer p-6 bg-muted hover:bg-accent/30 transition-colors">
            <h2 className="text-sm font-medium text-muted-foreground">
              {t("projects")}
            </h2>
            <p className="text-3xl font-bold">{projectsCount}</p>
          </Card>
        </Link>

        <Link href={"/dashboard/certificates"}>
          <Card className="flex flex-col justify-center items-center gap-4 cursor-pointer p-6 bg-muted hover:bg-accent/30 transition-colors">
            <h2 className="text-sm font-medium text-muted-foreground">
              {t("certificates")}
            </h2>
            <p className="text-3xl font-bold">{certificatesCount}</p>
          </Card>
        </Link>

        <Card className="flex flex-col justify-center items-center gap-4 p-6 bg-muted hover:bg-accent/30 transition-colors">
          <h2 className="text-sm font-medium text-muted-foreground">
            {t("analytics")} (7d)
          </h2>
          <p className="text-3xl font-bold">{analyticsData.uniqueVisitors}</p>
        </Card>
      </div>

      {/* Advanced Analytics Section */}
      <AnalyticsDashboard data={analyticsData} />
    </>
  )
}
