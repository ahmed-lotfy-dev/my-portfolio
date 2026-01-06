"use server";

export async function getPostHogAnalytics() {
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const host = process.env.POSTHOG_HOST || "https://us.posthog.com";

  if (!projectId || !apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog credentials missing (POSTHOG_PROJECT_ID or POSTHOG_PERSONAL_API_KEY)");
    }
    return { uniqueVisitors: 0, trend: [], topPaths: [], sources: [], topProjects: [], locations: [] };
  }

  if (apiKey.startsWith("phc_")) {
    console.error(
      "PostHog Error: You are using a Project API Key ('phc_...'). You must use a Personal API Key ('phx_...') to fetch insights."
    );
    return { uniqueVisitors: 0, trend: [], topPaths: [], sources: [], topProjects: [], locations: [] };
  }

  try {
    const headers = { Authorization: `Bearer ${apiKey}` };

    // Common properties to exclude localhost
    const properties = encodeURIComponent(
      JSON.stringify([{ key: "$host", operator: "is_not", value: ["localhost:3000"] }])
    );

    // 1. Trend (Last 7 Days)
    const trendPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"dau"}]&date_from=-7d&display=ActionsLineGraph&interval=day&properties=${properties}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    // 2. Top Paths (Most visited pages)
    const pathsPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=-7d&breakdown=$pathname&limit=5&properties=${properties}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    // 3. Traffic Sources (Referrers)
    const sourcesPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=-7d&breakdown=$referrer&limit=5&properties=${properties}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    // 4. Top Projects
    const projectsFilter = encodeURIComponent(
      JSON.stringify([
        { key: "$host", operator: "is_not", value: ["localhost:3000"] },
        { key: "$pathname", operator: "icontains", value: "/projects/" },
      ])
    );
    const projectsPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=-7d&breakdown=$pathname&limit=5&properties=${projectsFilter}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    // 5. Visitor Locations
    const locationsPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=-7d&breakdown=$geoip_country_name&limit=5&properties=${properties}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    // 6. Project Duration (Interest)
    const durationPromise = fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageleave","math":"avg","math_property":"$duration"}]&date_from=-7d&breakdown=$pathname&limit=10&properties=${projectsFilter}`,
      { headers, next: { revalidate: 3600 } }
    ).then((r) => r.json());

    const [trendData, pathsData, sourcesData, projectsData, locationsData, durationData] = await Promise.all([
      trendPromise,
      pathsPromise,
      sourcesPromise,
      projectsPromise,
      locationsPromise,
      durationPromise,
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

    // Process Top Projects
    const topProjects =
      projectsData.result?.map((item: any) => {
        // Clean up project name from path (e.g., "/en/projects/my-app" -> "my-app")
        const pathParts = item.label.split("/projects/");
        const projectName = pathParts.length > 1 ? pathParts[1] : item.label;

        // Find duration for this path
        const durationItem = durationData.result?.find((d: any) => d.label === item.label);
        const avgDuration = durationItem ? Math.round(durationItem.count) : 0;

        return {
          name: projectName,
          path: item.label,
          count: item.count,
          avgDuration,
        };
      }) || [];

    // Process Locations
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
      locations,
    };
  } catch (error) {
    console.error("Error fetching PostHog analytics:", error);
    return { uniqueVisitors: 0, trend: [], topPaths: [], sources: [], topProjects: [], locations: [] };
  }
}
