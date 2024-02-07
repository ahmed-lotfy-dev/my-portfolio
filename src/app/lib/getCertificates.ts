import { db } from "@/src/app/lib/db";

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
      with: { title: certificateTitle },
    });
    return { sucess: true, message: "Certificate Found", certificate };
  } catch (error) {
    return { success: false, message: "Certificate Not Found" };
  }
}

export { getAllCertificates, getSingleCertificate };
