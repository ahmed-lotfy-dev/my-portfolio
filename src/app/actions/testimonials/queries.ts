
"use server";

import { db } from "@/src/db";
import { testimonials } from "@/src/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { logger } from "@/src/lib/utils/logger";

export async function getTestimonials(publishedOnly = false) {
  try {
    if (publishedOnly) {
      return db
        .select()
        .from(testimonials)
        .where(and(eq(testimonials.published, true)))
        .orderBy(desc(testimonials.displayOrder), desc(testimonials.createdAt));
    }

    return db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.displayOrder), desc(testimonials.createdAt));
  } catch (error: any) {
    if (error?.code === "ECONNREFUSED" || error?.cause?.code === "ECONNREFUSED") {
      logger.warn("Database connection refused. Returning empty testimonials list.");
      return [];
    }
    logger.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export async function getTestimonialById(id: string) {
  const result = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);

  return result[0];
}
