import { getAllPosts } from "@/src/app/lib/getPosts";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default async function PostsList() {
  const { allPosts } = await getAllPosts();

  return (
    <div className="w-full h-svh grid grid-cols-3 mt-10 px-20 py-10">
      {allPosts ? (
        allPosts?.map((post) => {
          return (
            post.published && (
              <Card className="p-10" key={post.id}>
                <h2 className="">Tite : {post.title}</h2>
                <p className="">Content : {post.content}</p>
                <h3 className="">Author : {post.author}</h3>
                <Button className="mt-5 w-1/3" variant={"secondary"}>
                  <Link href={`/blogs/${post.title}`}>read more</Link>
                </Button>
              </Card>
            )
          );
        })
      ) : (
        <div className="w-full h-svh flex justify-center items-start mt-10">
          <p>No Posts Found</p>
        </div>
      )}
    </div>
  );
}
