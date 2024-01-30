"use client";
import { useRef, useState } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { AddCertificateAction } from "@/src/app/actions";

import { Toaster } from "react-hot-toast";
import { notify } from "@/src/app/lib/utils/toast";

import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import Submit from "../ui/formSubmitBtn";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Upload } from "../ui/Upload";

function AddCertificateComponent() {
  const [state, formAction] = useFormState(AddCertificateAction, null);
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const emailAddress = session?.user.email;
  console.log(state);
  console.log(imageUrl);

  return (
    <div className="flex flex-col justify-center items-center pt-10">
      <div className="flex w-full min-h-full justify-center items-center mt-6">
        <Dialog>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
            Add Certificate
          </DialogTrigger>
          <DialogContent className="max-w-[700px]">
            <form
              action={formAction}
              className="flex flex-col gap-5 justify-start items-center w-full  bg-gray-100 text-black"
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
                name="certProfLink"
                placeholder="Certificate Proof"
              />
              <p className="text-sm text-red-400">
                {state?.error?.certProfLink &&
                  state?.error?.certProfLink?._errors[0]}
              </p>

              <Upload setImageUrl={setImageUrl} />
              <p className="text-sm text-red-400">
                {state?.error?.certImageLink &&
                  state?.error?.certImageLink?._errors}
              </p>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  width={300}
                  height={300}
                  alt="Certificate Image"
                />
              )}
              <Input type="hidden" name="certImageLink" value={imageUrl} />
              <Input type="hidden" name="emailAddress" value={emailAddress} />

              <DialogClose>
                <Submit
                  btnText="Add Certificate"
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
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
export { AddCertificateComponent };
