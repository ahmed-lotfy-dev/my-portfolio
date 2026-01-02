"use server";

import { db } from "@/src/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DeleteFromS3 } from "./deleteImageAction";
import { getProjectSchema } from "../../lib/schemas/projectSchema";
import { requireAdmin } from "@/src/lib/utils/authMiddleware";
import { translateBidirectional } from "@/src/lib/utils/translationHelper";
import { parseImageArray, parseCategories, parseBoolean, getString } from "@/src/lib/utils/formDataParser";
import { projects } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import { logger } from "@/src/lib/utils/logger";

// ✅ Fetch all projects
export async function getAllProjects() {
  try {
    const allProjects = await db.query.projects.findMany({
      orderBy: [desc(projects.displayOrder), desc(projects.createdAt)],
    });
    return { allProjects };
  } catch (error: any) {
    // Check if it's a connection refused error (common during build time)
    if (error?.code === "ECONNREFUSED" || error?.cause?.code === "ECONNREFUSED") {
      logger.warn("Database connection refused (expected during build). Returning empty projects list.");
      return { allProjects: [] };
    }

    logger.error("Failed to fetch projects:", error);
    return { error };
  }
}

// ✅ Fetch single project by ID
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

// ✅ Fetch single project by Slug
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

// ✅ Add new project
export async function addProjectAction(state: any, data: FormData) {
  // Check admin authorization
  const authResult = await requireAdmin("You don't have privilege to add a project.");
  if (!authResult.isAuthorized) {
    return authResult;
  }

  // Parse form data using utilities
  const title_en = getString(data, "title_en");
  const title_ar = getString(data, "title_ar");
  const desc_en = getString(data, "desc_en");
  const desc_ar = getString(data, "desc_ar");
  const repoLink = getString(data, "repoLink");
  const liveLink = getString(data, "liveLink");
  const coverImage = getString(data, "coverImage");
  const categories = parseCategories(data);
  const images = parseImageArray(data);
  const published = parseBoolean(data, "published", true);
  const slug = getString(data, "slug");
  const content_en = getString(data, "content_en");
  const content_ar = getString(data, "content_ar");

  const schema = await getProjectSchema("en");
  const result = schema.safeParse({
    title_en,
    title_ar,
    desc_en,
    desc_ar,
    slug,
    content_en,
    content_ar,
    repoLink,
    liveLink,
    coverImage,
    images,
    categories,
  });

  if (!result.success) {
    logger.error("Validation failed:", result.error.format());
    return { success: false, error: result.error.format() };
  }

  try {
    // Use translation helper for bidirectional translation
    const translatedTitle = await translateBidirectional(
      { en: title_en, ar: title_ar },
      "Title"
    );
    const translatedDesc = await translateBidirectional(
      { en: desc_en, ar: desc_ar },
      "Description"
    );

    await db.insert(projects).values({
      title_en: translatedTitle.en,
      title_ar: translatedTitle.ar,
      desc_en: translatedDesc.en,
      desc_ar: translatedDesc.ar,
      repoLink,
      liveLink,
      coverImage,
      images,
      categories,
      published,
      slug: slug || translatedTitle.en.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      content_en,
      content_ar,
      displayOrder: (
        await db
          .select({ max: projects.displayOrder })
          .from(projects)
          .orderBy(desc(projects.displayOrder))
          .limit(1)
      ).at(0)?.max
        ? ((
          await db
            .select({ max: projects.displayOrder })
            .from(projects)
            .orderBy(desc(projects.displayOrder))
            .limit(1)
        ).at(0)?.max || 0) + 1
        : 0,
    });

    logger.info("Project added successfully");
    await revalidatePath("/dashboard/projects");

    return { success: true, message: "Project added successfully" };
  } catch (error) {
    logger.error("Database insert failed:", error);
    return { success: false, message: "Database insert failed" };
  }
}

// ✅ Edit project
export async function editProjectAction(state: any, data: FormData) {
  // Check admin authorization
  const authResult = await requireAdmin("You don't have privilege to edit a project.");
  if (!authResult.isAuthorized) {
    return authResult;
  }

  // Parse form data using utilities
  const id = getString(data, "id");
  const title_en = getString(data, "title_en");
  const title_ar = getString(data, "title_ar");
  const desc_en = getString(data, "desc_en");
  const desc_ar = getString(data, "desc_ar");
  const repoLink = getString(data, "repoLink");
  const liveLink = getString(data, "liveLink");
  const coverImage = getString(data, "coverImage");
  const categories = parseCategories(data);
  const images = parseImageArray(data);
  const published = parseBoolean(data, "published", true);
  const slug = getString(data, "slug");
  const content_en = getString(data, "content_en");
  const content_ar = getString(data, "content_ar");

  logger.debug("Project ID:", id);
  logger.debug("Edit Project - Categories Array:", categories);

  const schema = await getProjectSchema("en");
  const result = schema.safeParse({
    title_en,
    title_ar,
    desc_en,
    desc_ar,
    slug,
    content_en,
    content_ar,
    repoLink,
    liveLink,
    coverImage,
    images,
    categories,
  });

  if (!result.success) {
    logger.error("Validation failed:", result.error.format());
    return { success: false, error: result.error.format() };
  }

  try {
    const oldProject = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    });

    // Check if the old cover image is still in use (either as cover or in the gallery)
    const isOldImageKept = images.includes(oldProject?.coverImage || "");

    if (oldProject?.coverImage && oldProject.coverImage !== coverImage && !isOldImageKept) {
      logger.info("Old cover image removed from gallery — deleting from S3");
      await DeleteFromS3(oldProject.coverImage);
    }

    // Use translation helper for bidirectional translation
    const translatedTitle = await translateBidirectional(
      { en: title_en, ar: title_ar },
      "Title"
    );
    const translatedDesc = await translateBidirectional(
      { en: desc_en, ar: desc_ar },
      "Description"
    );

    await db
      .update(projects)
      .set({
        title_en: translatedTitle.en,
        title_ar: translatedTitle.ar,
        desc_en: translatedDesc.en,
        desc_ar: translatedDesc.ar,
        slug: slug || translatedTitle.en.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
        content_en,
        content_ar,
        repoLink,
        liveLink,
        coverImage,
        images,
        categories,
        published,
      })
      .where(eq(projects.id, id));

    await revalidatePath("/dashboard/projects");
    logger.info("Project updated successfully");
    return { success: true, message: "Project updated successfully" };
  } catch (error) {
    logger.error("Project update failed:", error);
    return { success: false, message: "Project update failed" };
  }
}

// ✅ Delete project
export async function deleteProjectAction(id: string) {
  // Check admin authorization
  const authResult = await requireAdmin("You don't have privilege to delete a project.");
  if (!authResult.isAuthorized) {
    return authResult;
  }

  try {
    await db.delete(projects).where(eq(projects.id, id));
    await revalidatePath("/dashboard/projects");

    logger.info("Project deleted:", id);
    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    logger.error("Failed to delete project:", error);
    return { success: false, message: "Project deletion failed" };
  }
}

// ✅ Update project order
export async function updateProjectOrder(items: { id: string; displayOrder: number }[]) {
  // Check admin authorization
  const authResult = await requireAdmin();
  if (!authResult.isAuthorized) {
    return authResult;
  }

  try {
    await Promise.all(
      items.map((item) =>
        db
          .update(projects)
          .set({ displayOrder: item.displayOrder })
          .where(eq(projects.id, item.id))
      )
    );

    revalidatePath("/dashboard/projects");
    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    logger.error("Failed to update order:", error);
    return { success: false, message: "Failed to update order" };
  }
}
