
import matter from "gray-matter";
import readingTime from "reading-time";
import { db } from "@/src/db";
import { posts } from "@/src/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.OBSIDIAN_REPO_OWNER;
const REPO_NAME = process.env.OBSIDIAN_REPO_NAME;
const REPO_BRANCH = process.env.OBSIDIAN_REPO_BRANCH || "main";

const allowedHosts = [
  "images.ahmedlotfy.site",
  "pub-49b2468145c64b14a4a172c257cf46b8.r2.dev",
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com"
];

function formatDate(date: any) {
  if (date instanceof Date) return date.toISOString().split("T")[0];
  return date ? String(date) : new Date().toISOString().split("T")[0];
}

function validateImage(image: string | undefined): string | undefined {
  if (!image) return undefined;
  try {
    const imageUrl = new URL(image);
    return allowedHosts.includes(imageUrl.hostname) ? image : undefined;
  } catch {
    return undefined;
  }
}

export async function syncBlogPostsService() {
  if (!REPO_OWNER || !REPO_NAME) {
    throw new Error("Missing GitHub configuration");
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

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
  const syncedSlugs = new Set<string>();

  for (const file of markdownFiles) {
    const contentResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(file.path)}?ref=${REPO_BRANCH}&t=${Date.now()}`,
      { headers, next: { revalidate: 0 } }
    );

    if (!contentResponse.ok) continue;

    const contentData = await contentResponse.json();
    const rawContent = Buffer.from(contentData.content, "base64").toString("utf8");
    const { data: frontmatter, content: body } = matter(rawContent);

    const pathParts = file.path.split("/");
    const category = pathParts.length > 1 ? pathParts[0] : "uncategorized";
    const filename = pathParts[pathParts.length - 1];

    const slug = filename
      .replace(".md", "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    syncedSlugs.add(slug);

    if (frontmatter.share !== true) {
      if (existing && existing.published) {
        await db.update(posts).set({ published: false, featured: false, lastSyncedAt: new Date() }).where(eq(posts.id, existing.id));
        syncedCount++;
      }
      continue;
    }

    const image = validateImage(frontmatter.image || frontmatter.coverImage);

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

    if (existing) {
      await db.update(posts).set(postData).where(eq(posts.id, existing.id));
    } else {
      await db.insert(posts).values(postData);
    }
    syncedCount++;
  }

  let reconciledCount = 0;
  const allObsidianPosts = await db.query.posts.findMany({
    where: and(eq(posts.source, "obsidian"), eq(posts.published, true)),
  });

  for (const post of allObsidianPosts) {
    if (!syncedSlugs.has(post.slug)) {
      await db.update(posts).set({ published: false, featured: false, lastSyncedAt: new Date() }).where(eq(posts.id, post.id));
      reconciledCount++;
    }
  }

  revalidatePath("/blogs");
  revalidatePath("/", "layout");

  return { success: true, count: syncedCount, reconciled: reconciledCount };
}
