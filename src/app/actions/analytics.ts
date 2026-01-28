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
        .where(eq(posts.slug, id)); // Using slug as ID for blogs based on current usage
    } else {
      await db
        .update(projects)
        .set({
          views: sql`${projects.views} + 1`,
        })
        .where(eq(projects.slug, id));
    }
    return { success: true };
  } catch (error) {
    console.error(`Error incrementing ${type} views:`, error);
    return { success: false };
  }
}

export async function getPostHogAnalytics() {
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY || process.env.POSTHOG_MCP_KEY;
  let host = process.env.POSTHOG_HOST;

  if (!host && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    host = process.env.NEXT_PUBLIC_POSTHOG_HOST.includes("eu.i.posthog.com")
      ? "https://eu.posthog.com"
      : "https://us.posthog.com";
  }

  host = host || "https://us.posthog.com";

  if (!projectId || !apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog credentials missing (POSTHOG_PROJECT_ID or POSTHOG_PERSONAL_API_KEY)");
    }
    return { uniqueVisitors: 0, trend: [], topPaths: [], sources: [], topProjects: [], topBlogs: [], locations: [] };
  }

  if (apiKey.startsWith("phc_")) {
    console.error(
      "PostHog Error: You are using a Project API Key ('phc_...'). You must use a Personal API Key ('phx_...') to fetch insights."
    );
    return { uniqueVisitors: 0, trend: [], topPaths: [], sources: [], topProjects: [], topBlogs: [], locations: [] };
  }

  try {
    const headers = { Authorization: `Bearer ${apiKey}` };

    const isProduction = process.env.NODE_ENV === "production";

    // Allow including localhost data if explicitly requested or for debugging
    const includeLocalhost = process.env.INCLUDE_LOCALHOST_ANALYTICS === "true";

    const properties = encodeURIComponent(
      JSON.stringify(
        isProduction && !includeLocalhost
          ? [{ key: "$host", operator: "is_not", value: ["localhost:3000", "localhost:3001"] }]
          : []
      )
    );

    const trendPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&display=ActionsLineGraph&interval=day&properties=${properties}`,
      { headers, next: { revalidate: 600 } }
    ).then((r) => r.json());

    const pathsPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$pathname&limit=5&properties=${properties}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    const sourcesPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$referrer&limit=5&properties=${properties}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    const projectsFilter = encodeURIComponent(
      JSON.stringify([
        ...(isProduction && !includeLocalhost ? [{ key: "$host", operator: "is_not", value: ["localhost:3000", "localhost:3001"] }] : []),
        { key: "$pathname", operator: "icontains", value: "/projects/" },
      ])
    );
    const projectsPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$pathname&limit=5&properties=${projectsFilter}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    const locationsPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$geoip_country_name&limit=5&properties=${properties}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    const durationPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageleave","math":"avg","math_property":"$duration"}]&date_from=-7d&breakdown=$pathname&limit=10&properties=${projectsFilter}`,
      { headers, next: { revalidate: 600 } }
    ).then((r) => r.json());

    const blogsFilter = encodeURIComponent(
      JSON.stringify([
        ...(isProduction && !includeLocalhost ? [{ key: "$host", operator: "is_not", value: ["localhost:3000", "localhost:3001"] }] : []),
        { key: "$pathname", operator: "icontains", value: "/blogs/" },
      ])
    );
    const blogsPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&breakdown=$pathname&limit=5&properties=${blogsFilter}`,
      { headers, next: { revalidate: 600 } }
    ).then((r) => r.json());

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

    const projectsMap = new Map<string, { name: string; path: string; count: number; totalDuration: number; visits: number }>();

    projectsData.result?.forEach((item: any) => {
      const path = item.label;
      const pathParts = path.split("/projects/");
      if (pathParts.length <= 1) return;

      const projectName = pathParts[1].split(/[/?#]/)[0];

      const durationItem = durationData.result?.find((d: any) => d.label === path);
      const avgDuration = durationItem ? durationItem.count : 0;

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
    return { uniqueVisitors: 0, trend: [], topPaths: [], sources: [], topProjects: [], topBlogs: [], locations: [] };
  }
}
