import { prisma } from "./prisma"

import { Project } from "@prisma/client"

export default async function getAllProjects() {
  try {
    const allProjects = await prisma.project.findMany()
    return { allProjects }
  } catch (error) {
    return { error }
  }
}
