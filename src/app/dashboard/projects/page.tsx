import ProjectList from "@/src/components/dashboard-components/project/ProjectList";
import { getAllProjects } from "../../lib/getProjects";
import { AddProjectComponent } from "@/src/components/dashboard-components/project/AddProject";

export default async function AddProject({}) {
  const { allProjects } = await getAllProjects();
  return (
    <div className="w-full flex justify-center items-start pt-14">
      <div className="flex flex-col justify-center items-center w-full">
        <AddProjectComponent />
        <ProjectList allProjects={allProjects} />
      </div>
    </div>
  );
}
