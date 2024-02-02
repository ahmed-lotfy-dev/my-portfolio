import React from "react";
import { getAllPosts } from "@/src/app/lib/getPosts";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default async function Page() {
  const { allPosts } = await getAllPosts();
  console.log(allPosts);

  return allPosts.length > 0 ? (
    <div className="w-full h-svh grid grid-cols-3 mt-10 px-20 py-10">
      {allPosts.map((post) => {
        return (
          post.published && (
            <Card className="p-10">
              <h2 className="">Tite : {post.title}</h2>
              <p className="">Content : {post.content}</p>
              <h3 className="">Author : {post.author.name}</h3>
              <Button className="mt-5 w-1/3" variant={"secondary"}>
                read more
              </Button>
            </Card>
          )
        );
      })}
    </div>
  ) : (
    <div className="w-full h-svh flex justify-center items-start mt-10">
      <p>No Posts Found</p>
    </div>
  );
}
