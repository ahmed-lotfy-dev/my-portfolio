import { getExperienceById } from "@/src/app/actions/experienceActions";
import ExperienceForm from "@/src/components/features/dashboard/experiences/ExperienceForm";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperienceById(id);

  if (!experience) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <ExperienceForm experience={experience} />
    </div>
  );
}
