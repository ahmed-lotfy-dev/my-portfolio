"use client";
import { ChangeEvent, useRef, useState } from "react";

import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { EditCertificateAction, EditProjectAction } from "@/src/app/actions";

import { Toaster } from "react-hot-toast";
import { notify } from "../../lib/utils/toast";

import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";

import Submit from "../ui/formSubmitBtn";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Project } from "@prisma/client";
import { AiTwotoneEdit } from "react-icons/ai";
import { Textarea } from "../ui/textarea";
import { TagsInput } from "react-tag-input-component";
import { DialogClose } from "@radix-ui/react-dialog";

type EditProjectProp = {
  EditedObject: Project;
};

function EditProject({ EditedObject }: EditProjectProp) {
  const { id } = EditedObject;
  const [state, formAction] = useFormState(EditProjectAction, null);
  const [editedProj, setEditedProj] = useState(EditedObject);
  const [selected, setSelected] = useState<string[]>(["featured"]);
  console.log(id);

  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const emailAddress = session?.user.email;

  const InputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setEditedProj((prevEditedProj) => {
      return {
        ...prevEditedProj,
        [name]: value,
      };
    });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full min-h-full justify-center items-start mt-6">
        <Dialog>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
            <AiTwotoneEdit className="mr-3" size={20} />
            Edit Project
          </DialogTrigger>
          <DialogContent className="w-[500px]">
            <form
              action={formAction}
              className="flex flex-col justify-center items-center w-full gap-5 text-black "
            >
              <Label className="mt-5 flex justify-center" htmlFor="projTitle">
                Project Title
              </Label>
              <Input className="w-2/3" type="text" name="projTitle" />
              <p className="text-sm text-red-400">
                {state?.error?.projTitle && state?.error?.projTitle?._errors}
              </p>

              <Textarea
                className="flex justify-center w-2/3"
                name="projDesc"
              ></Textarea>
              <p className="text-sm text-red-400">
                {state?.error?.projDesc && state?.error?.projDesc?._errors}
              </p>

              <Label className="flex justify-center" htmlFor="projRepoLink">
                Project Repo Link
              </Label>
              <Input className="w-2/3" type="text" name="projRepoLink" />
              <p className="text-sm text-red-400">
                {state?.error?.projRepoLink &&
                  state?.error?.projRepoLink?._errors}{" "}
              </p>

              <Label className="flex justify-center" htmlFor="projLiveLink">
                Project Live Link
              </Label>
              <Input className="w-2/3" type="text" name="projLiveLink" />
              <p className="text-sm text-red-400">
                {state?.error?.projLiveLink &&
                  state?.error?.projLiveLink?._errors}
              </p>

              <Label htmlFor="picture">Project Image</Label>
              <Input className="w-2/3" type="file" name="projImageLink" />
              <p className="text-sm text-red-400">
                {state?.error?.projImageLink &&
                  state?.error?.projImageLink?._errors}
              </p>

              <Input type="hidden" name="tags" value={selected} />
              <Input type="hidden" name="emailAddress" value={emailAddress} />

              <Label className="flex justify-center">Project Tags</Label>
              <TagsInput
                value={selected}
                onChange={setSelected}
                name="tags"
                placeHolder="Select Tech"
              />
              <DialogClose>
                <Submit
                  btnText="Edit Project"
                  className="m-10 w-2/3"
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
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export { EditProject };
