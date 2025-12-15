/**
 * Translation helper utilities for server actions
 * Handles bidirectional EN <-> AR translation logic
 */

import { translateText } from "@/src/lib/utils/translate";
import { logger } from "@/src/lib/utils/logger";

/**
 * Input for bidirectional translation
 */
export type BilingualField = {
  en: string;
  ar: string;
};

/**
 * Result of bidirectional translation
 */
export type TranslatedField = {
  en: string;
  ar: string;
};

/**
 * Handles bidirectional translation for a field (title or description)
 * If one language is missing, it will be translated from the other
 * 
 * @param field - Object with 'en' and 'ar' properties
 * @param fieldName - Name of the field for logging (e.g., "Title", "Description")
 * @returns Promise with both languages populated
 * 
 * @example
 * ```ts
 * const translatedTitle = await translateBidirectional(
 *   { en: title_en, ar: title_ar },
 *   "Title"
 * );
 * // Use translatedTitle.en and translatedTitle.ar
 * ```
 */
export async function translateBidirectional(
  field: BilingualField,
  fieldName: string = "Field"
): Promise<TranslatedField> {
  logger.debug(`Original ${fieldName} EN:`, field.en);
  logger.debug(`Original ${fieldName} AR:`, field.ar);

  let finalEn = field.en;
  let finalAr = field.ar;

  // Translate EN → AR if Arabic is missing
  if (!field.ar && field.en) {
    finalAr = await translateText(field.en, "ar");
    logger.debug(`Translated ${fieldName} (EN→AR):`, finalAr);
  }
  // Translate AR → EN if English is missing
  else if (!field.en && field.ar) {
    finalEn = await translateText(field.ar, "en");
    logger.debug(`Translated ${fieldName} (AR→EN):`, finalEn);
  }

  return {
    en: finalEn,
    ar: finalAr,
  };
}

/**
 * Translates multiple fields at once
 * Useful when you need to translate both title and description
 * 
 * @param fields - Array of bilingual fields with their names
 * @returns Promise with all fields translated
 * 
 * @example
 * ```ts
 * const [title, desc] = await translateMultipleFields([
 *   { field: { en: title_en, ar: title_ar }, name: "Title" },
 *   { field: { en: desc_en, ar: desc_ar }, name: "Description" }
 * ]);
 * ```
 */
export async function translateMultipleFields(
  fields: Array<{ field: BilingualField; name: string }>
): Promise<TranslatedField[]> {
  return Promise.all(
    fields.map(({ field, name }) => translateBidirectional(field, name))
  );
}
