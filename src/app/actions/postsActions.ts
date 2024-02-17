"use server ";

import { posts } from "@/src/db/schema/posts";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { postSchema } from "@/src/app/lib/schemas/postSchema";
import { auth } from "@/auth";

export async function getAllPosts() {
  try {
    const allPosts = await db.query.posts.findMany();
    return { allPosts };
  } catch (error) {
    return { error };
  }
}

export async function getSinglePosts(postTitle: string) {
  const singlePost = await db.query.posts.findFirst({
    where: eq(posts.postTitle, postTitle),
  });

  return { success: true, message: "Single Blog Post Found", singlePost };
}

export async function addNewPost(formData: FormData) {
  const postTitle = formData.get("postTitle") as string;
  const postContent = formData.get("postContent") as string;
  const published = formData.get("published") as string;
  const categories = formData.get("categories") as string;
  const postImageLink = formData.get("postImageLink") as string;
  const postsCategories = categories?.split(",");
  const isPublished = Boolean(published);
  const slug = postTitle.replace(" ", "-");
  const image = formData.get("file");
  console.log(image);
  
  const session = await auth();
  const user = session?.user;
  if (user?.role !== "admin") {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    };
  }
  const result = postSchema.safeParse({
    postTitle,
    postContent,
    slug,
    postsCategories,
    published: isPublished,
    postImageLink,
  });
  console.log(result);
  if (result.success) {
    const post = await db.insert(posts).values({
      postTitle,
      postContent,
      slug,
      postsCategories,
      published: isPublished,
      postImageLink,
    });
    console.log("certificate added successfully");
    return { success: true, message: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function updateSinglePosts(post: any) {
  const updatedPost = await db.update(posts).set({ ...post });

  return {
    success: true,
    message: "Blog Post Updated Successfully",
    updatedPost,
  };
}

export async function deleteSinglePosts(id: number) {
  const deletPost = await db.delete(posts).where(eq(posts.id, id)).returning();
  return {
    success: true,
    message: "Blog Post Deleted Successfully",
  };
}
