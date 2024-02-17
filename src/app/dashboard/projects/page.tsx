import { NotAuthenticated } from "@/src/components/dashboard-components/NotAuthenticated";
import ProjectList from "@/src/components/dashboard-components/project/ProjectList";
import { getAllProjects } from "../../lib/getProjects";
import { auth } from "@/src/auth";
import { AddProjectComponent } from "@/src/components/dashboard-components/project/AddProject";
export default async function AddProject({}) {
  const session = await auth();
  const user = session?.user;
  const { allProjects } = await getAllProjects();

  return (
    <div className="w-full flex justify-center items-start pt-14">
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
