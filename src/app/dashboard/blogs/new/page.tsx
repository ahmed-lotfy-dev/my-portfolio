"use client";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useFormState } from "react-dom";
import { AddNewPost } from "../../../actions";
import { TagsInput } from "react-tag-input-component";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useSession } from "next-auth/react";
import { Upload } from "@/src/components/ui/Upload";
import Image from "next/image";
import { redirect } from "next/navigation";
import { notify } from "@/src/app/lib/utils/toast";

export default function AddPost() {
  const [state, formAction] = useFormState(AddNewPost, null);
  const [selected, setSelected] = useState(["frontend"]);
  const [imageUrl, setImageUrl] = useState("");

  if (state?.success) {
    notify(state?.message!, true);
    redirect("/blogs");
  }
  const { data: session } = useSession();
  const role = session?.user?.role;
  return (
    <div className="w-full h-svh flex flex-col justify-start items-center text-center mt-10 gap-5">
      <h2 className="mb-3">Add New Post</h2>
      <form action={formAction} className="w-1/4 flex flex-col gap-5">
        <Input
          type="text"
          name="title"
          placeholder="Post Title"
          className="mx-auto"
        />
        <p className="text-sm text-red-400">
          {state?.error?.title && state?.error?.title?._errors}
        </p>
        <Textarea
          name="content"
          className="mx-auto border border-b-gray-800"
          placeholder="Post Content"
        />
        <p className="text-sm text-red-400">
          {state?.error?.content && state?.error?.content?._errors}
        </p>
        <TagsInput
          value={selected}
          onChange={setSelected}
          placeHolder="Post Category"
        />
        <input type="hidden" name="tags" value={selected} />
        <input type="hidden" name="imageLink" value={imageUrl} />

        <Select name="published">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Publish State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Published</SelectItem>
            <SelectItem value="false">Not Published</SelectItem>
          </SelectContent>
        </Select>

        <Upload setImageUrl={setImageUrl} imageType="Posts" />

        {imageUrl && (
          <Image
            className="m-auto"
            src={imageUrl}
            width={300}
            height={300}
            alt="Certificate Image"
          />
        )}

        <Submit
          btnText={"Add Post"}
          className="w-2/3 mt-6"
          onClick={() => {
            if (role !== "admin") {
              notify("You don't have privilige to do this", false);
            } else {
              notify("Blog Post Completed Successfully", true);
            }
          }}
        />
      </form>
    </div>
  );
}
