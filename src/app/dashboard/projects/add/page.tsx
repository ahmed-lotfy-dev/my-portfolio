"use client";
import { useState, useRef } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { AddProjectAction } from "@/src/app/actions";

import { Toaster } from "react-hot-toast";
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
  const emailAddress = session?.user?.email;
  const router = useRouter();

  console.log(state);
  console.log(imageUrl);

  return (
    <div className="flex flex-col justify-center items-center pt-10 w-full relative">
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
            name="projTitle"
            placeholder="Project Title"
          />
          <p className="text-sm text-red-400">
            {state?.error?.projTitle && state?.error?.projTitle?._errors}
          </p>

          <Textarea
            className="flex justify-center w-2/3"
            name="projDesc"
            placeholder="Project Description"
          ></Textarea>
          <p className="text-sm text-red-400">
            {state?.error?.projDesc && state?.error?.projDesc?._errors}
          </p>

          <Input
            className="w-2/3"
            type="text"
            name="projRepoLink"
            placeholder="Project Repo Link"
          />
          <p className="text-sm text-red-400">
            {state?.error?.projRepoLink && state?.error?.projRepoLink?._errors}{" "}
          </p>

          <Input
            className="w-2/3"
            type="text"
            name="projLiveLink"
            placeholder="Project Live Link"
          />
          <p className="text-sm text-red-400">
            {state?.error?.projLiveLink && state?.error?.projLiveLink?._errors}
          </p>

          <Upload setImageUrl={setImageUrl} />
          <p className="text-sm text-red-400">
            {state?.error?.projImageLink &&
              state?.error?.projImageLink?._errors}
          </p>
          {imageUrl && (
            <Image
              src={imageUrl}
              width={300}
              height={300}
              alt="Certificate Image"
            />
          )}
          <Input type="hidden" name="projImageLink" value={imageUrl} />
          <Input type="hidden" name="tags" value={selected} />
          <Input type="hidden" name="emailAddress" value={emailAddress} />

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
              if (emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                console.log(emailAddress);
                notify("Sorry, you don't have admin privileges", false);
              } else {
                notify("Adding Completed Successfully", true);
                formRef.current?.reset();
              }
            }}
          />
        </form>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
