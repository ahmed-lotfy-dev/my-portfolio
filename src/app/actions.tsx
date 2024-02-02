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
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;
  const imageLink = data.get("imageLink") as string;
  const emailAddress = data.get("emailAddress");

  if (emailAddress !== process.env.ADMIN_EMAIL)
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };

  const result = CertificateSchema.safeParse({
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
  });
  if (result.success) {
    const certificate = await prisma.certificate.create({
      data: {
        title,
        desc,
        courseLink,
        profLink,
        imageLink,
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
  const id = data.get("id") as string;
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;
  const emailAddress = data.get("emailAddress");

  const imageLink = data.get("imageLink") as string;

  if (emailAddress !== process.env.ADMIN_EMAIL)
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };

  const result = CertificateSchema.safeParse({
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
  });
  if (result.success) {
    const oldCertificate = await prisma.certificate.findUnique({
      where: { id: id },
    });
    if (oldCertificate?.imageLink !== imageLink) {
      console.log("New Image");
      DeleteFromS3(oldCertificate?.imageLink);
    }
    const certificate = await prisma.certificate.update({
      where: { id: id },
      data: {
        title,
        desc,
        courseLink,
        profLink,
        imageLink,
      },
    });
    console.log("certificate added successfully");
    revalidatePath("/dashboard/certificates");
    return {
      success: true,
      message: "Certificate Added Successfully",
      certificate,
    };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function deleteCertificateAction(certificateId: string) {
  const deleteProjct = await prisma.certificate.delete({
    where: { id: certificateId },
  });
  console.log("projct deleted", certificateId);
  revalidatePath("/dashboard/certificates");
  return { success: true, message: "Certificate Deleted Successfully" };
}

export async function AddProjectAction(state: any, data: FormData) {
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const imageLink = data.get("imageLink") as string;
  const tags = data.get("tags") as any;
  const emailAddress = data.get("emailAddress");

  //@ts-ignore
  if (emailAddress !== process.env.ADMIN_EMAIL)
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  const result = ProjectSchema.safeParse({
    title,
    desc,
    repoLink,
    liveLink,
    imageLink,
    tags,
  });
  if (result.success) {
    const project = await prisma.project.create({
      data: {
        title,
        desc,
        repoLink,
        liveLink,
        imageLink,
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
  const id = data.get("id") as string;
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const imageLink = data.get("imageLink") as string;
  const tags = data.get("tags") as any;
  const emailAddress = data.get("emailAddress");

  if (emailAddress !== process.env.ADMIN_EMAIL)
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  const result = ProjectSchema.safeParse({
    title,
    desc,
    repoLink,
    liveLink,
    imageLink,
    tags,
  });
  if (result.success) {
    const oldProject = await prisma.project.findUnique({
      where: { id: id },
    });
    if (oldProject?.imageLink !== imageLink) {
      console.log("New Image");
      DeleteFromS3(oldProject?.imageLink);
    }
    const project = await prisma.project.update({
      where: { id: id },
      data: {
        title,
        desc,
        repoLink,
        liveLink,
        imageLink,
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

export async function deleteProjectAction(projectId: string) {
  const deleteProjct = await prisma.project.delete({
    where: { id: projectId },
  });
  console.log("projct deleted", projectId);
  revalidatePath("/dashboard/projects");
  return { success: true, message: "Project Deleted Successfully" };
}

export async function contactAction(state: any, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const result = contactSchema.safeParse({ name, email, subject, message });

  if (result.success) {
    const msg = {
      to: ["elshenawy19@gmail.com", "contact@ahmedlotfy.dev"],
      from: "contact@ahmedlotfy.dev",
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

export async function AddNewPost(state: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published");
  const userName = formData.get("name") as string;
  const userId = formData.get("userId") as string;
  const tags = formData.get("tags") as any;
  const isPublished = published === "true" ? true : false;

  console.log({ title, content, isPublished, userName, userId, tags });

  const newPost = await prisma.blogpost.create({
    data: {
      title,
      content,
      published: isPublished,
      author: { connect: { id: userId } },
      tags: [...tags.split(",")],
    },
  });
}
