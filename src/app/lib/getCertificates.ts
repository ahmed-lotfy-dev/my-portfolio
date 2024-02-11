import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { certificates } from "@/src/db/schema/certificates";

async function getAllCertificates() {
  try {
    const allCertificates = await db.query.certificates.findMany();
    return { allCertificates };
  } catch (error) {
    return { error };
  }
}

async function getSingleCertificate(certificateTitle: string) {
  try {
    const certificate = await db.query.certificates.findFirst({
      where: eq(certificates.certTitle, certificateTitle),
    });
    return { sucess: true, message: "Certificate Found", certificate };
  } catch (error) {
    return { success: false, message: "Certificate Not Found" };
  }
}

export { getAllCertificates, getSingleCertificate };
