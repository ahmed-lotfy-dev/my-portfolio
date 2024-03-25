"use server ";

import { postSchema } from "@/src/app/lib/schemas/postSchema";
import { auth } from "@/lib/auth";
import { db } from "@/src/app/lib/db";

export async function getAllPosts() {
  try {
    const allPosts = await db.post.findMany();
    return { allPosts };
  } catch (error) {
    return { error };
  }
}

export async function getSinglePosts(postId: string) {
  const singlePost = await db.post.findFirst({ where: { id: postId } });

  return { success: true, message: "Single Blog Post Found", singlePost };
}

export async function addNewPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") as string;
  const categories = formData.get("categories") as string;
  const imageLink = formData.get("imageLink") as string;
  const postsCategories = categories?.split(",");
  const isPublished = Boolean(published);
  const slug = title.replace(" ", "-") as string;

  const session = await auth();
  const user = session?.user;

  console.log(user?.id);
  console.log(session);

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Certificate",
    }
  }
  const result = postSchema.safeParse({
    title,
    content,
    slug,
    postsCategories,
    published: isPublished,
    imageLink,
  });
  console.log(result);

  if (result.success) {
    const post = await db.post.create({
      data: {
        title,
        content,
        slug,
        authorId: user.id as string,
        categories: postsCategories,
        published: isPublished,
        imageLink,
      },
    });
    console.log("certificate added successfully");
    return { success: true, message: result.data };
  }
  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function updateSinglePosts(post: any) {
  const updatedPost = await db.post.update({
    where: { id: post.id },
    data: { ...post },
  });
  return {
    success: true,
    message: "Blog Post Updated Successfully",
    updatedPost,
  };
}

export async function deleteSinglePosts(id: string) {
  const deletPost = await db.post.delete({ where: { id: id } });
  return {
    success: true,
    message: "Blog Post Deleted Successfully",
  };
}
