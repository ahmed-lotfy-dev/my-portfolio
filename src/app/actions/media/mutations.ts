
"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, getBucketName, extractKeyFromUrl } from "@/src/lib/utils/s3Client";
import { db } from "@/src/db";
import { projects } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function DeleteFromS3(imageLink: string | undefined) {
  if (!imageLink) return;
  const objectKey = extractKeyFromUrl(imageLink);
  if (!objectKey) return;

  try {
    await s3Client.send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: objectKey }));
  } catch (error) {
    console.error("Error deleting image from S3:", error);
  }
}

export async function deleteImageFromProject(url: string) {
  try {
    await DeleteFromS3(url);
    const project = await db.query.projects.findFirst({
      where: (p, { sql }) => sql`${projects.images} @> ARRAY[${url}]::text[]`
    });

    if (project) {
        const updatedImages = (project.images || []).filter(img => img !== url);
        let updatedCover = project.coverImage;
        if (project.coverImage === url) {
            updatedCover = updatedImages.length > 0 ? updatedImages[0] : "";
        }
        await db.update(projects).set({ images: updatedImages, coverImage: updatedCover }).where(eq(projects.id, project.id));
        revalidatePath("/[locale]/dashboard/projects", "layout");
        revalidatePath("/[locale]/projects", "layout");
    }
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Delete image error:", error);
    return { success: false, message: "Delete failed" };
  }
}
