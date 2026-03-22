
"use server";

import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/src/lib/utils/authMiddleware";
import { getString } from "@/src/lib/utils/formDataParser";
import { postSchema } from "@/src/lib/schemas/postSchema";
import { syncBlogPostsService } from "@/src/lib/services/posts/sync";

export async function syncBlogPosts(options?: { skipAuth?: boolean }) {
  if (!options?.skipAuth) {
    const authResult = await requireAdmin("You Don't Have Privilege To Sync Posts");
    if (!authResult.isAuthorized) return authResult;
  }
  return await syncBlogPostsService();
}

export async function addNewPost(formData: FormData) {
  const authResult = await requireAdmin("You Don't Have Privilege To Add Post");
  if (!authResult.isAuthorized) return authResult;

  const title = getString(formData, "title")
  const content = getString(formData, "content")
  const published = getString(formData, "published")
  const categories = getString(formData, "categories")
  const imageLink = getString(formData, "imageLink")
  const postsCategories = categories?.split(",") || []
  const isPublished = Boolean(published)
  const slug = title.toLowerCase().replace(/\s+/g, "-")

  const result = postSchema.safeParse({ title, content, slug, postsCategories, published: isPublished, imageLink })

  if (result.success) {
    await db.insert(posts).values({
      title_en: title,
      content_en: content,
      title_ar: title,
      content_ar: content,
      slug,
      author: authResult.user.id as string,
      categories: postsCategories,
      published: isPublished,
      imageLink,
      originalLink: "",
    })
    return { success: true, message: "Post Added Successfully" }
  }
  return { success: false, error: result.error?.format() }
}

export async function updateSinglePosts(post: any) {
  const authResult = await requireAdmin("You Don't Have Privilege To Update Post");
  if (!authResult.isAuthorized) return authResult;

  await db.update(posts).set({
    title_en: post.title,
    content_en: post.content,
    title_ar: post.title,
    content_ar: post.content,
    slug: post.slug,
    categories: post.categories,
    published: post.published,
    imageLink: post.imageLink,
  }).where(eq(posts.id, post.id))

  return { success: true, message: "Blog Post Updated Successfully" }
}

export async function deleteSinglePosts(id: string) {
  const authResult = await requireAdmin("You Don't Have Privilege To Delete Post");
  if (!authResult.isAuthorized) return authResult;

  await db.delete(posts).where(eq(posts.id, id))
  return { success: true, message: "Blog Post Deleted Successfully" }
}
