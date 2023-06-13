"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/src//app/lib/prisma"
import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { authOptions } from "./lib/auth"
import { getServerSession } from "next-auth/next"
import { Project } from "@prisma/client"

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  },
})

function sliceStringByQuestionX(str: string) {
  var slicedArray = str.split("?X")
  return slicedArray[0]
}

export async function UploadToS3(imageFile: File) {
  const imageBuffer = await imageFile.arrayBuffer()
  const imageContent = new Uint8Array(imageBuffer)
  const imageType = imageFile?.type
  const uploadImage = await S3.send(
    new PutObjectCommand({
      Bucket: "portfolio",
      //@ts-ignore
      Key: imageFile?.name,
      Body: imageContent,
      ContentType: imageType,
      ACL: "public-read", // Add this line to set the ACL
    })
  )
  return uploadImage
}

export async function AddCertificateAction(data: FormData) {
  const certTitle = data.get("certTitle") as string
  const certDesc = data.get("certDesc") as string
  const courseLink = data.get("courseLink") as string
  const certProfLink = data.get("certProfLink") as string
  const emailAddress = data.get("emailAddress")

  const certImageFile = data.get("certImageLink") as File

  const uploadedImage = UploadToS3(certImageFile)
  console.log(uploadedImage)

  if (emailAddress !== process.env.ADMIN_EMAIL) return

  const certificate = await prisma.certificate.create({
    data: {
      certTitle,
      certDesc,
      courseLink,
      certProfLink,
      certImageLink: `${process.env.CF_IMAGES_SUBDOMAIN}/${certImageFile?.name}`,
    },
  })

  console.log("certificate added successfully")
  revalidatePath("/dashboard/certificates")
}

export async function AddProjectAction(data: FormData) {
  const projTitle = data.get("projTitle") as string
  const projDesc = data.get("projDesc") as string
  const projRepoLink = data.get("projRepoLink") as string
  const projLiveLink = data.get("projLiveLink") as string
  const tags = data.get("tags") as any
  const emailAddress = data.get("emailAddress")

  const projImageFile = data.get("projImageLink") as File

  const uploadedImage = UploadToS3(projImageFile)

  //@ts-ignore
  if (emailAddress !== process.env.ADMIN_EMAIL) return

  const project = await prisma.project.create({
    data: {
      projTitle,
      projDesc,
      projRepoLink,
      projLiveLink,
      projImageLink: `${process.env.CF_IMAGES_SUBDOMAIN}/${projImageFile?.name}`,
      tags,
    },
  })
  console.log("project added successfully")
  revalidatePath("/dashboard/projects")
}

export async function contactAction(data: FormData) {
  const name = data.get("name") as string
  const email = data.get("email") as string
  const subject = data.get("subject") as string
  const message = data.get("message") as string
  try {
    const msg = {
      to: ["elshenawy19@gmail.com", "contact@ahmedlotfy.me"], // Change to your recipient
      from: "contact@ahmedlotfy.me", // Change to your verified sender
      subject: subject,
      text: message,
      html: `<strong>This Email Is From: ${name},<br>
      His Email Is: ${email}<br>
      And This Is His Message :${message}</strong>`,
    }
    const sent = await sgMail.sendMultiple(msg)
    console.log(sent)
    console.log("Email has been sent successfully")
  } catch (err: any) {
    console.log("Email Cannot Be Sent")
  }
}
