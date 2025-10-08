"use server"

import { db } from "@/src/db"
import { revalidatePath } from "next/cache"
import { DeleteFromS3 } from "./deleteImageAction"
import { ProjectSchema } from "../../lib/schemas/projectSchema"
import { headers } from "next/headers"
import { auth } from "@/src/lib/auth"
import { projects } from "@/src/db/schema"
import { eq } from "drizzle-orm"

// ✅ Fetch all projects
export async function getAllProjects() {
  try {
    const allProjects = await db.query.projects.findMany()
    return { allProjects }
  } catch (error) {
    console.error("❌ Failed to fetch projects:", error)
    return { error }
  }
}

// ✅ Fetch single project by ID
export async function getSingleProject(id: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    })

    if (!project) return { success: false, message: "Project not found" }

    return { success: true, message: "Project found", project }
  } catch (error) {
    console.error("❌ Failed to fetch project:", error)
    return { success: false, message: "Project not found" }
  }
}

// ✅ Add new project
export async function addProjectAction(state: any, data: FormData) {
  const title = data.get("title") as string
  const desc = data.get("desc") as string
  const repoLink = data.get("repoLink") as string
  const liveLink = data.get("liveLink") as string
  const imageLink = data.get("imageLink") as string
  const categories =
    (data.get("tags") as string)?.split(",").map((tag) => tag.trim()) || []

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to add a project.",
    }
  }

  const result = ProjectSchema.safeParse({
    title,
    desc,
    repoLink,
    liveLink,
    imageLink,
    categories,
  })

  if (!result.success) {
    console.error("❌ Validation failed:", result.error.format())
    return { success: false, error: result.error.format() }
  }

  try {
    await db.insert(projects).values({
      title,
      desc,
      repoLink,
      liveLink,
      imageLink,
      categories,
    })

    console.log("✅ Project added successfully")
    await revalidatePath("/dashboard/projects")

    return { success: true, message: "Project added successfully" }
  } catch (error) {
    console.error("❌ Database insert failed:", error)
    return { success: false, message: "Database insert failed" }
  }
}

// ✅ Edit project
export async function editProjectAction(state: any, data: FormData) {
  const id = data.get("id") as string
  const title = data.get("title") as string
  const desc = data.get("desc") as string
  const repoLink = data.get("repoLink") as string
  const liveLink = data.get("liveLink") as string
  const imageLink = data.get("imageLink") as string
  const categories =
    (data.get("tags") as string)?.split(",").map((tag) => tag.trim()) || []

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to edit a project.",
    }
  }

  const result = ProjectSchema.safeParse({
    title,
    desc,
    repoLink,
    liveLink,
    imageLink,
    categories,
  })

  if (!result.success) {
    console.error("❌ Validation failed:", result.error.format())
    return { success: false, error: result.error.format() }
  }

  try {
    const oldProject = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    })

    if (oldProject?.imageLink && oldProject.imageLink !== imageLink) {
      console.log("🖼️ New image detected — deleting old one")
      await DeleteFromS3(oldProject.imageLink)
    }

    await db
      .update(projects)
      .set({ title, desc, repoLink, liveLink, imageLink, categories })
      .where(eq(projects.id, id))

    await revalidatePath("/dashboard/projects")
    console.log("✅ Project updated successfully")
    return { success: true, message: "Project updated successfully" }
  } catch (error) {
    console.error("❌ Project update failed:", error)
    return { success: false, message: "Project update failed" }
  }
}

// ✅ Delete project
export async function deleteProjectAction(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to delete a project.",
    }
  }

  try {
    await db.delete(projects).where(eq(projects.id, id))
    await revalidatePath("/dashboard/projects")

    console.log("✅ Project deleted:", id)
    return { success: true, message: "Project deleted successfully" }
  } catch (error) {
    console.error("❌ Failed to delete project:", error)
    return { success: false, message: "Project deletion failed" }
  }
}
