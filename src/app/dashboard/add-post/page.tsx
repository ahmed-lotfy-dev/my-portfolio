"use client";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useFormState } from "react-dom";
import { AddNewPost } from "../../actions";
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

export default function AddPost() {
  const [state, formAction] = useFormState(AddNewPost, null);
  const [selected, setSelected] = useState(["frontend"]);
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log(user);
  console.log(selected);
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
        <Textarea
          name="content"
          className="mx-auto border border-b-gray-800"
          placeholder="Post Content"
        />
        <TagsInput
          value={selected}
          onChange={setSelected}
          placeHolder="Post Category"
        />
        <input type="hidden" name="name" value={user?.name} />
        <input type="hidden" name="userId" value={user?.id} />
        <input type="hidden" name="tags" value={selected} />

        <Select name="published">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Publish State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Published</SelectItem>
            <SelectItem value="false">Not Published</SelectItem>
          </SelectContent>
        </Select>

        <Submit btnText={"Add Post"} className="w-2/3 mt-6" />
      </form>
    </div>
  );
}
