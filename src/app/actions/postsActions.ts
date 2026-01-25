"use server"

import matter from "gray-matter";
import readingTime from "reading-time";
import { postSchema } from "@/src/lib/schemas/postSchema"
import { db } from "@/src/db"
import { requireAdmin } from "@/src/lib/utils/authMiddleware"
import { getString } from "@/src/lib/utils/formDataParser"
import { posts } from "@/src/db/schema"
import { eq, and, arrayContains, desc } from "drizzle-orm"

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.OBSIDIAN_REPO_OWNER;
const REPO_NAME = process.env.OBSIDIAN_REPO_NAME;
const REPO_BRANCH = process.env.OBSIDIAN_REPO_BRANCH || "main";

/**
 * Fetch all published posts with optional filtering
 */
export async function getDbBlogPosts(filters?: { category?: string; tag?: string; featuredOnly?: boolean }) {
  try {
    let whereClause = eq(posts.published, true);

    if (filters?.category) {
      whereClause = and(whereClause, arrayContains(posts.categories, [filters.category])) as any;
    }

    if (filters?.tag) {
      whereClause = and(whereClause, arrayContains(posts.tags, [filters.tag])) as any;
    }

    if (filters?.featuredOnly) {
      whereClause = and(whereClause, eq(posts.featured, true)) as any;
    }

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
    }));
  } catch (error) {
    console.error("[PostsAction] Error fetching listing:", error);
    return [];
  }
}

/**
 * Fetch a single post by slug
 */
export async function getDbBlogPostBySlug(slug: string) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

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
    };
  } catch (error) {
    console.error(`[PostsAction] Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Get the most recent sync timestamp
 */
export async function getLatestSyncDate() {
  try {
    const latestPost = await db.query.posts.findFirst({
      orderBy: [desc(posts.lastSyncedAt)],
    });
    return latestPost?.lastSyncedAt || null;
  } catch (error) {
    console.error("[PostsAction] Error fetching sync date:", error);
    return null;
  }
}

/**
 * Sync blog posts from GitHub repository
 */
export async function syncBlogPosts() {
  if (!REPO_OWNER || !REPO_NAME) {
    throw new Error("Missing GitHub configuration");
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

  try {
    const treeUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${REPO_BRANCH}?recursive=1&t=${Date.now()}`;
    const response = await fetch(treeUrl, { headers, next: { revalidate: 0 } });

    if (!response.ok) throw new Error(`GitHub error: ${response.statusText}`);

    const data = await response.json();
    const markdownFiles = data.tree.filter((file: any) =>
      file.type === "blob" &&
      file.path.endsWith(".md") &&
      !file.path.startsWith(".") &&
      !file.path.includes(".obsidian")
    );

    let syncedCount = 0;

    for (const file of markdownFiles) {
      const contentResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(file.path)}?ref=${REPO_BRANCH}`,
        { headers, next: { revalidate: 0 } }
      );

      if (!contentResponse.ok) continue;

      const contentData = await contentResponse.json();
      const rawContent = Buffer.from(contentData.content, "base64").toString("utf8");
      const { data: frontmatter, content: body } = matter(rawContent);

      if (frontmatter.share !== true) continue;

      const pathParts = file.path.split("/");
      const category = pathParts.length > 1 ? pathParts[0] : "uncategorized";
      const filename = pathParts[pathParts.length - 1];

      const slug = filename
        .replace(".md", "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const formatDate = (date: any) => {
        if (date instanceof Date) return date.toISOString().split("T")[0];
        return date ? String(date) : new Date().toISOString().split("T")[0];
      };

      // Image Validator
      let image = frontmatter.image || frontmatter.coverImage;
      const allowedHosts = [
        "images.ahmedlotfy.site",
        "pub-49b2468145c64b14a4a172c257cf46b8.r2.dev",
        "lh3.googleusercontent.com",
        "avatars.githubusercontent.com"
      ];

      if (image) {
        try {
          const imageUrl = new URL(image);
          if (!allowedHosts.includes(imageUrl.hostname)) image = undefined;
        } catch { image = undefined; }
      }

      const postData = {
        title_en: frontmatter.title || filename.replace(".md", ""),
        content_en: body,
        slug: slug,
        imageLink: image,
        published: true,
        featured: frontmatter.featured === true,
        categories: [category],
        tags: frontmatter.tags || [],
        readingTime: readingTime(body).text,
        lastSyncedAt: new Date(),
        updatedAt: new Date(formatDate(frontmatter.updated || frontmatter.date)),
        createdAt: new Date(formatDate(frontmatter.date)),
      };

      const existing = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });

      if (existing) {
        await db.update(posts).set(postData).where(eq(posts.id, existing.id));
      } else {
        await db.insert(posts).values(postData);
      }

      syncedCount++;
    }

    return { success: true, count: syncedCount };
  } catch (error) {
    console.error("[PostsAction] Sync failed:", error);
    throw error;
  }
}

// Legacy / Dashboard Dashboard Actions
export async function getAllPosts() {
  try {
    const allPosts = await db.query.posts.findMany();
    return { allPosts };
  } catch (error) {
    return { error };
  }
}

export async function getSinglePosts(postSlug: string) {
  const singlePost = await db.query.posts.findFirst({
    where: (p, { eq }) => eq(p.slug, postSlug),
  })

  return { success: true, message: "Single Blog Post Found", singlePost }
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
