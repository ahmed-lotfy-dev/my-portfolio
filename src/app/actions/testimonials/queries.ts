
"use server";

import { db } from "@/src/db";
import { testimonials } from "@/src/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getTestimonials(publishedOnly = false) {
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
}

export async function getTestimonialById(id: string) {
  const result = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);

  return result[0];
}
