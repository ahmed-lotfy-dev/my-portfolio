export const shouldShowApk = (categories: string[] | null | undefined): boolean => {
  if (!categories || !Array.isArray(categories)) return false;

  const lowerCategories = categories.map((c) => c.trim().toLowerCase());

  const isMobile = lowerCategories.some(
    (c) =>
      c.includes("mobile") || c.includes("app") || c.includes("android")
  );
  const isWeb = lowerCategories.some((c) => c.includes("web"));
  
  // Show APK if it's mobile/app/android but NOT explicitly web
  return isMobile && !isWeb;
};
