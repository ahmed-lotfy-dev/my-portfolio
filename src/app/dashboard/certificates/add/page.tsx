"use client";
import { useRef, useState } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { AddCertificateAction } from "@/src/app/actions";

import { notify } from "@/src/app/lib/utils/toast";

import { useFormState } from "react-dom";
import Submit from "@/src/components/ui/formSubmitBtn";

import { Upload } from "@/src/components/ui/Upload";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AddCertificateComponent() {
  const [state, formAction] = useFormState(AddCertificateAction, null);
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  
  return (
    <div className="flex flex-col justify-center items-center w-full relative">
      <div className="pt-10 left-5 top-5 absolute">
        <Button onClick={() => router.back()}>
          <ArrowLeft />
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
            {state?.error?.certTitle && state?.error?.certTitle?._errors[0]}
          </p>

          <Input
            className="w-2/3"
            type="text"
            name="desc"
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
          <Input type="hidden" name="imageLink" value={imageUrl} />
          <Submit
            btnText="Add Certificate"
            type="submit"
            onClick={() => {
              if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                notify("sorry you don't have admin priviliges", false);
              } else {
                notify("Adding Completed Successfully", true);
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}
