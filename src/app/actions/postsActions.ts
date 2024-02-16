"use server ";

import { posts } from "@/src/db/schema/posts";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { postSchema } from "@/src/app/lib/schemas/postSchema";
import { revalidatePath } from "next/cache";
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
  // const postTitle = data.get("postTitle") as string;
  // const postContent = data.get("postContent") as string;
  // const slug = postTitle.replace(" ", "-");
  // const categories = data.get("postsCategories") as any;
  // const postsCategories = [categories.slice(",")];
  // const published = data.get("published") as string;
  // const isPublished = !!published;
  // const postImageLink = data.get("projImageLink") as string;
  // console.log({
  //   postTitle,
  //   postContent,
  //   slug,
  //   categories,
  //   postsCategories,
  //   isPublished,
  //   postImageLink,
  // });
  // const session = await auth();
  // const user = session?.user;
  // if (user?.role !== "admin") {
  //   return {
  //     success: false,
  //     message: "You Don't Have Privilige To Add Certificate",
  //   };
  // }
  // const result = postSchema.safeParse({
  //   postTitle,
  //   postContent,
  //   slug,
  //   postsCategories,
  //   published: isPublished,
  //   postImageLink,
  // });
  // if (result.success) {
  // const post = await db.insert(posts).values({
  //   postTitle,
  //   postContent,
  //   slug,
  //   postsCategories,
  //   published: isPublished,
  //   postImageLink,
  // });
  // console.log("certificate added successfully");
  // revalidatePath("/dashboard/certificates");
  // return { success: true, message: result.data };
  // }
  // if (result.error) {
  // return { success: false, error: result.error.format() };
  // }
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
