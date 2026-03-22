
"use server";

import { db } from "@/src/db";
import { posts, projects } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementViews(id: string, type: "blog" | "project") {
  try {
    if (type === "blog") {
      await db
        .update(posts)
        .set({
          views: sql`${posts.views} + 1`,
        })
        .where(eq(posts.slug, id));
    } else {
      await db
        .update(projects)
        .set({
          views: sql`${projects.views} + 1`,
        })
        .where(eq(projects.id, id));
    }
    return { success: true };
  } catch (error) {
    console.error(`Error incrementing ${type} views:`, error);
    return { success: false };
  }
}
