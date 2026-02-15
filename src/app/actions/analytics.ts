"use server";

import { db } from "@/src/db";
import { posts, projects } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementViews(id: string, type: "blog" | "project") {
  try {
    if (type === "blog") {
      await db
        .update(posts)
        .set({
          views: sql`${posts.views} + 1`,
        })
        .where(eq(posts.slug, id));
    } else {
      await db
        .update(projects)
        .set({
          views: sql`${projects.views} + 1`,
        })
        .where(eq(projects.id, id));
    }
    return { success: true };
  } catch (error) {
    console.error(`Error incrementing ${type} views:`, error);
    return { success: false };
  }
}

type AnalyticsPayload = {
  uniqueVisitors: number;
  trend: { date: string; value: number }[];
  topPaths: { path: string; count: number }[];
  sources: { source: string; count: number }[];
  topProjects: { name: string; path: string; count: number; avgDuration: number }[];
  topBlogs: { name: string; path: string; count: number }[];
  locations: { country: string; count: number }[];
};

const EMPTY_ANALYTICS: AnalyticsPayload = {
  uniqueVisitors: 0,
  trend: [],
  topPaths: [],
  sources: [],
  topProjects: [],
  topBlogs: [],
  locations: [],
};

async function fetchPosthogJson(url: string, headers: { Authorization: string }, revalidate: number) {
  const response = await fetch(url, { headers, next: { revalidate } });
  if (!response.ok) {
    throw new Error(`PostHog request failed (${response.status})`);
  }
  return response.json();
}

async function fetchPosthogJsonSafe(
  url: string,
  headers: { Authorization: string },
  revalidate: number
) {
  try {
    return await fetchPosthogJson(url, headers, revalidate);
  } catch (error) {
    console.error("PostHog request failed for URL:", url, error);
    return { result: [] };
  }
}

export async function getPostHogAnalytics() {
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY || process.env.POSTHOG_MCP_KEY;

  const ingestionHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "";
  const inferredApiHost = ingestionHost.includes("eu.") ? "https://eu.posthog.com" : "https://us.posthog.com";
  const host = (
    process.env.POSTHOG_HOST ||
    process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ||
    inferredApiHost
  ).replace(/\/$/, "");

  if (!projectId || !apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog credentials missing (POSTHOG_PROJECT_ID or POSTHOG_PERSONAL_API_KEY)");
    }
    return EMPTY_ANALYTICS;
  }

  if (apiKey.startsWith("phc_")) {
    console.error(
      "PostHog Error: You are using a Project API Key ('phc_...'). You must use a Personal API Key ('phx_...') to fetch insights."
    );
    return EMPTY_ANALYTICS;
  }

  try {
    const headers = { Authorization: `Bearer ${apiKey}` };
    const isProduction = process.env.NODE_ENV === "production";
    const includeLocalhost = process.env.INCLUDE_LOCALHOST_ANALYTICS === "true";

    const filterConditions = [];
    if (isProduction && !includeLocalhost) {
      filterConditions.push({ key: "$host", operator: "is_not", value: ["localhost:3000", "localhost:3001", "127.0.0.1:3000"] });
    }

    const properties = encodeURIComponent(JSON.stringify(filterConditions));

    const trendPromise = fetchPosthogJsonSafe(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&display=ActionsLineGraph&interval=day&properties=${properties}`,
      headers,
      600
    );

    const pathsPromise = fetchPosthogJsonSafe(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$pathname&limit=5&properties=${properties}`,
      headers,
      3600
    );

    const sourcesPromise = fetchPosthogJsonSafe(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$referrer&limit=5&properties=${properties}`,
      headers,
      3600
    );

    const projectsFilter = encodeURIComponent(
      JSON.stringify([
        ...filterConditions,
        { key: "$pathname", operator: "icontains", value: "/projects/" },
      ])
    );
    const projectsPromise = fetchPosthogJsonSafe(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$pathname&limit=5&properties=${projectsFilter}`,
      headers,
      3600
    );

    const locationsPromise = fetchPosthogJsonSafe(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$geoip_country_name&limit=5&properties=${properties}`,
      headers,
      3600
    );

    const durationPromise = fetchPosthogJsonSafe(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageleave","math":"avg","math_property":"$duration"}]&date_from=-7d&breakdown=$pathname&limit=10&properties=${projectsFilter}`,
      headers,
      600
    );

    const blogsFilter = encodeURIComponent(
      JSON.stringify([
        ...filterConditions,
        { key: "$pathname", operator: "icontains", value: "/blogs/" },
      ])
    );
    const blogsPromise = fetchPosthogJsonSafe(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$pathname&limit=5&properties=${blogsFilter}`,
      headers,
      600
    );

    const [trendData, pathsData, sourcesData, projectsData, locationsData, durationData, blogsData] = await Promise.all([
      trendPromise,
      pathsPromise,
      sourcesPromise,
      projectsPromise,
      locationsPromise,
      durationPromise,
      blogsPromise,
    ]);

    const totalUniqueVisitors =
      trendData.result?.[0]?.data?.reduce((a: number, b: number) => a + b, 0) ||
      0;
    const trend =
      trendData.result?.[0]?.data?.map((value: number, index: number) => ({
        date: trendData.result[0].days[index],
        value,
      })) || [];

    const topPaths =
      pathsData.result?.map((item: any) => ({
        path: item.label,
        count: item.count,
      })) || [];

    const sources =
      sourcesData.result?.map((item: any) => ({
        source: item.label === "$direct" ? "Direct" : item.label,
        count: item.count,
      })) || [];

    const durationMap = new Map<string, number>(
      (durationData.result ?? []).map((item: any) => [item.label, item.count])
    );
    const projectsMap = new Map<string, { name: string; path: string; count: number; totalDuration: number; visits: number }>();

    projectsData.result?.forEach((item: any) => {
      const path = item.label;
      const pathParts = path.split("/projects/");
      if (pathParts.length <= 1) return;

      const projectName = pathParts[1].split(/[/?#]/)[0];

      const avgDuration = durationMap.get(path) ?? 0;

      const existing = projectsMap.get(projectName);
      if (existing) {
        existing.count += item.count;
        existing.totalDuration += avgDuration * item.count;
        existing.visits += item.count;
      } else {
        projectsMap.set(projectName, {
          name: projectName,
          path: `/projects/${projectName}`,
          count: item.count,
          totalDuration: avgDuration * item.count,
          visits: item.count
        });
      }
    });

    const topProjects = Array.from(projectsMap.values())
      .map(p => ({
        name: p.name,
        path: p.path,
        count: p.count,
        avgDuration: p.visits > 0 ? Math.round(p.totalDuration / p.visits) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const blogsMap = new Map<string, { name: string; path: string; count: number }>();

    blogsData.result?.forEach((item: any) => {
      const path = item.label;
      const pathParts = path.split("/blogs/");
      if (pathParts.length <= 1) return;

      const blogName = pathParts[1].split(/[/?#]/)[0];

      const existing = blogsMap.get(blogName);
      if (existing) {
        existing.count += item.count;
      } else {
        blogsMap.set(blogName, {
          name: blogName,
          path: `/blogs/${blogName}`,
          count: item.count
        });
      }
    });

    const topBlogs = Array.from(blogsMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const locations =
      locationsData.result?.map((item: any) => ({
        country: item.label,
        count: item.count,
      })) || [];

    return {
      uniqueVisitors: totalUniqueVisitors,
      trend,
      topPaths,
      sources,
      topProjects,
      topBlogs,
      locations,
    };
  } catch (error) {
    console.error("Error fetching PostHog analytics:", error);
    return EMPTY_ANALYTICS;
  }
}
