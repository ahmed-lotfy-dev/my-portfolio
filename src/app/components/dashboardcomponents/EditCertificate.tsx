"use client";
import { ChangeEvent, useRef, useState } from "react";

import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { EditCertificateAction } from "@/src/app/actions";

import { Toaster } from "react-hot-toast";
import { notify } from "../../lib/utils/toast";

import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";

import Submit from "../ui/formSubmitBtn";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Certificate, Project } from "@prisma/client";
import { AiTwotoneEdit } from "react-icons/ai";
import { DialogClose } from "@radix-ui/react-dialog";

type EditCertificateProp = {
  EditedObject: Certificate;
};

function EditCertificate({ EditedObject }: EditCertificateProp) {
  const { id } = EditedObject;
  const [state, formAction] = useFormState(EditCertificateAction, null);
  const [editedCert, setEditedCert] = useState(EditedObject);

  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const emailAddress = session?.user.email;

  const InputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCert((prevEditedCert) => {
      return {
        ...prevEditedCert,
        [name]: value,
      };
    });
  };

  return (
    <div
      key={id}
      className="flex w-full min-h-full justify-center items-center mt-6"
    >
      <Dialog>
        <DialogTrigger className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
          <AiTwotoneEdit className="mr-3" size={20} />
          Edit Certificate
        </DialogTrigger>
        <DialogContent className="w-[500px]">
          <form
            action={formAction}
            className="flex flex-col gap-5 justify-center items-center w-full  bg-gray-100 text-black"
          >
            <Label className="mt-5 flex justify-center" htmlFor="certTitle">
              Certificate Title
            </Label>
            <Input
              className="w-2/3"
              type="text"
              name="certTitle"
              value={editedCert.certTitle}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.certTitle && state?.error?.certTitle?._errors[0]}
            </p>

            <Label className="flex justify-center" htmlFor="certDesc">
              Certificate Description
            </Label>
            <Input
              className="w-2/3"
              type="text"
              name="certDesc"
              value={editedCert.certDesc}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.certDesc && state?.error?.certDesc?._errors[0]}
            </p>

            <Label className="flex justify-center" htmlFor="courseLink">
              Course Link
            </Label>
            <Input
              className="w-2/3"
              type="url"
              name="courseLink"
              value={editedCert.courseLink}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.courseLink && state?.error?.courseLink?._errors[0]}
            </p>

            <Label className="flex justify-center" htmlFor="certProfLink">
              Certificate Proof
            </Label>
            <Input
              className="w-2/3"
              type="url"
              name="certProfLink"
              value={editedCert.certProfLink}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.certProfLink &&
                state?.error?.certProfLink?._errors[0]}
            </p>

            <Label htmlFor="picture">Certificate Image</Label>
            <Input
              className="w-2/3"
              type="file"
              name="certImageLink"
              onChange={InputHandler}
            />

            <Input type="hidden" name="emailAddress" value={emailAddress} />
            <Input type="hidden" name="id" value={editedCert.id} />
            <DialogClose>
              <Submit
                btnText="Edit Certificate"
                className="m-10"
                type="submit"
                onClick={() => {
                  if (emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                    console.log(emailAddress);
                    notify("sorry you don't have admin priviliges", false);
                  } else {
                    notify("Adding Completed Successfully", true);
                  }
                }}
              />
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { EditCertificate };
