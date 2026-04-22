
"use server";

import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { eq, and, arrayContains, desc } from "drizzle-orm";

export async function getDbBlogPosts(filters?: { category?: string; tag?: string; featuredOnly?: boolean }) {
  try {
    let whereClause = eq(posts.published, true);
    if (filters?.category) whereClause = and(whereClause, arrayContains(posts.categories, [filters.category])) as any;
    if (filters?.tag) whereClause = and(whereClause, arrayContains(posts.tags, [filters.tag])) as any;
    if (filters?.featuredOnly) whereClause = and(whereClause, eq(posts.featured, true)) as any;

    const results = await db.query.posts.findMany({
      where: whereClause,
      orderBy: [desc(posts.createdAt)],
    });

    return results.map(post => ({
      title: post.title_en,
      date: post.createdAt.toISOString().split("T")[0],
      tags: post.tags,
      category: post.categories[0] || "uncategorized",
      slug: post.slug,
      readingTime: post.readingTime || "5 min read",
      image: post.imageLink,
      featured: post.featured,
      views: post.views,
    }));
  } catch (error) {
    console.error("[PostsAction] Error fetching listing:", error);
    return [];
  }
}

export async function getDbBlogPostBySlug(slug: string) {
  try {
    const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });
    if (!post) return null;
    return {
      title: post.title_en,
      content: post.content_en,
      date: post.createdAt.toISOString().split("T")[0],
      updated: post.updatedAt?.toISOString().split("T")[0],
      tags: post.tags,
      category: post.categories[0] || "uncategorized",
      slug: post.slug,
      readingTime: post.readingTime || "5 min read",
      featured: post.featured,
      views: post.views,
      imageLink: post.imageLink,
    };
  } catch (error) {
    console.error(`[PostsAction] Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function getDbBlogPostById(id: string) {
  try {
    const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });
    if (!post) return null;
    return {
      id: post.id,
      title: post.title_en,
      content: post.content_en,
      date: post.createdAt.toISOString().split("T")[0],
      updated: post.updatedAt?.toISOString().split("T")[0],
      tags: post.tags,
      category: post.categories[0] || "uncategorized",
      slug: post.slug,
      readingTime: post.readingTime || "5 min read",
      featured: post.featured,
      published: post.published,
      imageLink: post.imageLink,
    };
  } catch (error) {
    console.error(`[PostsAction] Error fetching post by ID ${id}:`, error);
    return null;
  }
}

export async function getLatestSyncDate() {
  try {
    const latestPost = await db.query.posts.findFirst({ orderBy: [desc(posts.lastSyncedAt)] });
    return latestPost?.lastSyncedAt || null;
  } catch (error) {
    return null;
  }
}

export async function getAllPosts() {
  try {
    const allPosts = await db.query.posts.findMany({ orderBy: [desc(posts.createdAt)] });
    return { allPosts };
  } catch (error) {
    return { error };
  }
}

export async function getSinglePosts(postSlug: string) {
  try {
    const singlePost = await db.query.posts.findFirst({ where: (p, { eq }) => eq(p.slug, postSlug) })
    return { success: true, message: "Single Blog Post Found", singlePost }
  } catch (error) {
    return { success: false, message: "Blog Post Not Found" }
  }
}
