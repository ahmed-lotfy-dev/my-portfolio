import { Upload } from "@/src/components/ui/Upload";
import { deleteSinglePosts, getSinglePosts } from "../../lib/getPosts";
import { Button } from "@/src/components/ui/button";

export default async function SinglePost({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const postTitle = slug.replace("%20", " ");
  const { singlePost } = await getSinglePosts(postTitle);

  const handleDelete = async () => {
    if (singlePost?.id) {
      const result = await deleteSinglePosts(singlePost.id);
    }
  };

  return (
    <div className="p-9 w-full h-svh flex flex-col gap-7">
      <h2>{singlePost?.title}</h2>
      <p>{singlePost?.content}</p>
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
