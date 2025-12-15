import { editProjectAction, getSingleProject } from "@/src/app/actions/projectsActions";
import ProjectForm from "@/src/components/dashboard-components/project/ProjectForm";
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSingleProject(id);

  if (!result.success || !result.project) {
    return notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="w-full flex justify-center items-start">
      <ProjectForm
        action={editProjectAction}
        mode="edit"
        initialData={result.project}
        user={session?.user}
      />
    </div>
  );
}
