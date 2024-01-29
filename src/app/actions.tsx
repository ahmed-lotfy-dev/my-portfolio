"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src//app/lib/prisma";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import { ContactInputs, contactSchema } from "./lib/schemas/contactSchema";

import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  S3,
} from "@aws-sdk/client-s3";

import { ProjectSchema } from "./lib/schemas/projectSchema";
import { CertificateSchema } from "./lib/schemas/certificateSchema";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  },
});

export async function DeleteFromS3(imageLink: string | undefined) {
  if (!imageLink) {
    console.log("Image link is not defined please provide one");
    return;
  }

  const objectKey = imageLink.split("/").pop();

  if (!objectKey) {
    console.log("Object key not found in the image link");
    return;
  }

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "portfolio",
        Key: objectKey,
      })
    );
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image from S3:", error);
  }
}

export async function AddCertificateAction(state: any, data: FormData) {
  const certTitle = data.get("certTitle") as string;
  const certDesc = data.get("certDesc") as string;
  const courseLink = data.get("courseLink") as string;
  const certProfLink = data.get("certProfLink") as string;
  const certImageLink = data.get("certImageLink") as string;
  const emailAddress = data.get("emailAddress");

  if (emailAddress !== process.env.ADMIN_EMAIL)
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };

  const result = CertificateSchema.safeParse({
    certTitle,
    certDesc,
    courseLink,
    certProfLink,
    certImageLink,
  });
  if (result.success) {
    const certificate = await prisma.certificate.create({
      data: {
        certTitle,
        certDesc,
        courseLink,
        certProfLink,
        certImageLink,
      },
    });
    console.log("certificate added successfully");
    revalidatePath("/dashboard/certificates");
    return { success: true, message: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function EditCertificateAction(state: any, data: FormData) {
  const certId = data.get("id") as string;
  const certTitle = data.get("certTitle") as string;
  const certDesc = data.get("certDesc") as string;
  const courseLink = data.get("courseLink") as string;
  const certProfLink = data.get("certProfLink") as string;
  const emailAddress = data.get("emailAddress");

  const certImageLink = data.get("certImageLink") as string;

  if (emailAddress !== process.env.ADMIN_EMAIL)
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };

  const result = CertificateSchema.safeParse({
    certTitle,
    certDesc,
    courseLink,
    certProfLink,
    certImageLink,
  });
  if (result.success) {
    const oldCertificate = await prisma.certificate.findUnique({
      where: { id: certId },
    });
    if (oldCertificate?.certImageLink !== certImageLink) {
      console.log("New Image");
      DeleteFromS3(oldCertificate?.certImageLink);
    }
    const certificate = await prisma.certificate.update({
      where: { id: certId },
      data: {
        certTitle,
        certDesc,
        courseLink,
        certProfLink,
        certImageLink,
      },
    });
    console.log("certificate added successfully");
    revalidatePath("/dashboard/certificates");
    return { success: true, message: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function deleteCertificateAction(certId: string) {
  const deleteProjct = await prisma.certificate.delete({
    where: { id: certId },
  });
  console.log("projct deleted", certId);
  revalidatePath("/dashboard/certificates");
}

export async function AddProjectAction(state: any, data: FormData) {
  const projTitle = data.get("projTitle") as string;
  const projDesc = data.get("projDesc") as string;
  const projRepoLink = data.get("projRepoLink") as string;
  const projLiveLink = data.get("projLiveLink") as string;
  const projImageLink = data.get("projImageLink") as string;
  const tags = data.get("tags") as any;
  const emailAddress = data.get("emailAddress");

  //@ts-ignore
  if (emailAddress !== process.env.ADMIN_EMAIL)
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  const result = ProjectSchema.safeParse({
    projTitle,
    projDesc,
    projRepoLink,
    projLiveLink,
    projImageLink,
    tags,
  });
  if (result.success) {
    const project = await prisma.project.create({
      data: {
        projTitle,
        projDesc,
        projRepoLink,
        projLiveLink,
        projImageLink,
        tags,
      },
    });
    console.log("project added successfully");
    revalidatePath("/dashboard/projects");
    return { success: true, data: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function EditProjectAction(state: any, data: FormData) {
  const projId = data.get("id") as string;
  const projTitle = data.get("projTitle") as string;
  const projDesc = data.get("projDesc") as string;
  const projRepoLink = data.get("projRepoLink") as string;
  const projLiveLink = data.get("projLiveLink") as string;
  const projImageLink = data.get("projImageLink") as string;
  const tags = data.get("tags") as any;
  const emailAddress = data.get("emailAddress");

  if (emailAddress !== process.env.ADMIN_EMAIL)
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  const result = ProjectSchema.safeParse({
    projTitle,
    projDesc,
    projRepoLink,
    projLiveLink,
    projImageLink,
    tags,
  });
  if (result.success) {
    const oldProject = await prisma.project.findUnique({
      where: { id: projId },
    });
    if (oldProject?.projImageLink !== projImageLink) {
      console.log("New Image");
      DeleteFromS3(oldProject?.projImageLink);
    }
    const project = await prisma.project.update({
      where: { id: projId },
      data: {
        projTitle,
        projDesc,
        projRepoLink,
        projLiveLink,
        projImageLink,
        tags,
      },
    });
    console.log("project updated successfully");
    revalidatePath("/dashboard/projects");
    return { success: true, data: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function deleteProjectAction(projId: string) {
  const deleteProjct = await prisma.project.delete({ where: { id: projId } });
  console.log("projct deleted", projId);
  revalidatePath("/dashboard/projects");
}

export async function contactAction(state: any, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const result = contactSchema.safeParse({ name, email, subject, message });

  if (result.success) {
    const msg = {
      to: ["elshenawy19@gmail.com", "contact@ahmedlotfy.me"],
      from: "contact@ahmedlotfy.me",
      subject: subject as string,
      text: message as string,
      html: `<strong>This Email Is From: ${name},<br>
        His Email Is: ${email}<br>
        And This Is His Message :${message}</strong>`,
    };
    const sent = await sgMail.sendMultiple(msg);
    return { success: true, data: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}
