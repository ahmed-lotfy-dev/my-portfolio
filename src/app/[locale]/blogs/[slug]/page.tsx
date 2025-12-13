import {
  deleteSinglePosts,
  getSinglePosts,
} from "@/src/app/actions/postsActions";
import { Button } from "@/src/components/ui/button";
import { getLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const postTitle = slug.replace("%20", " ");
  const { singlePost } = await getSinglePosts(postTitle);

  if (!singlePost) {
    return {
      title: "Post Not Found",
    };
  }

  const title = locale === "ar" ? singlePost.title_ar : singlePost.title_en;
  const description =
    (locale === "ar"
      ? singlePost.content_ar?.substring(0, 160)
      : singlePost.content_en?.substring(0, 160)) || "";

  return {
    title,
    description,
    openGraph: {
      images: [singlePost.imageLink],
    },
  };
}

export default async function SinglePost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const locale = await getLocale();
  const postTitle = slug.replace("%20", " ");
  const { singlePost } = await getSinglePosts(postTitle);

  const handleDelete = async () => {
    if (singlePost?.id) {
      const result = await deleteSinglePosts(singlePost.id);
    }
  };

  const title = locale === "ar" ? singlePost?.title_ar : singlePost?.title_en;
  const content =
    locale === "ar" ? singlePost?.content_ar : singlePost?.content_en;

  return (
    <div className="p-9 w-full h-svh flex flex-col gap-7 mt-28 max-w-6xl m-auto">
      <h2>{title}</h2>
      <p>{content}</p>
      <p>
        {singlePost?.createdAt?.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <h4>
        {singlePost?.categories?.map((category) => (
          <Button key={category}>{category}</Button>
        ))}
      </h4>
    </div>
  );
}
