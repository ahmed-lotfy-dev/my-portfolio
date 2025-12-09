"use server";

export async function getPostHogAnalytics() {
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const host = process.env.POSTHOG_HOST || "https://us.posthog.com";

  if (!projectId || !apiKey) {
    console.error("PostHog credentials missing");
    return { uniqueVisitors: 0 };
  }

  if (apiKey.startsWith("phc_")) {
    console.error(
      "PostHog Error: You are using a Project API Key ('phc_...'). You must use a Personal API Key ('phx_...') to fetch insights."
    );
    return { uniqueVisitors: 0, trend: [], topPaths: [], sources: [] };
  }

  try {
    const headers = { Authorization: `Bearer ${apiKey}` };

    // 1. Trend (Last 7 Days)
    const trendPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"dau"}]&date_from=-7d&display=ActionsLineGraph&interval=day`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    // 2. Top Paths (Most visited pages)
    const pathsPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=-7d&breakdown=$pathname&limit=5`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    // 3. Traffic Sources (Referrers)
    const sourcesPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=-7d&breakdown=$referrer&limit=5`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    const [trendData, pathsData, sourcesData] = await Promise.all([
      trendPromise,
      pathsPromise,
      sourcesPromise,
    ]);

    // Process Trend Data
    const totalUniqueVisitors =
      trendData.result?.[0]?.data?.reduce((a: number, b: number) => a + b, 0) ||
      0;
    const trend =
      trendData.result?.[0]?.data?.map((value: number, index: number) => ({
        date: trendData.result[0].days[index],
        value,
      })) || [];

    // Process Top Paths
    const topPaths =
      pathsData.result?.map((item: any) => ({
        path: item.label,
        count: item.count,
      })) || [];

    // Process Sources
    const sources =
      sourcesData.result?.map((item: any) => ({
        source: item.label === "$direct" ? "Direct" : item.label,
        count: item.count,
      })) || [];

    return {
      uniqueVisitors: totalUniqueVisitors,
      trend,
      topPaths,
      sources,
    };
  } catch (error) {
    console.error("Error fetching PostHog analytics:", error);
    return { uniqueVisitors: 0, trend: [], topPaths: [], sources: [] };
  }
}
