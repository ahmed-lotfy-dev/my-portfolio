import React from "react";
import { getAllPosts } from "@/src/app/lib/getPosts";

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { allPosts } = await getAllPosts();
  console.log(allPosts);

  return allPosts.length > 0 ? (
    <div>{allPosts[0].title}</div>
  ) : (
    "No Posts Found"
  );
};

export default page;
