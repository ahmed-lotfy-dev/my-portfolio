import { prisma } from "./prisma";

async function getAllProjects() {
  try {
    const allProjects = await prisma.project.findMany();

    return { allProjects };
  } catch (error) {
    return { error };
  }
}

async function getSingleProject(projectTitle: string) {
  try {
    const project = await prisma.project.findFirst({
      where: { title: projectTitle },
    });

    return { sucess: true, message: "Project Found", project };
  } catch (error) {
    return { success: false, message: "Projcts Not Found" };
  }
}
export { getAllProjects, getSingleProject };
