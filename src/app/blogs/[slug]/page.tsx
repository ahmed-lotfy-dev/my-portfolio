import {
  deleteSinglePosts,
  getSinglePosts,
} from "@/src/app/actions/postsActions";
import { Button } from "@/src/components/ui/button";

export default async function SinglePost(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const { slug } = params;
  const postTitle = slug.replace("%20", " ");
  const { singlePost } = await getSinglePosts(postTitle);

  const handleDelete = async () => {
    if (singlePost?.id) {
      const result = await deleteSinglePosts(singlePost.id);
    }
  };

  return (
    <div className="p-9 w-full h-svh flex flex-col gap-7 mt-28 max-w-6xl m-auto">
      <h2>{singlePost?.title_en}</h2>
      <p>{singlePost?.content_en}</p>
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
