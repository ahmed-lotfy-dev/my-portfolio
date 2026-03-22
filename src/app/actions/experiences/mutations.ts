
"use server";

import { db } from "@/src/db/index";
import { experiences } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/utils/authMiddleware";

async function checkAdmin() {
  const authResult = await requireAdmin("Unauthorized");
  if (!authResult.isAuthorized) throw new Error(authResult.message);
  return authResult.user;
}

export async function createExperience(data: any) {
  await checkAdmin();
  const result = await db.insert(experiences).values(data).returning();
  revalidatePath("/[locale]/dashboard/experiences", "layout");
  revalidatePath("/[locale]", "layout");
  return result[0];
}

export async function updateExperience(id: string, data: any) {
  await checkAdmin();
  const result = await db
    .update(experiences)
    .set(data)
    .where(eq(experiences.id, id))
    .returning();
  revalidatePath("/[locale]/dashboard/experiences", "layout");
  revalidatePath("/[locale]", "layout");
  return result[0];
}

export async function deleteExperience(id: string) {
  await checkAdmin();
  await db.delete(experiences).where(eq(experiences.id, id));
  revalidatePath("/[locale]/dashboard/experiences", "layout");
  revalidatePath("/[locale]", "layout");
}
