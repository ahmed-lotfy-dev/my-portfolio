
const projectId = "107401";
const apiKey = "phx_GVyJzEmQbYU3mgpxLmGvyBt2Man31zFmCof09x8302BVpR2";
const host = "https://eu.posthog.com";

async function testPostHog() {
  const headers = { Authorization: `Bearer ${apiKey}` };
  const properties = encodeURIComponent(
    JSON.stringify([{ key: "$host", operator: "is_not", value: ["localhost:3000"] }])
  );

  const url = `${host}/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview","math":"total"}]&date_from=-7d&display=ActionsLineGraph&interval=day&properties=${properties}`;
  console.log(`Fetching: ${url}`);

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    console.log("Response Status:", response.status);
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testPostHog();
