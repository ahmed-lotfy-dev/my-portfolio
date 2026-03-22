
"use server";

import { db } from "@/src/db";

export async function getAllCertificates() {
  try {
    const allCertificates = await db.query.certificates.findMany({
      where: (c, { eq }) => eq(c.published, true),
    });
    return { allCertificates };
  } catch (error) {
    return { error };
  }
}

export async function getAllCertificatesForDashboard() {
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
