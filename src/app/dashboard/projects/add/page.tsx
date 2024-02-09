"use client";
import { useState, useRef } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { AddProjectAction } from "@/src/app/actions";

import { notify } from "@/src/app/lib/utils/toast";

import { TagsInput } from "react-tag-input-component";

import { Textarea } from "@/src/components/ui/textarea";
import { useFormState } from "react-dom";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Upload } from "@/src/components/ui/Upload";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function AddProjectComponent() {
  const [state, formAction] = useFormState(AddProjectAction, null);
  const [selected, setSelected] = useState<string[]>(["featured"]);
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { user } = useKindeBrowserClient();

  return (
    <div className="flex flex-col justify-center items-center w-full relative">
      <div className="pt-10 left-5 top-5 absolute">
        <Button onClick={() => router.back()}>
          <ArrowLeft />
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
            {state?.error?.projTitle && state?.error?.projTitle?._errors}
          </p>

          <Textarea
            className="flex justify-center w-2/3"
            name="desc"
            placeholder="Project Description"
          ></Textarea>
          <p className="text-sm text-red-400">
            {state?.error?.projDesc && state?.error?.projDesc?._errors}
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
            {state?.error?.projImageLink &&
              state?.error?.projImageLink?._errors}
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
              if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
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
