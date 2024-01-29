import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

import { NotAuthenticated } from "@/src/components/dashboardcomponents/NotAuthenticated";
import { AddProjectComponent } from "@/src/components/dashboardcomponents/AddProject";
import ProjectList from "@/src/components/dashboardcomponents/ProjectList";
import getAllProjects from "../../lib/getProjects";

export default async function AddProject({}) {
  const user = await getServerSession(authOptions);
  const { allProjects } = await getAllProjects();
  return (
    <div className="w-full flex justify-center items-start">
      {!user && <NotAuthenticated />}
      {user && (
        <div className="flex flex-col justify-center items-center w-full">
          <AddProjectComponent />
          <ProjectList allProjects={allProjects} />
        </div>
      )}
    </div>
  );
}
