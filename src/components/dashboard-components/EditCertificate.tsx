"use client";
import { ChangeEvent, useRef, useState } from "react";

import { Input } from "@/src/components/ui/input";
import { EditCertificateAction } from "@/src/app/actions";
import Image from "next/image";
import { notify } from "@/src/app/lib/utils/toast";

import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";

import Submit from "@/src/components/ui/formSubmitBtn";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { Upload } from "../ui/Upload";
import { Textarea } from "../ui/textarea";
import { Pencil } from "lucide-react";

function EditCertificate({ EditedObject }: any) {
  const { id } = EditedObject;
  const [state, formAction] = useFormState(EditCertificateAction, null);
  const [editedCert, setEditedCert] = useState(EditedObject);
  const [imageUrl, setImageUrl] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const role = session?.user?.role;

  const InputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCert((prevEditedCert: any) => {
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
              name="title"
              placeholder="Certificate Title"
              value={editedCert.title}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.title && state?.error?.title?._errors[0]}
            </p>

            <Input
              className="w-2/3"
              name="desc"
              placeholder="Certificate Description"
              value={editedCert.desc}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.desc && state?.error?.desc?._errors[0]}
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
              name="certProfLink"
              placeholder="Certificate Proof"
              value={editedCert.profLink}
              onChange={InputHandler}
            />
            <p className="text-sm text-red-400">
              {state?.error?.profLink && state?.error?.profLink?._errors[0]}
            </p>

            <Upload setImageUrl={setImageUrl} imageType={"Certificates"} />
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

            <DialogClose>
              <Submit
                btnText="Edit Certificate"
                className="m-10"
                type="submit"
                onClick={() => {
                  if (role !== "ADMIN") {
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
  );
}

export { EditCertificate };
