
import { db } from "@/src/db";
import { projects } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { DeleteFromS3 } from "@/src/app/actions/media/mutations";
import { revalidatePath } from "next/cache";
import { logger } from "@/src/lib/utils/logger";

export async function deleteProjectImages(projectId: string, urls: string[]) {
  try {
    // 1. Delete from S3/R2
    await Promise.all(urls.map(url => DeleteFromS3(url)));

    // 2. Fetch current project state
    const project = await db.query.projects.findFirst({
      where: (p, { eq }) => eq(p.id, projectId),
    });

    if (!project) throw new Error("Project not found");

    const updatedImages = (project.images || []).filter(img => !urls.includes(img));
    
    // Handle cover image update if it was deleted
    let updatedCover = project.coverImage;
    if (urls.includes(project.coverImage || "")) {
      updatedCover = updatedImages.length > 0 ? updatedImages[0] : "";
    }

    // 3. Update Database
    await db.update(projects)
      .set({
        images: updatedImages,
        coverImage: updatedCover,
      })
      .where(eq(projects.id, projectId));

    // 4. Revalidate
    revalidatePath("/[locale]/dashboard/projects", "layout");
    revalidatePath("/[locale]/projects", "layout");
    if (project.slug) {
        revalidatePath(`/[locale]/projects/${project.slug}`, "page");
    }

    return { 
      success: true, 
      updatedImages,
      updatedCover
    };
  } catch (error) {
    logger.error("Media service delete failed:", error);
    throw error;
  }
}
