import { addProjectAction } from "@/src/app/actions/projectsActions";
import ProjectForm from "@/src/components/features/dashboard/projects/ProjectForm";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function AddProjectPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="w-full flex justify-center items-start">
      <ProjectForm action={addProjectAction} mode="create" user={session?.user} />
    </div>
  );
}
