"use server"

import { postSchema } from "@/src/lib/schemas/postSchema"
import { db } from "@/src/db"
import { headers } from "next/headers"
import { auth } from "@/src/lib/auth"
import { posts } from "@/src/db/schema"
import { eq } from "drizzle-orm"

export async function getAllPosts() {
  try {
    const allPosts = await db.query.posts.findMany()
    return { allPosts }
  } catch (error) {
    return { error }
  }
}

export async function getSinglePosts(postSlug: string) {
  const singlePost = await db.query.posts.findFirst({
    where: (p, { eq }) => eq(p.slug, postSlug),
  })

  return { success: true, message: "Single Blog Post Found", singlePost }
}

export async function addNewPost(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const published = formData.get("published") as string
  const categories = formData.get("categories") as string
  const imageLink = formData.get("imageLink") as string
  const postsCategories = categories?.split(",")
  const isPublished = Boolean(published)
  const slug = title.replace(" ", "-") as string

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return {
      success: false,
      message: "You Don't Have Privilige To Add Post",
    }
  }

  const result = postSchema.safeParse({
    title,
    content,
    slug,
    postsCategories,
    published: isPublished,
    imageLink,
  })

  if (result.success) {
    await db.insert(posts).values({
      title_en: title,
      content_en: content,
      title_ar: title,
      content_ar: content,
      slug,
      author: user.id as string,
      categories: postsCategories,
      published: isPublished,
      imageLink,
      originalLink: "",
    })

    return { success: true, message: "Post Added Successfully" }
  }

  if (result.error) {
    return { success: false, error: result.error.format() }
  }
}

export async function updateSinglePosts(post: any) {
  await db
    .update(posts)
    .set({
      title_en: post.title,
      content_en: post.content,
      title_ar: post.title,
      content_ar: post.content,
      slug: post.slug,
      categories: post.categories,
      published: post.published,
      imageLink: post.imageLink,
    })
    .where(eq(posts.id, post.id))

  return {
    success: true,
    message: "Blog Post Updated Successfully",
  }
}

export async function deleteSinglePosts(id: string) {
  await db.delete(posts).where(eq(posts.id, id))

  return {
    success: true,
    message: "Blog Post Deleted Successfully",
  }
}
