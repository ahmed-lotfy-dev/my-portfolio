
"use server";

import { db } from "@/src/db";
import { revalidatePath } from "next/cache";
import { DeleteFromS3 } from "../media/mutations";
import { getProjectSchema } from "@/src/lib/schemas/projectSchema";
import { requireAdmin } from "@/src/lib/utils/authMiddleware";
import { translateBidirectional } from "@/src/lib/utils/translationHelper";
import { parseImageArray, parseCategories, parseBoolean, getString } from "@/src/lib/utils/formDataParser";
import { projects } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import { logger } from "@/src/lib/utils/logger";
import { deleteProjectImages } from "@/src/lib/services/projects/media";

export async function addProjectAction(state: any, data: FormData) {
  const authResult = await requireAdmin("You don't have privilege to add a project.");
  if (!authResult.isAuthorized) return authResult;

  const fields = {
    title_en: getString(data, "title_en"),
    title_ar: getString(data, "title_ar"),
    desc_en: getString(data, "desc_en"),
    desc_ar: getString(data, "desc_ar"),
    repoLink: getString(data, "repoLink"),
    liveLink: getString(data, "liveLink"),
    coverImage: getString(data, "coverImage"),
    categories: parseCategories(data),
    images: parseImageArray(data),
    published: parseBoolean(data, "published", true),
    slug: getString(data, "slug"),
    content_en: getString(data, "content_en"),
    content_ar: getString(data, "content_ar"),
    embedUrl: getString(data, "embedUrl"),
    featureVideo: getString(data, "featureVideo"),
  };

  const schema = await getProjectSchema("en");
  const result = schema.safeParse(fields);

  if (!result.success) return { success: false, error: result.error.format() };

  try {
    const translatedTitle = await translateBidirectional({ en: fields.title_en, ar: fields.title_ar }, "Title");
    const translatedDesc = await translateBidirectional({ en: fields.desc_en, ar: fields.desc_ar }, "Description");
    
    const [orderInfo] = await db.select({ max: projects.displayOrder })
      .from(projects).orderBy(desc(projects.displayOrder)).limit(1);

    await db.insert(projects).values({
      ...fields,
      title_en: translatedTitle.en,
      title_ar: translatedTitle.ar,
      desc_en: translatedDesc.en,
      desc_ar: translatedDesc.ar,
      slug: fields.slug || translatedTitle.en.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      displayOrder: (orderInfo?.max ?? -1) + 1,
    });

    revalidatePath("/[locale]/dashboard/projects", "layout");
    revalidatePath("/[locale]/projects", "layout");
    return { success: true, message: "Project added successfully" };
  } catch (error) {
    logger.error("Database insert failed:", error);
    return { success: false, message: "Database insert failed" };
  }
}

export async function editProjectAction(state: any, data: FormData) {
  const authResult = await requireAdmin("You don't have privilege to edit a project.");
  if (!authResult.isAuthorized) return authResult;

  const id = getString(data, "id");
  const fields = {
    title_en: getString(data, "title_en"),
    title_ar: getString(data, "title_ar"),
    desc_en: getString(data, "desc_en"),
    desc_ar: getString(data, "desc_ar"),
    repoLink: getString(data, "repoLink"),
    liveLink: getString(data, "liveLink"),
    coverImage: getString(data, "coverImage"),
    categories: parseCategories(data),
    images: parseImageArray(data),
    published: parseBoolean(data, "published", true),
    slug: getString(data, "slug"),
    content_en: getString(data, "content_en"),
    content_ar: getString(data, "content_ar"),
    embedUrl: getString(data, "embedUrl"),
    featureVideo: getString(data, "featureVideo"),
  };

  const schema = await getProjectSchema("en");
  const result = schema.safeParse(fields);

  if (!result.success) return { success: false, error: result.error.format() };

  try {
    const oldProject = await db.query.projects.findFirst({ where: (p, { eq }) => eq(p.id, id) });
    const isOldImageKept = fields.images.includes(oldProject?.coverImage || "");

    if (oldProject?.coverImage && oldProject.coverImage !== fields.coverImage && !isOldImageKept) {
      await DeleteFromS3(oldProject.coverImage);
    }

    const translatedTitle = await translateBidirectional({ en: fields.title_en, ar: fields.title_ar }, "Title");
    const translatedDesc = await translateBidirectional({ en: fields.desc_en, ar: fields.desc_ar }, "Description");

    await db.update(projects).set({
      ...fields,
      title_en: translatedTitle.en,
      title_ar: translatedTitle.ar,
      desc_en: translatedDesc.en,
      desc_ar: translatedDesc.ar,
      slug: fields.slug || translatedTitle.en.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
    }).where(eq(projects.id, id));

    revalidatePath("/[locale]/dashboard/projects", "layout");
    revalidatePath("/[locale]/projects", "layout");
    return { success: true, message: "Project updated successfully" };
  } catch (error) {
    logger.error("Project update failed:", error);
    return { success: false, message: "Project update failed" };
  }
}

export async function deleteProjectAction(id: string) {
  const authResult = await requireAdmin("You don't have privilege to delete a project.");
  if (!authResult.isAuthorized) return authResult;

  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/[locale]/dashboard/projects", "layout");
    revalidatePath("/[locale]/projects", "layout");
    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    logger.error("Failed to delete project:", error);
    return { success: false, message: "Project deletion failed" };
  }
}

export async function updateProjectOrder(items: { id: string; displayOrder: number }[]) {
  const authResult = await requireAdmin();
  if (!authResult.isAuthorized) return authResult;

  try {
    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(projects).set({ displayOrder: item.displayOrder }).where(eq(projects.id, item.id));
      }
    });

    revalidatePath("/[locale]/dashboard/projects", "layout");
    revalidatePath("/[locale]/projects", "layout");
    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    logger.error("Failed to update order:", error);
    return { success: false, message: "Failed to update order in database" };
  }
}

export async function deleteImagesFromProjectAction(projectId: string, urlsToDelete: string[]) {
  const authResult = await requireAdmin("You don't have privilege to edit a project.");
  if (!authResult.isAuthorized) return authResult;

  try {
    const result = await deleteProjectImages(projectId, urlsToDelete);
    return { 
      ...result,
      message: urlsToDelete.length > 1 ? "All images deleted successfully" : "Image deleted successfully",
    };
  } catch (error) {
    logger.error("Failed to delete images from project:", error);
    return { success: false, message: "Failed to delete images from database" };
  }
}
