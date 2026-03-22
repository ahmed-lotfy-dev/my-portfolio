/**
 * Use word-boundary checks so categories like "WhatsApp API" do not match "app".
 * Portrait carousel is only for real mobile-app projects.
 */
export const shouldShowApk = (categories: string[] | null | undefined): boolean => {
  if (!categories || !Array.isArray(categories)) return false;

  const lowerCategories = categories.map((c) => c.trim().toLowerCase());
  const isWeb = lowerCategories.some((c) => c.includes("web"));

  const isMobile = lowerCategories.some((c) => {
    if (/\breact native\b/.test(c)) return true;
    if (/\bflutter\b/.test(c)) return true;
    if (/\bexpo\b/.test(c)) return true;
    if (/\bandroid\b/.test(c)) return true;
    if (/\bios\b/.test(c)) return true;
    if (/\bmobile\b/.test(c)) return true;
    if (/\bapp\b/.test(c)) return true;
    return false;
  });

  return isMobile && !isWeb;
};
