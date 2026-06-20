
"use server";

import { db } from "@/src/db/index";
import { experiences } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { logger } from "@/src/lib/utils/logger";

export async function getExperiences(publishedOnly = false) {
  try {
    if (publishedOnly) {
      return await db
        .select()
        .from(experiences)
        .where(eq(experiences.published, true))
        .orderBy(desc(experiences.displayOrder));
    }
    return await db.select().from(experiences).orderBy(desc(experiences.displayOrder));
  } catch (error: any) {
    if (error?.code === "ECONNREFUSED" || error?.cause?.code === "ECONNREFUSED") {
      logger.warn("Database connection refused (expected during build). Returning empty experiences list.");
      return [];
    }
    logger.error("Failed to fetch experiences:", error);
    return [];
  }
}

export async function getExperienceById(id: string) {
  const result = await db.select().from(experiences).where(eq(experiences.id, id));
  return result[0];
}
