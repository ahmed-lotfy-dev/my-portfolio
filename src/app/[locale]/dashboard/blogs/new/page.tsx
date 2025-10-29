"use client"

import { useTranslations } from "next-intl"
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
import { Textarea } from "@/src/components/ui/textarea"

type Props = {}

const Page = (props: Props) => {
  const t = useTranslations("blogs")
  return (
    <div className="w-full flex flex-col justify-center items-center mt-10">
      <h2 className="text-2xl font-bold mb-6">{t("add-title")}</h2>

      <form
        action={async (formData) => {
          await addNewPost(formData)
        }}
        className="flex flex-col gap-5 w-full max-w-lg p-6 border rounded-lg shadow-sm bg-card"
      >
        {/* Post Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-medium">
            {t("post_title")}
          </label>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder={t("placeholders.title")}
            required
          />
        </div>

        {/* Post Content */}
        <div className="flex flex-col gap-2">
          <label htmlFor="postContent" className="font-medium">
            {t("post_content")}
          </label>
          <Textarea
            id="postContent"
            name="content"
            placeholder={t("placeholders.content")}
            required
          />
        </div>

        {/* Publish State */}
        <div className="flex flex-col gap-2">
          <label htmlFor="published" className="font-medium">
            {t("publish_state")}
          </label>
          <Select name="published">
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("select_publish_state")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("publish_state")}</SelectLabel>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Unpublished</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Image */}
        <div className="flex flex-col gap-2">
          <label htmlFor="file" className="font-medium">
            {t("upload_image")}
          </label>
          <Input id="file" type="file" name="file" accept="image/*" />
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <label htmlFor="categories" className="font-medium">
            {t("categories")}
          </label>
          <Input
            id="categories"
            type="text"
            name="categories"
            placeholder={t("placeholders.categories")}
          />
        </div>

        <Submit btnText={t("add_post")} />
      </form>
    </div>
  )
}

export default Page
