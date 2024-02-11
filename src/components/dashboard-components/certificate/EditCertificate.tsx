"use client";
import { ChangeEvent, useRef, useState } from "react";

import { Input } from "@/src/components/ui/input";
import { EditCertificateAction } from "@/src/app/actions";
import Image from "next/image";
import { notify } from "@/src/app/lib/utils/toast";

import { useFormState } from "react-dom";

import Submit from "@/src/components/ui/formSubmitBtn";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/src/components/ui/dialog";
import { Upload } from "../Upload";
import { Textarea } from "@/src/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";

function EditCertificate({ EditedObject }: any) {
  const { id } = EditedObject;
  const [state, formAction] = useFormState(EditCertificateAction, null);
  const [editedCert, setEditedCert] = useState(EditedObject);
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const role = session?.user?.role;
  console.log(role);
  const InputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCert((prevEditedCert: any) => {
      return {
        ...prevEditedCert,
        [name]: value,
      };
    });
  };
  console.log("from client", { imageUrl });
  return (
    <div
      key={editedCert.id}
      className="flex w-full min-h-full justify-center items-center mt-6"
    >
      <Dialog>
        <DialogTrigger className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
          <Pencil className="mr-3" size={20} />
          Edit Certificate
        </DialogTrigger>
        <DialogContent className="max-w-[700px]">
          <form
            action={formAction}
            className="flex flex-col gap-5 justify-center items-center w-full  bg-gray-100 text-black"
          >
            <Input
              className="w-2/3 mt-10"
              type="text"
              name="certTitle"
              placeholder="Certificate Title"
              value={editedCert.certTitle}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.certTitle && state?.error?.certTitle?._errors[0]}
            </p>

            <Input
              className="w-2/3"
              name="certDesc"
              placeholder="Certificate Description"
              value={editedCert.certDesc}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.certDesc && state?.error?.certDesc?._errors[0]}
            </p>

            <Input
              className="w-2/3"
              type="url"
              name="courseLink"
              placeholder="Course Link"
              value={editedCert.courseLink}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.courseLink && state?.error?.courseLink?._errors[0]}
            </p>

            <Input
              className="w-2/3"
              type="url"
              name="profLink"
              placeholder="Certificate Proof"
              value={editedCert.profLink}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.profLink && state?.error?.profLink?._errors[0]}
            </p>

            <Upload setImageUrl={setImageUrl} imageType={"Certificates"} />
            <p className="text-sm text-red-400">
              {state?.error?.certImageLink &&
                state?.error?.certImageLink?._errors}
            </p>
            {editedCert.certImageLink ? (
              <Image
                className="m-auto"
                src={editedCert.certImageLink}
                width={200}
                height={200}
                alt="Certificate Image"
              />
            ) : (
              <Image
                className="m-auto"
                src={imageUrl}
                width={200}
                height={200}
                alt="Certificate Image"
              />
            )}
            <Input type="hidden" name="id" value={editedCert.id} />
            <Input type="hidden" name="certImageLink" value={imageUrl} />

            <DialogClose asChild>
              <Submit
                btnText="Edit Certificate"
                className="m-10"
                type="submit"
                onClick={() => {
                  if (role !== "admin") {
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
  );
}

export { EditCertificate };
