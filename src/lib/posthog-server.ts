import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    const projectApiKey = process.env.POSTHOG_PROJECT_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const ingestHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!projectApiKey) {
      throw new Error("Missing PostHog project API key. Set POSTHOG_PROJECT_API_KEY.");
    }

    posthogClient = new PostHog(
      projectApiKey,
      {
        host: ingestHost,
        flushAt: 1,
        flushInterval: 0
      }
    );
  }
  return posthogClient;
}

export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}
