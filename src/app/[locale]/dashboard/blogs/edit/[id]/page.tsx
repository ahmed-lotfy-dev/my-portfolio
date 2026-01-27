import { getDbBlogPostBySlug, getDbBlogPostById } from "@/src/app/actions/postsActions";
import BlogForm from "@/src/components/features/dashboard/blog/BlogForm";
import { getTranslations } from "next-intl/server";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsResolved = await params;
  const { id } = paramsResolved;
  const t = await getTranslations("blogs");
  
  const post = await getDbBlogPostById(id);

  if (!post) {
    return <div>Blog post not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("edit-title")}</h1>
        <p className="text-muted-foreground">{t("edit-desc")}</p>
      </div>

      <BlogForm initialData={{ ...post, imageLink: post.imageLink || undefined }} isEdit={true} />
    </div>
  );
}