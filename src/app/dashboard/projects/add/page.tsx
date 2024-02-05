"use client";
import { useState, useRef } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { AddProjectAction } from "@/src/app/actions";

import { notify } from "@/src/app/lib/utils/toast";

import { useSession } from "next-auth/react";

import { TagsInput } from "react-tag-input-component";

import { Textarea } from "@/src/components/ui/textarea";
import { useFormState } from "react-dom";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Upload } from "@/src/components/ui/Upload";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddProjectComponent() {
  const [state, formAction] = useFormState(AddProjectAction, null);
  const [selected, setSelected] = useState<string[]>(["featured"]);
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  console.log(role);
  return (
    <div className="flex flex-col justify-center items-center w-full relative">
      <div className="pt-10 left-5 top-5 absolute">
        <Button onClick={() => router.back()}>
          <AiOutlineArrowLeft />
        </Button>
      </div>
      <div className="flex w-full min-h-full justify-center items-start mt-6">
        <form
          action={formAction}
          className="flex flex-col justify-start items-center w-full gap-5 text-black "
        >
          <Input
            className="w-2/3 mt-10"
            type="text"
            name="title"
            placeholder="Project Title"
          />
          <p className="text-sm text-red-400">
            {state?.error?.title && state?.error?.title?._errors}
          </p>

          <Textarea
            className="flex justify-center w-2/3"
            name="desc"
            placeholder="Project Description"
          ></Textarea>
          <p className="text-sm text-red-400">
            {state?.error?.desc && state?.error?.desc?._errors}
          </p>

          <Input
            className="w-2/3"
            type="text"
            name="repoLink"
            placeholder="Project Repo Link"
          />
          <p className="text-sm text-red-400">
            {state?.error?.repoLink && state?.error?.repoLink?._errors}{" "}
          </p>

          <Input
            className="w-2/3"
            type="text"
            name="liveLink"
            placeholder="Project Live Link"
          />
          <p className="text-sm text-red-400">
            {state?.error?.liveLink && state?.error?.liveLink?._errors}
          </p>

          <Upload setImageUrl={setImageUrl} imageType="Projects" />
          <p className="text-sm text-red-400">
            {state?.error?.imageLink && state?.error?.imageLink?._errors}
          </p>
          {imageUrl && (
            <Image
              className="m-auto"
              src={imageUrl}
              width={300}
              height={300}
              alt="Certificate Image"
            />
          )}
          <Input type="hidden" name="imageLink" value={imageUrl} />
          <Input type="hidden" name="tags" value={selected} />

          <Label className="flex justify-center">Project Tags</Label>
          <TagsInput
            value={selected}
            onChange={setSelected}
            name="tags"
            placeHolder="Select Tech"
          />

          <Submit
            btnText="Add Project"
            type="submit"
            onClick={() => {
              if (role !== "ADMIN") {
                notify("You don't have privilige to do this", false);
              } else {
                notify("Blog Post Completed Successfully", true);
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}
