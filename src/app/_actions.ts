"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "./lib/prismadb"
import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
export async function AddCertificateAction(data: FormData) {
  const certTitle = data.get("certTitle") as string
  const certDesc = data.get("certDesc") as string
  const courseLink = data.get("courseLink") as string
  const certProfLink = data.get("certProfLink") as string
  const certImageLink = data.get("certImageLink") as string

  //@ts-ignore
  if (!certImageLink) return
  const certificate = await prisma.certificate.create({
    data: { certTitle, certDesc, courseLink, certProfLink, certImageLink },
  })
  console.log("certificate added successfully")
  revalidatePath("/dashboard/add-certificate")
}

export async function AddProjectAction(data: FormData) {
  const projectTitle = data.get("projectTitle") as string
  const projectDesc = data.get("projectDesc") as string
  const projectRepoLink = data.get("projectRepoLink") as string
  const projectLiveLink = data.get("projectLiveLink") as string
  const projectImageLink = data.get("projectImageLink") as string
  const tags = data.get("tags")
  console.log(tags)

  // if (!projectImageLink) return
  const project = await prisma.project.create({
    data: {
      projectTitle,
      projectDesc,
      projectRepoLink,
      projectLiveLink,
      projectImageLink,
    },
  })
  console.log("project added successfully")
  revalidatePath("/dashboard/add-project")
}

type Message = {
  to: string[]
  from: string
  subject: FormDataEntryValue | null
  text: FormDataEntryValue | null
  html: string
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
