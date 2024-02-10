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
import { AddCertificateAction } from "@/src/app/actions";

import { notify } from "@/src/app/lib/utils/toast";

import { useFormState } from "react-dom";
import Submit from "../../ui/formSubmitBtn";
import { Upload } from "../Upload";
import { useSession } from "next-auth/react";

function AddCertificateComponent() {
  const [state, formAction] = useFormState(AddCertificateAction, null);
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
            Add Certificate
          </DialogTrigger>
          <DialogContent className="max-w-[700px]">
            <form
              ref={formRef}
              action={formAction}
              className="flex flex-col gap-5 justify-start items-center w-full text-black"
            >
              <Input
                className="w-2/3 mt-10"
                type="text"
                name="certTitle"
                placeholder="Certificate Title"
              />
              <p className="text-sm text-red-400">
                {state?.error?.certTitle && state?.error?.certTitle?._errors[0]}
              </p>

              <Input
                className="w-2/3"
                type="text"
                name="certDesc"
                placeholder="Certificate Description"
              />
              <p className="text-sm text-red-400">
                {state?.error?.certDesc && state?.error?.certDesc?._errors[0]}
              </p>

              <Input
                className="w-2/3"
                type="url"
                name="courseLink"
                placeholder="Course Link"
              />
              <p className="text-sm text-red-400">
                {state?.error?.courseLink &&
                  state?.error?.courseLink?._errors[0]}
              </p>

              <Input
                className="w-2/3"
                type="url"
                name="profLink"
                placeholder="Certificate Proof"
              />
              <p className="text-sm text-red-400">
                {state?.error?.profLink && state?.error?.profLink?._errors[0]}
              </p>

              <Upload setImageUrl={setImageUrl} imageType={"Certificates"} />
              <p className="text-sm text-red-400">
                {state?.error?.certImageLink &&
                  state?.error?.certImageLink?._errors}
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
              <Input type="hidden" name="certImageLink" value={imageUrl} />

              <DialogClose asChild>
                <Submit
                  btnText="Add Certificate"
                  type="submit"
                  onClick={() => {
                    if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                      notify("sorry you don't have admin priviliges", false);
                    } else {
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

export { AddCertificateComponent };
