import { prisma } from "./prisma";

async function getAllCertificates() {
  try {
    const allCertificates = await prisma.certificate.findMany();
    return { allCertificates };
  } catch (error) {
    return { error };
  }
}

async function getSingleCertificate(certificateTitle: string) {
  try {
    const certificate = await prisma.certificate.findFirst({
      where: { title: certificateTitle },
    });
    console.log(certificate);
    return { sucess: true, message: "Certificate Found", certificate };
  } catch (error) {
    return { success: false, message: "Certificate Not Found" };
  }
}

export { getAllCertificates, getSingleCertificate };
