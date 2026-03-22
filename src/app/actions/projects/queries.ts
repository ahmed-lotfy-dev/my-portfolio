
"use server";

import { db } from "@/src/db";
import { projects } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import { logger } from "@/src/lib/utils/logger";

export async function getAllProjects() {
  try {
    const allProjects = await db.query.projects.findMany({
      orderBy: [desc(projects.displayOrder), desc(projects.createdAt)],
    });
    return { allProjects };
  } catch (error: any) {
    if (error?.code === "ECONNREFUSED" || error?.cause?.code === "ECONNREFUSED") {
      logger.warn("Database connection refused (expected during build). Returning empty projects list.");
      return { allProjects: [] };
    }
    logger.error("Failed to fetch projects:", error);
    return { error };
  }
}

export async function getSingleProject(id: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    });
    if (!project) return { success: false, message: "Project not found" };
    return { success: true, message: "Project found", project };
  } catch (error) {
    logger.error("Failed to fetch project:", error);
    return { success: false, message: "Project not found" };
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.slug, slug),
    });
    if (!project) return { success: false, message: "Project not found" };
    return { success: true, message: "Project found", project };
  } catch (error) {
    logger.error("Failed to fetch project by slug:", error);
    return { success: false, message: "Project not found" };
  }
}
