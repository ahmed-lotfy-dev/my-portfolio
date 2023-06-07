"use server"
import { revalidatePath } from "next/cache"
import prisma from "./lib/prismadb"

export async function AddCertificateAction(data: FormData) {
  const certTitle = data.get("certTitle") as string
  const certDesc = data.get("certDesc") as string
  const courseLink = data.get("courseLink") as string
  const certProfLink = data.get("certProfLink") as string
  const certImageLink = data.get("certImageLink") as string

  //@ts-ignore
  if (!certImageLink) return
  const certificate = await prisma.certificate.create({
    data: { certTitle, certDesc, courseLink, certProfLink, certImageLink },
  })
  console.log("certificate added successfully")
  revalidatePath("/dashboard/add-certificate")
}

export async function AddProjectAction(data: FormData) {
  const projectTitle = data.get("projectTitle") as string
  const projectDesc = data.get("projectDesc") as string
  const projectRepoLink = data.get("projectRepoLink") as string
  const projectLiveLink = data.get("projectLiveLink") as string
  const projectImageLink = data.get("projectImageLink") as string
  const tags = data.get("tags")
  console.log(tags)

  // if (!projectImageLink) return
  const project = await prisma.project.create({
    data: {
      projectTitle,
      projectDesc,
      projectRepoLink,
      projectLiveLink,
      projectImageLink,
    },
  })
  console.log("project added successfully")
  revalidatePath("/dashboard/add-project")
}
