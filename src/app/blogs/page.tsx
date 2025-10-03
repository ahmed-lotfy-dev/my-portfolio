import { getAllPosts } from "@/src/app/actions/postsActions"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import SafeImage from "@/src/components/ui/SafeImage"

export default async function PostsList() {
  const { allPosts } = await getAllPosts()

  return (
    <div className="container mx-auto px-4 mt-28 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-12">My Blog</h1>
      {allPosts && allPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map(
            (post) =>
              post.published && (
                <Card
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 pb-10"
                >
                  <CardHeader className="p-0">
                    <div className="relative w-full h-48">
                      <SafeImage
                        src={post.imageLink || "/images/placeholder.png"}
                        alt={post.title_en}
                        className=""
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow mt-14">
                    <CardTitle className="text-xl font-semibold mb-2">
                      {post.title_en}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-base line-clamp-3">
                      {post.content_en}
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                      {post.categories?.map((category) => (
                        <span
                          key={category}
                          className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <Button asChild>
                      <Link href={`/blogs/${post.slug}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-500">No Posts Found</p>
        </div>
      )}
    </div>
  )
}
