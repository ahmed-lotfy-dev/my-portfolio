"use server";

import { createCertificateSchema } from "../../lib/schemas/certificateSchema";
import { db } from "@/src/db";
import { revalidatePath } from "next/cache";
import { DeleteFromS3 } from "./deleteImageAction";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { certificates } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/src/lib/utils/logger";

export async function getAllCertificates() {
  try {
    const allCertificates = await db.query.certificates.findMany();
    return { allCertificates };
  } catch (error) {
    return { error };
  }
}

export async function getSingleCertificate(id: string) {
  try {
    const certificate = await db.query.certificates.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    });
    return { success: true, message: "Certificate Found", certificate };
  } catch (error) {
    return { success: false, message: "Certificate Not Found" };
  }
}

export async function addCertificateAction(state: any, data: FormData) {
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;
  const imageLink = data.get("imageLink") as string;
  const completedAtStr = data.get("completedAt") as string;

  // Convert completedAt string to Date object if provided
  const completedAt = completedAtStr ? new Date(completedAtStr) : null;

  logger.debug("Received form data:", {
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
    completedAt,
  });

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  logger.debug("Session user:", user);

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to add a certificate.",
    };
  }

  const schema = await createCertificateSchema();
  const result = schema.safeParse({
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
    completedAt: completedAtStr,
  });

  if (!result.success) {
    logger.error("Validation failed:", result.error.format());
    return { success: false, error: result.error.format() };
  }

  try {
    await db.insert(certificates).values({
      title,
      desc,
      courseLink,
      profLink,
      imageLink,
      completedAt,
    });

    logger.info("Certificate added successfully");
    await revalidatePath("/dashboard/certificates");

    return { success: true, message: "Certificate added successfully" };
  } catch (error) {
    logger.error("Database insert failed:", error);
    return { success: false, message: "Database insert failed" };
  }
}

export async function editCertificateAction(state: any, data: FormData) {
  const id = data.get("id") as string;
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;
  const imageLink = data.get("imageLink") as string;
  const completedAtStr = data.get("completedAt") as string;

  // Convert completedAt string to Date object if provided
  const completedAt = completedAtStr ? new Date(completedAtStr) : null;

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to edit a certificate.",
    };
  }

  const schema = await createCertificateSchema();
  const result = schema.safeParse({
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
    completedAt: completedAtStr,
  });

  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  const [oldCertificate] = await db
    .select()
    .from(certificates)
    .where(eq(certificates.id, id))
    .limit(1);

  if (oldCertificate?.imageLink !== imageLink) {
    logger.info("New Image Detected — deleting old one");
    DeleteFromS3(oldCertificate?.imageLink);
  }

  await db
    .update(certificates)
    .set({ title, desc, courseLink, profLink, imageLink, completedAt })
    .where(eq(certificates.id, id));

  await revalidatePath("/dashboard/certificates");
  logger.info("Certificate updated successfully");
  return { success: true, message: "Certificate updated successfully" };
}

export async function deleteCertificateAction(certificateId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You don't have privilege to delete a certificate.",
    };
  }

  await db.delete(certificates).where(eq(certificates.id, certificateId));
  await revalidatePath("/dashboard/certificates");

  logger.info("Certificate deleted:", certificateId);
  return { success: true, message: "Certificate deleted successfully" };
}
