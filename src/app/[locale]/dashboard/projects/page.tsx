import ProjectList from "@/src/components/dashboard-components/project/ProjectList";

import { getAllProjects } from "@/src/app/actions/projectsActions";

export default async function ProjectsPage({}) {
  const { allProjects } = await getAllProjects();
  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex flex-col justify-center items-center w-full">
        <ProjectList allProjects={allProjects} />
      </div>
    </div>
  );
}
