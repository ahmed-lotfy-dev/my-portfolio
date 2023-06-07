import {prisma} from "./prismadb"

export async function getCertificates() {
  try {
    const certificates = await prisma.certificate.findMany()
    return { certificates }
  } catch (error) {
    return { error }
  }
}
