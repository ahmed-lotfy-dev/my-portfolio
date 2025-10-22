"use client"

import { addNewPost } from "@/src/app/actions/postsActions"
import Submit from "@/src/components/ui/formSubmitBtn"
import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Blog Post</h2>

      <form
        action={async (formData) => {
          await addNewPost(formData)
        }}
        className="flex flex-col gap-5 w-full max-w-lg p-6 border rounded-lg shadow-sm bg-card"
      >
        {/* Post Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-medium">
            Post Title
          </label>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Post Content */}
        <div className="flex flex-col gap-2">
          <label htmlFor="postContent" className="font-medium">
            Post Content
          </label>
          <Input
            id="postContent"
            type="text"
            name="postContent"
            placeholder="Enter content"
            required
          />
        </div>

        {/* Publish State */}
        <div className="flex flex-col gap-2">
          <label htmlFor="published" className="font-medium">
            Publish State
          </label>
          <Select name="published">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Publish State" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Publish State</SelectLabel>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Unpublished</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Image */}
        <div className="flex flex-col gap-2">
          <label htmlFor="file" className="font-medium">
            Upload Image
          </label>
          <Input id="file" type="file" name="file" accept="image/*" />
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <label htmlFor="categories" className="font-medium">
            Categories
          </label>
          <Input
            id="categories"
            type="text"
            name="categories"
            placeholder="e.g. frontend, backend"
          />
        </div>

        <Submit btnText="Add Post" />
      </form>
    </div>
  )
}

export default Page
  