import { NotAuthenticated } from "@/src/components/dashboard-components/NotAuthenticated";
import ProjectList from "@/src/components/dashboard-components/project/ProjectList";
import { getAllProjects } from "../../lib/getProjects";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { getUser } from "../../lib/getUser";

export default async function AddProject({}) {
  const user = await getUser();
  const { allProjects } = await getAllProjects();

  return (
    <div className="w-full flex justify-center items-start pt-14">
      {!user && <NotAuthenticated />}
      {user && (
        <div className="flex flex-col justify-center items-center w-full">
          <Link href={`/dashboard/projects/add`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
              Add Certificate
            </Button>
          </Link>
          <ProjectList allProjects={allProjects} />
        </div>
      )}
    </div>
  );
}
