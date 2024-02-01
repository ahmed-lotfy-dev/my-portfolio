"use client";
import { useRef, useState } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { AddCertificateAction } from "@/src/app/actions";

import { Toaster } from "react-hot-toast";
import { notify } from "@/src/app/lib/utils/toast";

import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import Submit from "@/src/components/ui/formSubmitBtn";

import { Upload } from "@/src/components/ui/Upload";
import { Button } from "@/src/components/ui/button";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function AddCertificateComponent() {
  const [state, formAction] = useFormState(AddCertificateAction, null);
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const emailAddress = session?.user?.email;
  const router = useRouter();
  console.log(state);
  console.log(imageUrl);

  return (
    <div className="flex flex-col justify-center items-center w-full relative">
      <div className="pt-10 left-5 top-5 absolute">
        <Button onClick={() => router.back()}>
          <AiOutlineArrowLeft />
        </Button>
      </div>
      <div className="flex w-full min-h-full justify-center items-start p-10 mt-6">
        <form
          action={formAction}
          className="flex flex-col gap-5 justify-start items-center w-full text-black"
        >
          <Input
            className="w-2/3 mt-10"
            type="text"
            name="title"
            placeholder="Certificate Title"
          />
          <p className="text-sm text-red-400">
            {state?.error?.title && state?.error?.title?._errors[0]}
          </p>

          <Input
            className="w-2/3"
            type="text"
            name="desc"
            placeholder="Certificate Description"
          />
          <p className="text-sm text-red-400">
            {state?.error?.desc && state?.error?.desc?._errors[0]}
          </p>

          <Input
            className="w-2/3"
            type="url"
            name="courseLink"
            placeholder="Course Link"
          />
          <p className="text-sm text-red-400">
            {state?.error?.courseLink && state?.error?.courseLink?._errors[0]}
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
          <Input type="hidden" name="imageLink" value={imageUrl} />
          <Input type="hidden" name="emailAddress" value={emailAddress} />

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
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
