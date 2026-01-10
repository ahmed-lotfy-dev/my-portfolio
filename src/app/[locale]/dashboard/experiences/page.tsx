import { getExperiences } from "@/src/app/actions/experienceActions";
import ExperienceList from "@/src/components/features/dashboard/experiences/ExperienceList";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function DashboardExperiencesPage() {
  const experiences = await getExperiences();
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin =
    session?.user?.role === "ADMIN" ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="container mx-auto py-10 px-4">
      <ExperienceList experiences={experiences} isAdmin={isAdmin} />
    </div>
  );
}
