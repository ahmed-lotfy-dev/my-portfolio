import { getAllProjects } from "@/src/app/actions/projectsActions";
import ProjectList from "./ProjectList";

export default async function ProjectListContainer() {
  const { allProjects } = await getAllProjects();
  return <ProjectList allProjects={allProjects} />;
}
