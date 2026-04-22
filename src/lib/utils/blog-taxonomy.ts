export function slugifyBlogTaxonomy(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildBlogCategoryPath(locale: string, category: string): string {
  return `/${locale}/blogs/category/${slugifyBlogTaxonomy(category)}`;
}
