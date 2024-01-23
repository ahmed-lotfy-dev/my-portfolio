import { prisma } from "./prisma";

export default async function getAllProjects() {
  try {
    const allProjects = await prisma.project.findMany();

    return { allProjects };
  } catch (error) {
    return { error };
  }
}
