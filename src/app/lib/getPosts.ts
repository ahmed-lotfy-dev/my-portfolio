import { prisma } from "./prisma";

import { BlogPost } from "@prisma/client";

export async function getAllPosts() {
  const allPosts = await prisma.blogPost.findMany();
  return { success: true, message: "All Blog Posts Found", allPosts };
}

export async function getSinglePosts(id: string) {
  const singlePost = await prisma.blogPost.findFirst({ where: { id: id } });
  return { success: true, message: "Single Blog Post Found", singlePost };
}

export async function updateSinglePosts(post: BlogPost) {
  const updateBlogPost = await prisma.blogPost.update({
    where: { id: post.id },
    data: { ...post },
  });
  return {
    success: true,
    message: "Blog Post Updated Successfully",
    updateBlogPost,
  };
}

export async function deleteSinglePosts(id: string) {
  const deletedPost = await prisma.blogPost.delete({ where: { id: id } });
  return {
    success: true,
    message: "Blog Post Deleted Successfully",
  };
}
