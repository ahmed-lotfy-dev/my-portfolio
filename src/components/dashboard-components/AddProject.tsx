"use client";
import { useState, useRef } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { AddProjectAction } from "@/src/app/actions";

import { notify } from "@/src/app/lib/utils/toast";

import { TagsInput } from "react-tag-input-component";

import { Textarea } from "../ui/textarea";
import { useFormState } from "react-dom";
import Submit from "../ui/formSubmitBtn";
import { Upload } from "../ui/Upload";
import { useSession } from "next-auth/react";

function AddProjectComponent() {
  const [state, formAction] = useFormState(AddProjectAction, null);
  const [selected, setSelected] = useState<string[]>(["featured"]);
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full min-h-full justify-center items-start mt-6">
        <Dialog>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
            Add Project
          </DialogTrigger>
          <DialogContent className="max-w-[700px]">
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

              <DialogClose asChild>
                <Submit
                  btnText="Add Project"
                  type="submit"
                  onClick={() => {
                    if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                      notify("You don't have privilige to do this", false);
                      const submitTimeOut = setTimeout(() => {
                        notify("Adding Completed Successfully", true);
                        setImageUrl("");
                        formRef.current?.reset();
                      }, 200);
                      clearTimeout(submitTimeOut);
                    }
                  }}
                />
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export { AddProjectComponent };
