import { prisma } from "./prisma";

import { Blogpost } from "@prisma/client";

export async function getAllPosts() {
  const allPosts = await prisma.blogpost.findMany({
    include: { author: true },
  });
  return { success: true, message: "All Blog Posts Found", allPosts };
}

export async function getSinglePosts(postTitle: string) {
  const singlePost = await prisma.blogpost.findFirst({
    where: { title: postTitle },
  });
  return { success: true, message: "Single Blog Post Found", singlePost };
}

export async function updateSinglePosts(post: Blogpost) {
  const updateBlogPost = await prisma.blogpost.update({
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
  const deletedPost = await prisma.blogpost.delete({ where: { id: id } });
  return {
    success: true,
    message: "Blog Post Deleted Successfully",
  };
}
