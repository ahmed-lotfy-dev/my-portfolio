"use client";
import { useState, useRef, useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { addCertificateAction } from "@/src/app/actions/certificatesActions";
import { notify } from "@/src/lib/utils/toast";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Upload } from "@/src/components/dashboard-components/Upload";
import { authClient } from "@/src/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

function AddCertificateComponent() {
  const t = useTranslations("certificates");
  const [state, formAction] = useActionState(addCertificateAction, null);
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Form field states to preserve values on validation errors
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    courseLink: "",
    profLink: "",
    author: "",
    completedAt: "",
  });

  // ✅ show toast when server action finishes
  useEffect(() => {
    if (state?.success) {
      notify("Certificate added successfully!", true);
      setOpen(false);
      setImageUrl("");
      setFormData({ title: "", desc: "", courseLink: "", profLink: "", author: "", completedAt: "" });
      formRef.current?.reset();
    } else if (state?.message && !state?.success) {
      notify(state.message, false);
    } else if (state?.error && Object.keys(state.error).length > 0) {
      notify("Please fix the errors and try again.", false);
    }
  }, [state]);

  const inputClasses =
    "bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80";
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="flex justify-center items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 h-10 py-2 px-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("add-title")}
          </motion.button>
        </DialogTrigger>

        <DialogContent className="max-w-[700px] overflow-hidden p-0 bg-zinc-950 border-zinc-800 shadow-2xl sm:rounded-xl">
          <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="p-6 pb-4 sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10 border-b border-zinc-800">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {t("add-title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("add-desc")}
              </DialogDescription>
            </DialogHeader>

            <form
              ref={formRef}
              action={formAction}
              className="flex flex-col gap-6 p-6"
            >
              <div className="space-y-1">
                <Label htmlFor="title" className={labelClasses}>
                  {t("placeholders.title")}
                </Label>
                <Input
                  id="title"
                  className={inputClasses}
                  type="text"
                  name="title"
                  placeholder={t("placeholders.title")}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                {state?.error?.title && (
                  <p className="text-xs text-red-400 mt-1">
                    {state.error.title._errors[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="desc" className={labelClasses}>
                  {t("placeholders.description")}
                </Label>
                <Input
                  id="desc"
                  className={inputClasses}
                  type="text"
                  name="desc"
                  placeholder={t("placeholders.description")}
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  required
                />
                {state?.error?.desc && (
                  <p className="text-xs text-red-400 mt-1">
                    {state.error.desc._errors[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="author" className={labelClasses}>
                  {t("instructor")}
                </Label>
                <Input
                  id="author"
                  className={inputClasses}
                  type="text"
                  name="author"
                  placeholder={t("instructor")}
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
                {state?.error?.author && (
                  <p className="text-xs text-red-400 mt-1">
                    {state.error.author._errors[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="completedAt" className={labelClasses}>
                  {t("completed")}
                </Label>
                <Input
                  id="completedAt"
                  className={inputClasses}
                  type="date"
                  name="completedAt"
                  value={formData.completedAt}
                  onChange={(e) =>
                    setFormData({ ...formData, completedAt: e.target.value })
                  }
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
                    {t("placeholders.course_link")}
                  </Label>
                  <Input
                    id="courseLink"
                    className={inputClasses}
                    type="url"
                    name="courseLink"
                    placeholder={t("placeholders.course_link")}
                    value={formData.courseLink}
                    onChange={(e) =>
                      setFormData({ ...formData, courseLink: e.target.value })
                    }
                    required
                  />
                  {state?.error?.courseLink && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.courseLink._errors[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="profLink" className={labelClasses}>
                    {t("placeholders.proof_link")}
                  </Label>
                  <Input
                    id="profLink"
                    className={inputClasses}
                    type="url"
                    name="profLink"
                    placeholder={t("placeholders.proof_link")}
                    value={formData.profLink}
                    onChange={(e) =>
                      setFormData({ ...formData, profLink: e.target.value })
                    }
                    required
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
                    {state.error.imageLink._errors[0]}
                  </p>
                )}

                <AnimatePresence>
                  {imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative mt-4 rounded-lg overflow-hidden border border-white/10 shadow-lg w-full max-w-md mx-auto aspect-video"
                    >
                      <Image
                        src={imageUrl}
                        fill
                        className="object-cover"
                        alt="Certificate Preview"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Input type="hidden" name="imageLink" value={imageUrl} />
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Submit
                  btnText={t("add-title")}
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

export { AddCertificateComponent };
