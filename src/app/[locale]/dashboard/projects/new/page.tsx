import { addProjectAction } from "@/src/app/actions/projectsActions";
import ProjectForm from "@/src/components/dashboard-components/project/ProjectForm";

export default function AddProjectPage() {
  return (
    <div className="w-full flex justify-center items-start">
      <ProjectForm action={addProjectAction} mode="create" />
    </div>
  );
}
