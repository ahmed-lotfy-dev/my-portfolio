"use server";

import { db } from "@/src/db";
import { revalidatePath } from "next/cache";
import { DeleteFromS3 } from "./deleteImageAction";
import { getProjectSchema } from "../../lib/schemas/projectSchema";
import { headers } from "next/headers";
import { translateText } from "@/src/lib/utils/translate";
import { auth } from "@/src/lib/auth";
import { projects } from "@/src/db/schema";
import { desc, asc, eq } from "drizzle-orm";
import { logger } from "@/src/lib/utils/logger";

// ✅ Fetch all projects
export async function getAllProjects() {
  try {
    const allProjects = await db.query.projects.findMany({
      orderBy: [asc(projects.createdAt)],
    });
    return { allProjects };
  } catch (error) {
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

// ✅ Add new project
export async function addProjectAction(state: any, data: FormData) {
  const title_en = data.get("title_en") as string;
  const title_ar = data.get("title_ar") as string;
  const desc_en = data.get("desc_en") as string;
  const desc_ar = data.get("desc_ar") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const imageLink = data.get("imageLink") as string;
  const categoriesString = data.get("categories") as string;
  const categories =
    categoriesString?.split(",").map((tag) => tag.trim()) || [];
  const published = data.get("published") === "true";

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to add a project.",
    };
  }

  const schema = await getProjectSchema();
  const result = schema.safeParse({
    title_en,
    title_ar,
    desc_en,
    desc_ar,
    repoLink,
    liveLink,
    imageLink,
    categories,
  });

  if (!result.success) {
    logger.error("Validation failed:", result.error.format());
    return { success: false, error: result.error.format() };
  }

  try {
    logger.debug("Original EN Title:", title_en);
    logger.debug("Original AR Title:", title_ar);
    logger.debug("Original EN Desc:", desc_en);
    logger.debug("Original AR Desc:", desc_ar);

    // Bidirectional translation for title
    let finalTitleEn = title_en;
    let finalTitleAr = title_ar;

    if (!title_ar && title_en) {
      // Translate EN → AR
      finalTitleAr = await translateText(title_en, "ar");
      logger.debug("Translated Title (EN→AR):", finalTitleAr);
    } else if (!title_en && title_ar) {
      // Translate AR → EN
      finalTitleEn = await translateText(title_ar, "en");
      logger.debug("Translated Title (AR→EN):", finalTitleEn);
    }

    // Bidirectional translation for description
    let finalDescEn = desc_en;
    let finalDescAr = desc_ar;

    if (!desc_ar && desc_en) {
      // Translate EN → AR
      finalDescAr = await translateText(desc_en, "ar");
      logger.debug("Translated Desc (EN→AR):", finalDescAr);
    } else if (!desc_en && desc_ar) {
      // Translate AR → EN
      finalDescEn = await translateText(desc_ar, "en");
      logger.debug("Translated Desc (AR→EN):", finalDescEn);
    }

    await db.insert(projects).values({
      title_en: finalTitleEn,
      title_ar: finalTitleAr,
      desc_en: finalDescEn,
      desc_ar: finalDescAr,
      repoLink,
      liveLink,
      imageLink,
      categories,
      published,
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
  const id = data.get("id") as string;
  const title_en = data.get("title_en") as string;
  const title_ar = data.get("title_ar") as string;
  const desc_en = data.get("desc_en") as string;
  const desc_ar = data.get("desc_ar") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const imageLink = data.get("imageLink") as string;
  const categoriesString = data.get("categories") as string;
  const categories =
    categoriesString?.split(",").map((tag) => tag.trim()) || [];
  const published = data.get("published") === "true";

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to edit a project.",
    };
  }

  const schema = await getProjectSchema();
  const result = schema.safeParse({
    title_en,
    title_ar,
    desc_en,
    desc_ar,
    repoLink,
    liveLink,
    imageLink,
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

    if (oldProject?.imageLink && oldProject.imageLink !== imageLink) {
      logger.info("New image detected — deleting old one");
      await DeleteFromS3(oldProject.imageLink);
    }

    logger.debug("Original EN Title:", title_en);
    logger.debug("Original AR Title:", title_ar);
    logger.debug("Original EN Desc:", desc_en);
    logger.debug("Original AR Desc:", desc_ar);

    // Bidirectional translation for title
    let finalTitleEn = title_en;
    let finalTitleAr = title_ar;

    if (!title_ar && title_en) {
      // Translate EN → AR
      finalTitleAr = await translateText(title_en, "ar");
      logger.debug("Translated Title (EN→AR):", finalTitleAr);
    } else if (!title_en && title_ar) {
      // Translate AR → EN
      finalTitleEn = await translateText(title_ar, "en");
      logger.debug("Translated Title (AR→EN):", finalTitleEn);
    }

    // Bidirectional translation for description
    let finalDescEn = desc_en;
    let finalDescAr = desc_ar;

    if (!desc_ar && desc_en) {
      // Translate EN → AR
      finalDescAr = await translateText(desc_en, "ar");
      logger.debug("Translated Desc (EN→AR):", finalDescAr);
    } else if (!desc_en && desc_ar) {
      // Translate AR → EN
      finalDescEn = await translateText(desc_ar, "en");
      logger.debug("Translated Desc (AR→EN):", finalDescEn);
    }

    await db
      .update(projects)
      .set({
        title_en: finalTitleEn,
        title_ar: finalTitleAr,
        desc_en: finalDescEn,
        desc_ar: finalDescAr,
        repoLink,
        liveLink,
        imageLink,
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
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to delete a project.",
    };
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
