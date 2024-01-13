import { prisma } from "./prisma"

export default async function getAllCertificates() {
  try {
    const allCertificates = await prisma.certificate.findMany()
    return { allCertificates }
  } catch (error) {
    return { error }
  }
}
