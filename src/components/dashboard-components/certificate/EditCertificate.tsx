"use client";
import { ChangeEvent, useRef, useState, useActionState, useEffect } from "react";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { editCertificateAction } from "@/src/app/actions/certificatesActions";
import Image from "next/image";
import { notify } from "@/src/lib/utils/toast";

import Submit from "@/src/components/ui/formSubmitBtn";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Upload } from "../Upload";
import { Pencil, X } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useRouter } from "next/navigation";

function EditCertificate({ EditedObject }: any) {
  const { id } = EditedObject;
  const [state, formAction] = useActionState(editCertificateAction, null);
  const [editedCert, setEditedCert] = useState(EditedObject);
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      notify("Certificate updated successfully!", true);
      setOpen(false);
      setImageUrl("");
      router.refresh();
    } else if (state?.message && !state?.success) {
      notify(state.message, false);
    } else if (state?.error && Object.keys(state.error).length > 0) {
      notify("Please fix the errors and try again.", false);
    }
  }, [state, router]);

  const InputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCert((prevEditedCert: any) => {
      return {
        ...prevEditedCert,
        [name]: value,
      };
    });
  };

  const inputClasses =
    "bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80";
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div key={editedCert.id} className="flex justify-center items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Pencil size={16} />
          </motion.button>
        </DialogTrigger>
        <DialogClose ref={closeButtonRef} className="hidden" />

        <DialogContent className="max-w-[700px] overflow-hidden p-0 bg-zinc-950 border-zinc-800 shadow-2xl sm:rounded-xl">
          <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="p-6 pb-4 sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10 border-b border-zinc-800">
              <DialogTitle className="text-2xl font-bold text-foreground">
                Edit Certificate
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update certificate details
              </DialogDescription>
            </DialogHeader>

            <form
              action={formAction}
              ref={formRef}
              className="flex flex-col gap-6 p-6"
            >
              <div className="space-y-1">
                <Label htmlFor="title" className={labelClasses}>
                  Certificate Title
                </Label>
                <Input
                  id="title"
                  className={inputClasses}
                  type="text"
                  name="title"
                  placeholder="Certificate Title"
                  value={editedCert.title}
                  onChange={InputHandler}
                />
                {state?.error?.title && (
                  <p className="text-xs text-red-400 mt-1">
                    {state.error.title._errors[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="desc" className={labelClasses}>
                  Description
                </Label>
                <Input
                  id="desc"
                  className={inputClasses}
                  name="desc"
                  placeholder="Certificate Description"
                  value={editedCert.desc}
                  onChange={InputHandler}
                />
                {state?.error?.desc && (
                  <p className="text-xs text-red-400 mt-1">
                    {state.error.desc._errors[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="completedAt" className={labelClasses}>
                  Completion Date
                </Label>
                <Input
                  id="completedAt"
                  className={inputClasses}
                  type="date"
                  name="completedAt"
                  value={
                    editedCert.completedAt
                      ? new Date(editedCert.completedAt).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={InputHandler}
                />
                {state?.error?.completedAt && (
                  <p className="text-xs text-red-400 mt-1">
                    {state.error.completedAt._errors[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label htmlFor="courseLink" className={labelClasses}>
                    Course Link
                  </Label>
                  <Input
                    id="courseLink"
                    className={inputClasses}
                    type="url"
                    name="courseLink"
                    placeholder="Course Link"
                    value={editedCert.courseLink}
                    onChange={InputHandler}
                  />
                  {state?.error?.courseLink && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.courseLink._errors[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="profLink" className={labelClasses}>
                    Proof Link
                  </Label>
                  <Input
                    id="profLink"
                    className={inputClasses}
                    type="url"
                    name="profLink"
                    placeholder="Certificate Proof"
                    value={editedCert.profLink}
                    onChange={InputHandler}
                  />
                  {state?.error?.profLink && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.profLink._errors[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
                <Label className={labelClasses}>Certificate Image</Label>
                <Upload setImageUrl={setImageUrl} imageType={"Certificates"} />
                {state?.error?.imageLink && (
                  <p className="text-xs text-red-400 mt-1">
                    {state.error.imageLink._errors}
                  </p>
                )}

                <AnimatePresence>
                  {(editedCert.imageLink || imageUrl) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative mt-4 rounded-lg overflow-hidden border border-white/10 shadow-lg w-full max-w-md mx-auto aspect-video"
                    >
                      <Image
                        src={imageUrl || editedCert.imageLink}
                        fill
                        className="object-cover"
                        alt="Certificate Preview"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Input type="hidden" name="id" value={editedCert.id} />
                <Input
                  type="hidden"
                  name="imageLink"
                  value={imageUrl || editedCert.imageLink}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Submit
                  btnText="Edit Certificate"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-md shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-105"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { EditCertificate };
