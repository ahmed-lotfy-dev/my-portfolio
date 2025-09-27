"use server"

import { db } from "@/src/db"
import { revalidatePath } from "next/cache"
import { DeleteFromS3 } from "./deleteImageAction"
import { ProjectSchema } from "../../lib/schemas/projectSchema"
import { headers } from "next/headers"
import { auth } from "@/src/lib/auth"
import { projects } from "@/src/db/schema"
import { eq } from "drizzle-orm"

export async function getAllProjects() {
  try {
    const allProjects = await db.query.projects.findMany()
    return { allProjects }
  } catch (error) {
    return { error }
  }
}

export async function getSingleProject(id: string) {
  try {
    const singleProject = await db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, id),
    })
    return { sucess: true, message: "Project Found", singleProject }
  } catch (error) {
    return { success: false, message: "Projcts Not Found" }
  }
}

export async function addProjectAction(state: any, data: FormData) {
  const title = data.get("title") as string
  const desc = data.get("desc") as string
  const repoLink = data.get("repoLink") as string
  const liveLink = data.get("liveLink") as string
  const imageLink = data.get("imageLink") as string
  const categories = data.get("tags") as any
  const projCategories = [categories.slice(",")]

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    }
  }

  const result = ProjectSchema.safeParse({
    title,
    desc,
    repoLink,
    liveLink,
    imageLink,
    projCategories,
  })
  if (result.success) {
    const project = await db.insert(projects).values({
      title,
      desc,
      repoLink,
      liveLink,
      imageLink,
      categories: projCategories,
    })

    console.log("project added successfully")
    revalidatePath("/dashboard/projects")
    return { success: true, data: result.data }
  }
  if (result.error) {
    return { success: false, error: result.error.format() }
  }
}

export async function editProjectAction(state: any, data: FormData) {
  const id = data.get("id") as unknown as string
  const title = data.get("title") as string
  const desc = data.get("desc") as string
  const repoLink = data.get("repoLink") as string
  const liveLink = data.get("liveLink") as string
  const imageLink = data.get("imageLink") as string
  const categories = data.get("tags") as any
  const projCategories = [categories.slice(",")]

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    }
  }

  const result = ProjectSchema.safeParse({
    title,
    desc,
    repoLink,
    liveLink,
    imageLink,
    projCategories,
  })
  if (result.success) {
    const oldProject = await db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, id),
    })

    if (oldProject && oldProject.imageLink !== imageLink) {
      console.log("New Image")
      DeleteFromS3(oldProject.imageLink)
    }

    const project = await db
      .update(projects)
      .set({
        title,
        desc,
        repoLink,
        liveLink,
        imageLink,
        categories,
      })
      .where(eq(projects.id, id))

    console.log("project updated successfully")
    revalidatePath("/dashboard/projects")
    return { success: true, data: result.data }
  }
  if (result.error) {
    return { success: false, error: result.error.format() }
  }
}

export async function deleteProjectAction(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Delete Project",
    }
  }
  const deletedProject = await db.delete(projects).where(eq(projects.id, id))

  console.log("projct deleted", id)
  revalidatePath("/dashboard/projects")
  return { success: true, message: "Project Deleted Successfully" }
}
