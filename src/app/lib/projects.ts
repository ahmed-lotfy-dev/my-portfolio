import { prisma } from "./prismadb"

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany()
    return { projects }
  } catch (error) {
    return { error }
  }
}
