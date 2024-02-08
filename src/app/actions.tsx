"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/src/db";

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
import { auth, signIn, signOut } from "@/src/auth";
import { certificates } from "@/src/db/schema/certificates";
import { posts } from "@/src/db/schema/posts";
import { projects } from "@/src/db/schema/projects";
import { eq } from "drizzle-orm";
import { postSchema } from "./lib/schemas/postSchema";
import { AuthError } from "next-auth";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  },
});

export async function SignInAction() {
  try {
    await signIn();
  } catch (error) {
    if (error instanceof AuthError)
      // Handle auth errors
      throw error; // Rethrow all other errors
  }
}

export async function SignOutAction(formData: FormData) {
  await signOut();
}

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

  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin") {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };
  }

  const result = CertificateSchema.safeParse({
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
  });

  if (result.success) {
    const certificate = await db.insert(certificates).values({
      title,
      desc,
      imageLink,
      courseLink,
      profLink,
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
  const certificateId = data.get("id") as unknown as number;
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;

  const imageLink = data.get("imageLink") as string;

  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin") {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };
  }

  const result = CertificateSchema.safeParse({
    title,
    desc,
    courseLink,
    profLink,
    imageLink,
  });
  if (result.success) {
    const oldCertificate = await db.query.certificates.findFirst({
      where: eq(certificates.id, certificateId),
    });
    const updatedCertificate = await db
      .update(certificates)
      .set({ title, desc, courseLink, profLink, imageLink });
    if (oldCertificate?.imageLink !== imageLink) {
      console.log("New Image");
      DeleteFromS3(oldCertificate?.imageLink);
    }

    console.log("certificate added successfully");
    revalidatePath("/dashboard/certificates");
    return {
      success: true,
      message: "Certificate Added Successfully",
      updatedCertificate,
    };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function deleteCertificateAction(certificateId: number) {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin") {
    return {
      success: false,
      message: "You Don't Have Privilige To Delete Project",
    };
  }
  const deletCertificate = await db
    .delete(certificates)
    .where(eq(certificates.id, certificateId))
    .returning();
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

  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin") {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  }

  const result = ProjectSchema.safeParse({
    title,
    desc,
    repoLink,
    liveLink,
    imageLink,
    tags,
  });

  if (result.success) {
    const project = await db.insert(projects).values({
      title,
      desc,
      repoLink,
      liveLink,
      imageLink,
      categories: tags,
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
  const projectId = data.get("id") as unknown as number;
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const imageLink = data.get("imageLink") as string;
  const tags = data.get("tags") as any;

  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin") {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  }

  const result = ProjectSchema.safeParse({
    title,
    desc,
    repoLink,
    liveLink,
    imageLink,
    tags,
  });
  if (result.success) {
    const oldProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (oldProject?.imageLink !== imageLink) {
      console.log("New Image");
      DeleteFromS3(oldProject?.imageLink);
    }
    const project = await db.insert(projects).values({
      title,
      desc,
      repoLink,
      liveLink,
      imageLink,
      categories: tags,
    });
    console.log("project updated successfully");
    revalidatePath("/dashboard/projects");
    return { success: true, data: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function deleteProjectAction(projectId: number) {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin") {
    return {
      success: false,
      message: "You Don't Have Privilige To Delete Project",
    };
  }
  const deleteProjct = await db
    .delete(certificates)
    .where(eq(certificates.id, projectId))
    .returning();
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

export async function AddNewPost(state: any, data: FormData) {
  const title = data.get("title") as string;
  const content = data.get("content") as string;
  const published = data.get("published");
  const tags = data.get("tags") as any;
  const isPublished = published === "true" ? true : false;
  const imageLink = data.get("imageLink") as string;
  const slug = title.split(" ").join("-");
  const categories = tags.split(",");

  const session = await auth();
  const user = session?.user;
  const id = user?.role;
  const role = user?.role;

  console.log({
    title,
    content,
    published,
    imageLink,
    tags,
    categories,
    role,
    id,
  });

  if (role !== "admin") {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Blog Post",
    };
  }
  console.log({ title, content, slug, isPublished, imageLink, categories });
  const result = postSchema.safeParse({
    title,
    content,
    slug,
    published: isPublished,
    imageLink,
    tags: categories,
  });

  if (result.success) {
    const newPost = await db.insert(posts).values({
      title,
      content,
      slug,
      published: isPublished,
      imageLink,
      categories: tags,
      authorId: Number(user?.id),
    });

    console.log("Post added successfully");
    revalidatePath("/blogs/");
    return { success: true, newPost };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}
