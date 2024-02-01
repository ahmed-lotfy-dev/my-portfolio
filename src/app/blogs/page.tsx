import React from "react";
import { getAllPosts } from "@/src/app/lib/getPosts";

export default async function Page() {
  const { allPosts } = await getAllPosts();
  console.log(allPosts);

  return allPosts.length > 0 ? (
    <div>{allPosts[0].title}</div>
  ) : (
    <div>No Posts Found</div>
  );
}
