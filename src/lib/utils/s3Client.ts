import { S3Client } from "@aws-sdk/client-s3";

/**
 * Centralized S3 Client configuration for Cloudflare R2
 * 
 * This client is configured to work with Cloudflare R2 storage.
 * All upload, download, and delete operations should use this instance
 * to ensure consistent configuration across the application.
 * 
 * @see https://developers.cloudflare.com/r2/api/s3/api/
 */
export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
  },
});

/**
 * Get the configured R2 bucket name
 */
export const getBucketName = () => process.env.CF_BUCKET_NAME!;

/**
 * Get the configured images subdomain (without protocol)
 */
export const getImagesSubdomain = () => {
  return process.env.CF_IMAGES_SUBDOMAIN!
    .trim()
    .replace(/^https?:\/\//, ""); // Remove protocol if present
};

/**
 * Construct a full image URL from a file key
 * @param key - The file key/path in R2 storage
 * @returns The full public URL to access the image
 */
export const getImageUrl = (key: string): string => {
  const subdomain = getImagesSubdomain();
  return `https://${subdomain}/${key}`;
};

/**
 * Extract the object key from a full image URL
 * @param url - The full image URL
 * @returns The extracted key, or null if parsing fails
 */
export const extractKeyFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.startsWith('/') ? pathname.slice(1) : pathname;
  } catch (error) {
    console.error("Failed to parse URL:", url, error);
    return null;
  }
};
