"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/src/db";
import { unstable_noStore as noStore } from "next/cache";

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
import { certificates } from "@/src/db/schema/certificates";
import { posts } from "@/src/db/schema/posts";
import { projects } from "@/src/db/schema/projects";
import { eq } from "drizzle-orm";
import { postSchema } from "./lib/schemas/postSchema";
import { auth } from "@/src/auth";
import { signIn, signOut } from "@/src/auth";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  },
});

export async function SignInAction(data: FormData) {
  const provider = data.get("provider") as string;
  await signIn(provider);
}

export async function SignOutAction() {
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
  const certTitle = data.get("certTitle") as string;
  const certDesc = data.get("certDesc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;
  const certImageLink = data.get("certImageLink") as string;

  const session = await auth();
  const user = session?.user;
  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };
  }

  const result = CertificateSchema.safeParse({
    certTitle,
    certDesc,
    courseLink,
    profLink,
    certImageLink,
  });
  console.log(result);
  if (result.success) {
    console.log({ certTitle, certDesc, courseLink, profLink, certImageLink });
    const certificate = await db.insert(certificates).values({
      certTitle,
      certDesc,
      courseLink,
      profLink,
      certImageLink,
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
  const certTitle = data.get("certTitle") as string;
  const certDesc = data.get("certDesc") as string;
  const courseLink = data.get("courseLink") as string;
  const profLink = data.get("profLink") as string;
  const certImageLink = data.get("certImageLink") as string;

  console.log("from server", { certImageLink });
  const session = await auth();
  const user = session?.user;

  console.log({
    certificateId,
    certTitle,
    certDesc,
    courseLink,
    profLink,
    certImageLink,
  });

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };
  }

  const result = CertificateSchema.safeParse({
    certTitle,
    certDesc,
    courseLink,
    profLink,
    certImageLink,
  });

  console.log(result);
  if (result.success) {
    const oldCertificate = await db.query.certificates.findFirst({
      where: eq(certificates.id, certificateId),
    });
    console.log({ oldCertificate });
    if (oldCertificate?.certImageLink !== certImageLink) {
      console.log("New Image");
      DeleteFromS3(oldCertificate?.certImageLink);
    }

    const updatedCertificate = await db
      .update(certificates)
      .set({
        certTitle,
        certDesc,
        courseLink,
        profLink,
        certImageLink,
      })
      .where(eq(certificates.id, certificateId))
      .returning();

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
  const user = session?.user;

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Delete Project",
    };
  }
  console.log(certificateId);
  const deletCertificate = await db
    .delete(certificates)
    .where(eq(certificates.id, certificateId))
    .returning();
  console.log("projct deleted", certificateId);
  revalidatePath("/dashboard/certificates");
  return { success: true, message: "Certificate Deleted Successfully" };
}

export async function AddProjectAction(state: any, data: FormData) {
  const projTitle = data.get("title") as string;
  const projDesc = data.get("desc") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const projImageLink = data.get("imageLink") as string;
  const categories = data.get("tags") as any;
  const projCategories = [categories.slice(",")];

  const session = await auth();
  const user = session?.user;

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  }

  const result = ProjectSchema.safeParse({
    projTitle,
    projDesc,
    repoLink,
    liveLink,
    projImageLink,
    projCategories,
  });
  if (result.success) {
    console.log({
      projTitle,
      projDesc,
      repoLink,
      liveLink,
      projImageLink,
      projCategories,
    });
    const project = await db
      .insert(projects)
      .values({
        projTitle,
        projDesc,
        repoLink,
        liveLink,
        projImageLink,
        projCategories,
      })
      .returning();

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
  const projTitle = data.get("projTitle") as string;
  const projDesc = data.get("projDesc") as string;
  const repoLink = data.get("repoLink") as string;
  const liveLink = data.get("liveLink") as string;
  const projImageLink = data.get("projImageLink") as string;
  const categories = data.get("tags") as any;
  const projCategories = [categories.slice(",")];

  const session = await auth();
  const user = session?.user;

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Project",
    };
  }

  const result = ProjectSchema.safeParse({
    projTitle,
    projDesc,
    repoLink,
    liveLink,
    projImageLink,
    projCategories,
  });
  console.log(result);
  if (result.success) {
    const oldProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (oldProject?.projImageLink !== projImageLink) {
      console.log("New Image");
      DeleteFromS3(oldProject?.projImageLink);
    }

    const project = await db
      .update(projects)
      .set({
        projTitle,
        projDesc,
        repoLink,
        liveLink,
        projImageLink,
        projCategories,
      })
      .where(eq(projects.id, projectId))
      .returning();
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
  const user = session?.user;

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Delete Project",
    };
  }
  const deleteProjct = await db
    .delete(projects)
    .where(eq(projects.id, projectId))
    .returning();
  console.log("projct deleted", projectId);
  revalidatePath("/dashboard/projects");
  console.log(deleteProjct);
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
  const postTitle = data.get("title") as string;
  const postContent = data.get("content") as string;
  const published = data.get("published");
  const tags = data.get("tags") as any;
  const isPublished = published === "true" ? true : false;
  const postImageLink = data.get("imageLink") as string;
  const slug = postTitle.split(" ").join("-");
  const categories = data.get("tags") as any;
  const postsCategories = [categories.slice(",")];

  const session = await auth();
  const user = session?.user;

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Blog Post",
    };
  }

  const result = postSchema.safeParse({
    postTitle,
    postContent,
    slug,
    published: isPublished,
    postImageLink,
    postsCategories,
  });
  if (result.success) {
    console.log({
      postTitle,
      postContent,
      isPublished,
      slug,
      postImageLink,
      postsCategories,
    });
    const newPost = await db
      .insert(posts)
      .values({
        postTitle,
        postContent,
        slug,
        published: isPublished,
        postImageLink,
        postsCategories,
      })
      .returning();

    console.log("Post added successfully");
    revalidatePath("/blogs/");
    return { success: true, newPost };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}
