
"use server";

import { db } from "@/src/db";
import { testimonials } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/utils/authMiddleware";

async function checkAdmin() {
  const authResult = await requireAdmin("Unauthorized");
  if (!authResult.isAuthorized) throw new Error(authResult.message);
  return authResult.user;
}

function sanitizeDisplayOrder(displayOrder?: number) {
  if (typeof displayOrder !== "number" || Number.isNaN(displayOrder)) return 0;
  return Math.max(0, Math.floor(displayOrder));
}

export async function createTestimonial(data: {
  name: string;
  role: string;
  quote_en: string;
  quote_ar: string;
  displayOrder?: number;
  published?: boolean;
}) {
  await checkAdmin();

  const [created] = await db
    .insert(testimonials)
    .values({
      name: data.name,
      role: data.role,
      quote_en: data.quote_en,
      quote_ar: data.quote_ar,
      displayOrder: sanitizeDisplayOrder(data.displayOrder),
      published: data.published ?? true,
    })
    .returning();

  revalidatePath("/[locale]/dashboard/testimonials", "layout");
  revalidatePath("/[locale]", "layout");
  return created;
}

export async function updateTestimonial(
  id: string,
  data: {
    name: string;
    role: string;
    quote_en: string;
    quote_ar: string;
    displayOrder?: number;
    published?: boolean;
  }
) {
  await checkAdmin();

  const [updated] = await db
    .update(testimonials)
    .set({
      name: data.name,
      role: data.role,
      quote_en: data.quote_en,
      quote_ar: data.quote_ar,
      displayOrder: sanitizeDisplayOrder(data.displayOrder),
      published: data.published ?? true,
    })
    .where(eq(testimonials.id, id))
    .returning();

  revalidatePath("/[locale]/dashboard/testimonials", "layout");
  revalidatePath("/[locale]", "layout");
  return updated;
}

export async function deleteTestimonial(id: string) {
  await checkAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, id));

  revalidatePath("/[locale]/dashboard/testimonials", "layout");
  revalidatePath("/[locale]", "layout");
}
