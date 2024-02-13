"use server ";

import { posts } from "@/src/db/schema/posts";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { postSchema } from "../lib/schemas/postSchema";
import { revalidatePath } from "next/cache";

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


export async function addNewPost(state: any, data: FormData) {
  const postTitle = data.get("title") as string;
  const postContent = data.get("content") as string;
  const published = data.get("published");
  const tags = data.get("tags") as any;
  const isPublished = published === "true" ? true : false;
  const postImageLink = data.get("imageLink") as string;
  const slug = postTitle.split(" ").join("-");
  const categories = data.get("tags") as any;
  const postsCategories = [categories.slice(",")];

  const user = await getUser();

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
