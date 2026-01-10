/**
 * FormData parsing utilities for server actions
 * Provides safe, reusable parsers for common form data patterns
 */

import { logger } from "@/lib/utils/logger";

/**
 * Safely extracts and parses an image array from FormData
 * Handles defensive parsing against File objects sent as images
 * 
 * The images field may contain:
 * - A JSON string of URLs
 * - File objects (which we ignore)
 * - Multiple entries
 * 
 * @param data - FormData object
 * @param fieldName - Name of the field (default: "images")
 * @returns Array of image URLs
 * 
 * @example
 * ```ts
 * const images = parseImageArray(formData);
 * // Returns: ["https://...", "https://..."]
 * ```
 */
export function parseImageArray(
  data: FormData,
  fieldName: string = "images"
): string[] {
  const imagesEntries = data.getAll(fieldName);
  let images: string[] = [];

  for (const entry of imagesEntries) {
    // Only process string entries (skip File objects)
    if (typeof entry === "string") {
      try {
        const parsed = JSON.parse(entry);
        if (Array.isArray(parsed)) {
          images = parsed;
          break; // Found valid array, stop processing
        }
      } catch (e) {
        // Ignore invalid JSON entries
        logger.debug(`Skipped invalid JSON in ${fieldName}:`, entry);
      }
    }
  }

  return images;
}

/**
 * Parses comma-separated categories from FormData
 * Trims whitespace from each category
 * 
 * @param data - FormData object
 * @param fieldName - Name of the field (default: "categories")
 * @returns Array of trimmed category strings
 * 
 * @example
 * ```ts
 * const categories = parseCategories(formData);
 * // Input: "React, Next.js,  TypeScript"
 * // Returns: ["React", "Next.js", "TypeScript"]
 * ```
 */
export function parseCategories(
  data: FormData,
  fieldName: string = "categories"
): string[] {
  const categoriesString = data.get(fieldName) as string;

  if (!categoriesString) {
    return [];
  }

  return categoriesString
    .split(",")
    .map((category) => category.trim())
    .filter((category) => category.length > 0);
}

/**
 * Parses a boolean from FormData
 * Handles "true"/"false" strings and checkbox values
 * 
 * @param data - FormData object
 * @param fieldName - Name of the field
 * @param defaultValue - Default value if field is missing
 * @returns Boolean value
 * 
 * @example
 * ```ts
 * const published = parseBoolean(formData, "published", false);
 * ```
 */
export function parseBoolean(
  data: FormData,
  fieldName: string,
  defaultValue: boolean = false
): boolean {
  const value = data.get(fieldName);

  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return defaultValue;
}

/**
 * Safely gets a string from FormData with optional default
 * 
 * @param data - FormData object
 * @param fieldName - Name of the field
 * @param defaultValue - Default value if field is missing
 * @returns String value
 */
export function getString(
  data: FormData,
  fieldName: string,
  defaultValue: string = ""
): string {
  const value = data.get(fieldName);
  return typeof value === "string" ? value : defaultValue;
}
