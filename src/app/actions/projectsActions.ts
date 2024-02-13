"use server";

import { projects } from "@/src/db/schema/projects";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { DeleteFromS3 } from "./deleteImageAction";
import { ProjectSchema } from "../lib/schemas/projectSchema";

export async function getAllProjects() {
  try {
    const allProjects = await db.query.projects.findMany();

    return { allProjects };
  } catch (error) {
    return { error };
  }
}

export async function getSingleProject(projectTitle: string) {
  try {
    const singleProject = await db.query.projects.findFirst({
      where: eq(projects.projTitle, projectTitle),
    });
    return { sucess: true, message: "Project Found", singleProject };
  } catch (error) {
    return { success: false, message: "Projcts Not Found" };
  }
}

export async function addProjectAction(state: any, data: FormData) {
  const projTitle = data.get("title") as string;
  const projDesc = data.get("desc") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const projImageLink = data.get("imageLink") as string;
  const categories = data.get("tags") as any;
  const projCategories = [categories.slice(",")];

  const user = await getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  }

  const result = ProjectSchema.safeParse({
    projTitle,
    projDesc,
    repoLink,
    liveLink,
    projImageLink,
    projCategories,
  });
  if (result.success) {
    const project = await db
      .insert(projects)
      .values({
        projTitle,
        projDesc,
        repoLink,
        liveLink,
        projImageLink,
        projCategories,
      })
      .returning();

    console.log("project added successfully");
    revalidatePath("/dashboard/projects");
    return { success: true, data: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function editProjectAction(state: any, data: FormData) {
  const projectId = data.get("id") as unknown as number;
  const projTitle = data.get("projTitle") as string;
  const projDesc = data.get("projDesc") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const projImageLink = data.get("projImageLink") as string;
  const categories = data.get("tags") as any;
  const projCategories = [categories.slice(",")];

  const user = await getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  }

  const result = ProjectSchema.safeParse({
    projTitle,
    projDesc,
    repoLink,
    liveLink,
    projImageLink,
    projCategories,
  });
  if (result.success) {
    const oldProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (oldProject?.projImageLink !== projImageLink) {
      console.log("New Image");
      DeleteFromS3(oldProject?.projImageLink);
    }

    const project = await db
      .update(projects)
      .set({
        projTitle,
        projDesc,
        repoLink,
        liveLink,
        projImageLink,
        projCategories,
      })
      .where(eq(projects.id, projectId))
      .returning();
    console.log("project updated successfully");
    revalidatePath("/dashboard/projects");
    return { success: true, data: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function deleteProjectAction(projectId: number) {
  const user = await getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Delete Project",
    };
  }
  const deleteProjct = await db
    .delete(projects)
    .where(eq(projects.id, projectId))
    .returning();
  console.log("projct deleted", projectId);
  revalidatePath("/dashboard/projects");
  return { success: true, message: "Project Deleted Successfully" };
}
