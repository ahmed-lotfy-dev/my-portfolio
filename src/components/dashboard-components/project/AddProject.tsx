"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Upload } from "../Upload";
import { notify } from "@/src/lib/utils/toast";
import { authClient } from "@/src/lib/auth-client";
import { useActionState } from "react";
import { addProjectAction } from "@/src/app/actions/projectsActions";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

function AddProjectComponent() {
  const [state, formAction] = useActionState(addProjectAction, null);
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const t = useTranslations("projects");

  // Form field states to preserve values on validation errors
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    desc_en: "",
    desc_ar: "",
    repoLink: "",
    liveLink: "",
    categories: "",
    published: true,
  });

  // ✅ Automatically close dialog & reset form on success
  useEffect(() => {
    if (state?.success) {
      notify("Project added successfully!", true);
      setOpen(false);
      setImageUrl("");
      setFormData({
        title_en: "",
        title_ar: "",
        desc_en: "",
        desc_ar: "",
        repoLink: "",
        liveLink: "",
        categories: "",
        published: true,
      });
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

        <DialogContent className="max-w-[800px] overflow-hidden p-0 bg-zinc-950 border-zinc-800 shadow-2xl sm:rounded-xl">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Title */}
                <div className="space-y-1">
                  <Label htmlFor="title_en" className={labelClasses}>
                    Title (English)
                  </Label>
                  <Input
                    id="title_en"
                    className={inputClasses}
                    type="text"
                    name="title_en"
                    placeholder={t("placeholders.title_en")}
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                  />
                  {state?.error?.title_en && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.title_en._errors}
                    </p>
                  )}
                </div>

                {/* Arabic Title */}
                <div className="space-y-1">
                  <Label htmlFor="title_ar" className={labelClasses}>
                    Title (Arabic)
                  </Label>
                  <Input
                    id="title_ar"
                    className={inputClasses}
                    type="text"
                    name="title_ar"
                    placeholder={t("placeholders.title_ar")}
                    value={formData.title_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, title_ar: e.target.value })
                    }
                    dir="rtl"
                  />
                  {state?.error?.title_ar && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.title_ar._errors}
                    </p>
                  )}
                </div>

                {/* English Description */}
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="desc_en" className={labelClasses}>
                    Description (English)
                  </Label>
                  <Textarea
                    id="desc_en"
                    className={cn(inputClasses, "min-h-[100px]")}
                    name="desc_en"
                    placeholder={t("placeholders.desc_en")}
                    value={formData.desc_en}
                    onChange={(e) =>
                      setFormData({ ...formData, desc_en: e.target.value })
                    }
                  />
                  {state?.error?.desc_en && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.desc_en._errors}
                    </p>
                  )}
                </div>

                {/* Arabic Description */}
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="desc_ar" className={labelClasses}>
                    Description (Arabic)
                  </Label>
                  <Textarea
                    id="desc_ar"
                    className={cn(inputClasses, "min-h-[100px]")}
                    name="desc_ar"
                    placeholder={t("placeholders.desc_ar")}
                    value={formData.desc_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, desc_ar: e.target.value })
                    }
                    dir="rtl"
                  />
                  {state?.error?.desc_ar && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.desc_ar._errors}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-1">
                  <Label htmlFor="repoLink" className={labelClasses}>
                    Repository Link
                  </Label>
                  <Input
                    id="repoLink"
                    className={inputClasses}
                    type="text"
                    name="repoLink"
                    placeholder={t("placeholders.repo_link")}
                    value={formData.repoLink}
                    onChange={(e) =>
                      setFormData({ ...formData, repoLink: e.target.value })
                    }
                  />
                  {state?.error?.repoLink && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.repoLink._errors}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="liveLink" className={labelClasses}>
                    Live Demo Link
                  </Label>
                  <Input
                    id="liveLink"
                    className={inputClasses}
                    type="text"
                    name="liveLink"
                    placeholder={t("placeholders.live_link")}
                    value={formData.liveLink}
                    onChange={(e) =>
                      setFormData({ ...formData, liveLink: e.target.value })
                    }
                  />
                  {state?.error?.liveLink && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.liveLink._errors}
                    </p>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="categories" className={labelClasses}>
                    {t("placeholders.categories")}
                  </Label>
                  <Input
                    id="categories"
                    className={inputClasses}
                    type="text"
                    name="categories"
                    placeholder={t("placeholders.categories")}
                    value={formData.categories}
                    onChange={(e) =>
                      setFormData({ ...formData, categories: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("placeholders.categories_helper")}
                  </p>
                  {state?.error?.categories && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.categories._errors}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2 space-y-2 p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
                  <Label className={labelClasses}>Project Image</Label>
                  <Upload setImageUrl={setImageUrl} imageType="Projects" />
                  {state?.error?.imageLink && (
                    <p className="text-xs text-red-400 mt-1">
                      {state.error.imageLink._errors}
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
                          alt="Project Preview"
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

                {/* Published Toggle */}
                <div className="md:col-span-2 flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="published"
                      className="text-base font-medium"
                    >
                      {t("publish_toggle")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("publish_toggle_desc")}
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                  <input
                    type="hidden"
                    name="published"
                    value={formData.published ? "true" : "false"}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Submit
                  btnText={t("add-title")}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105"
                  type="submit"
                  disabled={!user?.email}
                />
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { AddProjectComponent };
