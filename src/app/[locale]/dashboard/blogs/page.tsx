import { getAllPosts } from "@/src/app/actions/postsActions";
import BlogSyncConsole from "@/src/components/features/dashboard/blog/BlogSyncConsole";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function BlogDashboardPage() {
  const t = await getTranslations("dashboard.blog");
  const { allPosts, error } = await getAllPosts();

  if (error) {
    return <div>Error loading posts</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <BlogSyncConsole initialPosts={allPosts || []} />
    </div>
  );
}
