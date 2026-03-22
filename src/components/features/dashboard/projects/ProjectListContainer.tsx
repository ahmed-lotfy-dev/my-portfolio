import { getAllProjects } from "@/src/app/actions/projects/queries";
import ProjectList from "./ProjectList";

export default async function ProjectListContainer() {
  const { allProjects } = await getAllProjects();
  return <ProjectList allProjects={allProjects} />;
}
