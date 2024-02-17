"use client";
import { addNewPost } from "@/src/app/actions/postsActions";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-10">
      <h2>Add New Blog Post</h2>
      <form action={addNewPost}>
        <Input type="text" name="postTitle" />

        <Input type="text" name="postContent" />

        <Select name="published">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Publish State" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup id="published">
              <SelectItem value="true">published</SelectItem>
              <SelectItem value="false">unpublished</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input type="file" name="file" />

        <Input type="text" placeholder="Categories" name="categories" />
        <Submit btnText={"Add Post"} />
      </form>
    </div>
  );
};

export default page;
