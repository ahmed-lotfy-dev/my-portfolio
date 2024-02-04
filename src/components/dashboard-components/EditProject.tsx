"use client";
import { ChangeEvent, useRef, useState } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { EditCertificateAction, EditProjectAction } from "@/src/app/actions";

import { notify } from "@/src/app/lib/utils/toast";

import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";

import Submit from "../ui/formSubmitBtn";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Project } from "@prisma/client";
import { AiTwotoneEdit } from "react-icons/ai";
import { Textarea } from "../ui/textarea";
import { TagsInput } from "react-tag-input-component";
import { DialogClose } from "@radix-ui/react-dialog";
import { Upload } from "../ui/Upload";

type EditProjectProp = {
  EditedObject: Project;
};

function EditProject({ EditedObject }: EditProjectProp) {
  const { id } = EditedObject;
  const [state, formAction] = useFormState(EditProjectAction, null);
  const [editedProj, setEditedProj] = useState(EditedObject);
  const [imageUrl, setImageUrl] = useState("");

  const [selected, setSelected] = useState<string[]>(["featured"]);
  console.log(id);

  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const emailAddress = session?.user.email;

  const InputHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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
          <DialogContent className="w-[700px]">
            <form
              action={formAction}
              className="flex flex-col justify-center items-center w-full gap-5 text-black "
            >
              <Input
                className="w-2/3"
                type="text"
                name="title"
                placeholder="Project Title"
                value={editedProj.title}
                onChange={InputHandler}
              />
              <p className="text-sm text-red-400">
                {state?.error?.title && state?.error?.title?._errors}
              </p>

              <Textarea
                className="flex justify-center w-2/3"
                name="desc"
                placeholder="Project Description"
                value={editedProj.desc}
                onChange={InputHandler}
              />
              <p className="text-sm text-red-400">
                {state?.error?.desc && state?.error?.desc?._errors}
              </p>

              <Input
                className="w-2/3"
                type="text"
                name="repoLink"
                placeholder="Project Repo Link"
                value={editedProj.repoLink}
                onChange={InputHandler}
              />
              <p className="text-sm text-red-400">
                {state?.error?.repoLink && state?.error?.repoLink?._errors}{" "}
              </p>

              <Input
                className="w-2/3"
                type="text"
                name="liveLink"
                placeholder="Project Live Link"
                value={editedProj.liveLink}
                onChange={InputHandler}
              />
              <p className="text-sm text-red-400">
                {state?.error?.liveLink && state?.error?.liveLink?._errors}
              </p>

              <Upload setImageUrl={setImageUrl} />
              <p className="text-sm text-red-400">
                {state?.error?.imageLink && state?.error?.imageLink?._errors}
              </p>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  width={300}
                  height={300}
                  alt="Certificate Image"
                />
              )}
              <Input type="hidden" name="tags" value={selected} />
              <Input type="hidden" name="imageLink" value={imageUrl} />
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
      </div>
    </div>
  );
}

export { EditProject };
