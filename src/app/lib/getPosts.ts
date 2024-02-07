import { posts } from "@/src/db/schema";
import { db } from "@/src/app/lib/db";
import { eq } from "drizzle-orm";

async function getAllPosts() {
  try {
    const allPosts = await db.query.posts.findMany();
    return { allPosts };
  } catch (error) {
    return { error };
  }
}

async function getSinglePosts(postTitle: string) {
  const singlePost = await db.query.posts.findFirst({
    with: { title: postTitle },
  });

  return { success: true, message: "Single Blog Post Found", singlePost };
}

async function updateSinglePosts(post: any) {
  const updatedPost = await db.update(posts).set({ ...post });

  return {
    success: true,
    message: "Blog Post Updated Successfully",
    updatedPost,
  };
}

async function deleteSinglePosts(id: number) {
  const deletPost = await db.delete(posts).where(eq(posts.id, id)).returning();
  return {
    success: true,
    message: "Blog Post Deleted Successfully",
  };
}

export { getAllPosts, getSinglePosts, updateSinglePosts, deleteSinglePosts };
