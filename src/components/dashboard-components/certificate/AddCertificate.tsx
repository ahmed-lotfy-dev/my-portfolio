"use client";
import { useState, useRef, useActionState, useEffect } from "react";
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
import { useTranslations } from "next-intl";
import { Input } from "@/src/components/ui/input";
import { addCertificateAction } from "@/src/app/actions/certificatesActions";
import { notify } from "@/src/lib/utils/toast";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Upload } from "@/src/components/dashboard-components/Upload";
import { authClient } from "@/src/lib/auth-client";

function AddCertificateComponent() {
  const t = useTranslations("certificates");
  const [state, formAction] = useActionState(addCertificateAction, null);
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // ✅ show toast when server action finishes
  useEffect(() => {
    if (state?.success) {
      notify("Certificate added successfully!", true);
      setImageUrl("");
      formRef.current?.reset();
    } else if (state?.message && !state?.success) {
      notify(state.message, false);
    }
  }, [state]);

  console.log("Server action result:", state);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full min-h-full justify-center items-start mt-6">
        <Dialog>
          <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
            {t("add-title")}
          </DialogTrigger>
          <DialogContent className="max-w-[700px] overflow-y-auto max-h-[calc(100vh-100px)]">
            <DialogHeader>
              <DialogTitle>{t("add-title")}</DialogTitle>
              <DialogDescription>{t("add-desc")}</DialogDescription>
            </DialogHeader>
            <form
              ref={formRef}
              action={formAction}
              className="flex flex-col gap-5 justify-start items-center w-full text-black dark:text-white"
            >
              <Input
                className="w-2/3 mt-10"
                type="text"
                name="title"
                placeholder={t("placeholders.title")}
                required
              />
              <p className="text-sm text-red-400">
                {state?.error?.title && state?.error?.title?._errors[0]}
              </p>

              <Input
                className="w-2/3"
                type="text"
                name="desc"
                placeholder={t("placeholders.description")}
                required
              />
              <p className="text-sm text-red-400">
                {state?.error?.desc && state?.error?.desc?._errors[0]}
              </p>

              <Input
                className="w-2/3"
                type="url"
                name="courseLink"
                placeholder={t("placeholders.course_link")}
                required
              />
              <p className="text-sm text-red-400">
                {state?.error?.courseLink &&
                  state?.error?.courseLink?._errors[0]}
              </p>

              <Input
                className="w-2/3"
                type="url"
                name="profLink"
                placeholder={t("placeholders.proof_link")}
                required
              />
              <p className="text-sm text-red-400">
                {state?.error?.profLink && state?.error?.profLink?._errors[0]}
              </p>

              <Upload setImageUrl={setImageUrl} imageType={"Certificates"} />
              <p className="text-sm text-red-400">
                {state?.error?.imageLink && state?.error?.imageLink?._errors[0]}
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

              <DialogClose asChild>
                <Submit
                  btnText={t("add-title")}
                  className="m-10"
                  type="submit"
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
