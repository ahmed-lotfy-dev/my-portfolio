// Placeholder for projects without images
export const PROJECT_PLACEHOLDER_IMAGE = "https://placehold.co/600x400/png";

// Helper to get project cover image or fallback to placeholder
export function getProjectCoverImage(coverImage?: string | null): string {
  return coverImage || PROJECT_PLACEHOLDER_IMAGE;
}
