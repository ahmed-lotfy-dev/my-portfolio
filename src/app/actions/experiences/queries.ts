
"use server";

import { db } from "@/src/db/index";
import { experiences } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getExperiences(publishedOnly = false) {
  if (publishedOnly) {
    return await db
      .select()
      .from(experiences)
      .where(eq(experiences.published, true))
      .orderBy(desc(experiences.displayOrder));
  }
  return await db.select().from(experiences).orderBy(desc(experiences.displayOrder));
}

export async function getExperienceById(id: string) {
  const result = await db.select().from(experiences).where(eq(experiences.id, id));
  return result[0];
}
