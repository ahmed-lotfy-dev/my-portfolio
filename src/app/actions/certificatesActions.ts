"use server";

import { certificates } from "@/src/db/schema/certificates";
import { CertificateSchema } from "../lib/schemas/certificateSchema";
import { db } from "@/src/db";
import { revalidatePath } from "next/cache";
import { DeleteFromS3 } from "./deleteImageAction";
import { eq } from "drizzle-orm";

export async function getAllCertificates() {
  try {
    const allCertificates = await db.query.certificates.findMany();
    return { allCertificates };
  } catch (error) {
    return { error };
  }
}

export async function getSingleCertificate(certificateTitle: string) {
  try {
    const certificate = await db.query.certificates.findFirst({
      where: eq(certificates.certTitle, certificateTitle),
    });
    return { sucess: true, message: "Certificate Found", certificate };
  } catch (error) {
    return { success: false, message: "Certificate Not Found" };
  }
}

export async function addCertificateAction(state: any, data: FormData) {
  const certTitle = data.get("certTitle") as string;
  const certDesc = data.get("certDesc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;
  const certImageLink = data.get("certImageLink") as string;

  const user = await getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };
  }

  const result = CertificateSchema.safeParse({
    certTitle,
    certDesc,
    courseLink,
    profLink,
    certImageLink,
  });
  if (result.success) {
    const certificate = await db.insert(certificates).values({
      certTitle,
      certDesc,
      courseLink,
      profLink,
      certImageLink,
    });
    console.log("certificate added successfully");
    revalidatePath("/dashboard/certificates");
    return { success: true, message: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function editCertificateAction(state: any, data: FormData) {
  const certificateId = data.get("id") as unknown as number;
  const certTitle = data.get("certTitle") as string;
  const certDesc = data.get("certDesc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;
  const certImageLink = data.get("certImageLink") as string;

  const user = await getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };
  }

  const result = CertificateSchema.safeParse({
    certTitle,
    certDesc,
    courseLink,
    profLink,
    certImageLink,
  });

  if (result.success) {
    const oldCertificate = await db.query.certificates.findFirst({
      where: eq(certificates.id, certificateId),
    });
    if (oldCertificate?.certImageLink !== certImageLink) {
      console.log("New Image");
      DeleteFromS3(oldCertificate?.certImageLink);
    }

    const updatedCertificate = await db
      .update(certificates)
      .set({
        certTitle,
        certDesc,
        courseLink,
        profLink,
        certImageLink,
      })
      .where(eq(certificates.id, certificateId))
      .returning();

    console.log("certificate added successfully");
    revalidatePath("/dashboard/certificates");
    return {
      success: true,
      message: "Certificate Added Successfully",
      updatedCertificate,
    };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function deleteCertificateAction(certificateId: number) {
  const user = await getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Delete Project",
    };
  }
  const deletCertificate = await db
    .delete(certificates)
    .where(eq(certificates.id, certificateId))
    .returning();
  console.log("projct deleted", certificateId);
  revalidatePath("/dashboard/certificates");
  return { success: true, message: "Certificate Deleted Successfully" };
}
