import { Upload } from "@/src/components/ui/Upload";
import { deleteSinglePosts, getSinglePosts } from "../../lib/getPosts";
import { Button } from "@/src/components/ui/button";
// import { useState } from "react";

export default async function SinglePost({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const postTitle = slug.replace("%20", " ");
  const { singlePost } = await getSinglePosts(postTitle);
  // const [imageUrl, setImageUrl] = useState("");

  const handleDelete = async () => {
    if (singlePost?.id) {
      const result = await deleteSinglePosts(singlePost.id);
    }
  };

  return (
    <div className="p-9 w-full h-svh flex flex-col gap-7">
      {/* <Upload setImageUrl={setImageUrl} imageType="Blogs" /> */}
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
        {singlePost?.tags?.map((tag) => (
          <Button key={tag}>{tag}</Button>
        ))}
      </h4>
    </div>
  );
}