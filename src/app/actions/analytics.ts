"use server";

export async function getPostHogAnalytics() {
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  // Use EU host if configured, otherwise default to US (or check another env var)
  // Based on previous turn, user is on EU.
  const host = "https://eu.posthog.com"; 

  if (!projectId || !apiKey) {
    console.error("PostHog credentials missing");
    return { uniqueVisitors: 0 };
  }

  try {
    const response = await fetch(
      `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"dau"}]&date_from=-7d`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch PostHog analytics", await response.text());
      return { uniqueVisitors: 0 };
    }

    const data = await response.json();
    // PostHog trends API returns an array of results. 
    // "math": "dau" gives Daily Active Users (Unique Visitors).
    // The 'count' is the sum of the data points for the period.
    
    const count = data.result?.[0]?.count || 0;
    
    // Alternatively, sum up the data points if count isn't the total
    const totalUniqueVisitors = data.result?.[0]?.data?.reduce((a: number, b: number) => a + b, 0) || 0;

    return { uniqueVisitors: totalUniqueVisitors };
  } catch (error) {
    console.error("Error fetching PostHog analytics:", error);
    return { uniqueVisitors: 0 };
  }
}
