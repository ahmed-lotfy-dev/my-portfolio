"use server";

import { db } from "@/src/db/index";
import { experiences } from "@/src/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

async function checkAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!isAdmin) throw new Error("Unauthorized");
  return session;
}

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

export async function getExperienceById(id: string) {
  const result = await db.select().from(experiences).where(eq(experiences.id, id));
  return result[0];
}
