import { prisma } from "./prisma";

async function getAllProjects() {
  try {
    const allProjects = await prisma.project.findMany();

    return { allProjects };
  } catch (error) {
    return { error };
  }
}

async function getSingleProject(projTitle: string) {
  try {
    const project = await prisma.project.findFirst({
      where: { projTitle: projTitle },
    });
    console.log(project);

    return { sucess: true, message: "Project Found", project };
  } catch (error) {
    return { success: false, message: "Projcts Not Found" };
  }
}
export { getAllProjects, getSingleProject };
