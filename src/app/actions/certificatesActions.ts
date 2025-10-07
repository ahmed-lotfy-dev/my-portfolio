"use server"

import { CertificateSchema } from "../../lib/schemas/certificateSchema"
import { db } from "@/src/db"
import { revalidatePath } from "next/cache"
import { DeleteFromS3 } from "./deleteImageAction"
import { headers } from "next/headers"
import { auth } from "@/src/lib/auth"
import { certificates } from "@/src/db/schema"
import { eq } from "drizzle-orm"

export async function getAllCertificates() {
  try {
    const allCertificates = await db.query.certificates.findMany()
    return { allCertificates }
  } catch (error) {
    return { error }
  }
}

export async function getSingleCertificate(id: string) {
  try {
    const certificate = await db.query.certificates.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    return { sucess: true, message: "Certificate Found", certificate }
  } catch (error) {
    return { success: false, message: "Certificate Not Found" }
  }
}

export async function addCertificateAction(state: any, data: FormData) {
  const title = data.get("title") as string
  const desc = data.get("desc") as string
  const courseLink = data.get("courseLink") as string
  const profLink = data.get("profLink") as string
  const imageLink = data.get("imageLink") as string

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    }
  }

  const result = CertificateSchema.safeParse({
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
  })

  if (result.success) {
    await db.insert(certificates).values({
      title,
      desc,
      courseLink,
      profLink,
      imageLink,
    })

    console.log("certificate added successfully")
    revalidatePath("/dashboard/certificates")
    return { success: true, message: result.data }
  }

  if (result.error) {
    return { success: false, error: result.error.format() }
  }
}

export async function editCertificateAction(state: any, data: FormData) {
  const id = data.get("id") as string
  const title = data.get("title") as string
  const desc = data.get("desc") as string
  const courseLink = data.get("courseLink") as string
  const profLink = data.get("profLink") as string
  const imageLink = data.get("imageLink") as string

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Edit Certificate",
    }
  }

  const result = CertificateSchema.safeParse({
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
  })

  if (result.success) {
    const [oldCertificate] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, id))
      .limit(1)

    if (oldCertificate?.imageLink !== imageLink) {
      console.log("New Image")
      DeleteFromS3(oldCertificate?.imageLink)
    }

    await db
      .update(certificates)
      .set({ title, desc, courseLink, profLink, imageLink })
      .where(eq(certificates.id, id))

    console.log("certificate updated successfully")
    revalidatePath("/dashboard/certificates")
    return { success: true, message: "Certificate Updated Successfully" }
  }

  if (result.error) {
    return { success: false, error: result.error.format() }
  }
}

export async function deleteCertificateAction(certificateId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Delete Certificate",
    }
  }

  await db.delete(certificates).where(eq(certificates.id, certificateId))

  console.log("Certificate Deleted", certificateId)
  revalidatePath("/dashboard/certificates")
  return { success: true, message: "Certificate Deleted Successfully" }
}
