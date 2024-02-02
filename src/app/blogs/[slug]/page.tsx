import React from "react";
import { deleteSinglePosts, getSinglePosts } from "../../lib/getPosts";
import { Button } from "@/src/components/ui/button";
import { EditPopover } from "@/src/components/ui/EditPopover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { HiEllipsisVertical } from "react-icons/hi2";
import { Dialog } from "@radix-ui/react-dialog";

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
        {singlePost?.tags?.map((tag) => (
          <Button key={tag}>{tag}</Button>
        ))}
        {/* {singlePost?.tags.map((tag) => (
          <Button>tag.</Button>
        ))} */}
      </h4>
      <Popover>
        <PopoverTrigger>
          <HiEllipsisVertical size={22} />
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <div className="cursor-pointer">
            <div className="w-full">
              .{" "}
              <Button className="w-full mt-2" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
