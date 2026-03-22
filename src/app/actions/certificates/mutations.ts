
"use server";

import { db } from "@/src/db";
import { revalidatePath } from "next/cache";
import { DeleteFromS3 } from "../media/mutations";
import { requireAdmin } from "@/src/lib/utils/authMiddleware";
import { getString, parseBoolean } from "@/src/lib/utils/formDataParser";
import { certificates } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/src/lib/utils/logger";
import { getCertificateSchema } from "@/src/lib/schemas/certificateSchema";

export async function addCertificateAction(state: any, data: FormData) {
  const authResult = await requireAdmin("You don't have privilege to add a certificate.");
  if (!authResult.isAuthorized) return authResult;

  const title = getString(data, "title");
  const desc = getString(data, "desc");
  const courseLink = getString(data, "courseLink");
  const profLink = getString(data, "profLink");
  const imageLink = getString(data, "imageLink");
  const completedAtStr = getString(data, "completedAt");
  const published = parseBoolean(data, "published", true);
  const completedAt = completedAtStr ? new Date(completedAtStr) : null;
  const locale = getString(data, "locale", "en");

  const schema = await getCertificateSchema(locale);
  const result = schema.safeParse({
    title, desc, courseLink, profLink, imageLink, completedAt: completedAtStr, published
  });

  if (!result.success) return { success: false, error: result.error.format() };

  try {
    await db.insert(certificates).values({
      title, desc, courseLink, profLink, imageLink, completedAt, published
    });
    revalidatePath("/dashboard/certificates");
    return { success: true, message: "Certificate added successfully" };
  } catch (error) {
    logger.error("Database insert failed:", error);
    return { success: false, message: "Database insert failed" };
  }
}

export async function editCertificateAction(state: any, data: FormData) {
  const authResult = await requireAdmin("You don't have privilege to edit a certificate.");
  if (!authResult.isAuthorized) return authResult;

  const id = getString(data, "id");
  const title = getString(data, "title");
  const desc = getString(data, "desc");
  const courseLink = getString(data, "courseLink");
  const profLink = getString(data, "profLink");
  const imageLink = getString(data, "imageLink");
  const completedAtStr = getString(data, "completedAt");
  const published = parseBoolean(data, "published", true);
  const completedAt = completedAtStr ? new Date(completedAtStr) : null;
  const locale = getString(data, "locale", "en");

  const schema = await getCertificateSchema(locale);
  const result = schema.safeParse({
    title, desc, courseLink, profLink, imageLink, completedAt: completedAtStr, published
  });

  if (!result.success) return { success: false, error: result.error.format() };

  const [oldCertificate] = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);

  if (oldCertificate?.imageLink !== imageLink) {
    DeleteFromS3(oldCertificate?.imageLink);
  }

  await db.update(certificates).set({ title, desc, courseLink, profLink, imageLink, completedAt, published }).where(eq(certificates.id, id));
  revalidatePath("/dashboard/certificates");
  return { success: true, message: "Certificate updated successfully" };
}

export async function deleteCertificateAction(certificateId: string) {
  const authResult = await requireAdmin("You don't have privilege to delete a certificate.");
  if (!authResult.isAuthorized) return authResult;

  await db.delete(certificates).where(eq(certificates.id, certificateId));
  revalidatePath("/dashboard/certificates");
  return { success: true, message: "Certificate deleted successfully" };
}
