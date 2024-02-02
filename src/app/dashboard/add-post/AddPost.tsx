"use client";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Submit from "@/src/components/ui/formSubmitBtn";
import { useFormState } from "react-dom";
import { AddNewPost } from "../../actions";

export default function AddPost() {
  const [state, formAction] = useFormState(AddNewPost, null);
  const [selected, setSelected] = useState(["papaya"]);

  return (
    <div className="w-full h-svh flex flex-col justify-start items-center text-center mt-10 gap-5">
      <h2 className="mb-3">Add New Post</h2>
      <form action={formAction} className="w-1/3 flex flex-col gap-5">
        <Input
          type="text"
          name="title"
          placeholder="Post Title"
          className="w-2/3 mx-auto"
        />
        <Textarea
          name="content"
          className="w-2/3 mx-auto border border-b-gray-800"
          placeholder="Post Content"
        />
        <Tags />
        <Submit btnText={"Add Post"} />
      </form>
    </div>
  );
}
