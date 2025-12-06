"use client";
import { ChangeEvent, useRef, useState, FormEvent } from "react";

import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { editProjectAction } from "@/src/app/actions/projectsActions";
import { notify } from "@/src/lib/utils/toast";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Switch } from "@/src/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Upload } from "../Upload";
import { Pencil, X } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

function EditProject({ EditedObject }: any) {
  const t = useTranslations("projects");
  const { id } = EditedObject;
  const [editedProj, setEditedProj] = useState(EditedObject);
  const [imageUrl, setImageUrl] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const InputHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProj((prevEditedProj: any) => {
      // Special handling for categories field
      if (name === "categories") {
        return {
          ...prevEditedProj,
          [name]: value.split(",").map((cat) => cat.trim()),
        };
      }
      return {
        ...prevEditedProj,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await editProjectAction(editedProj, formData);

    if (result?.success) {
      notify("Project updated successfully!", true);
      closeButtonRef.current?.click(); // Close dialog using ref
    } else if (result?.message) {
      notify(result.message, false);
    }
  };

  const inputClasses =
    "bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80";
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="flex justify-center items-center">
      <Dialog>
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

        <DialogContent className="max-w-[800px] overflow-hidden p-0 bg-zinc-950 border-zinc-800 shadow-2xl sm:rounded-xl">
          <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="p-6 pb-4 sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10 border-b border-zinc-800">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {t("edit-title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("edit-desc")}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              ref={formRef}
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
                    placeholder="Project Title (EN)"
                    value={editedProj.title_en}
                    onChange={InputHandler}
                  />
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
                    placeholder="Project Title (AR)"
                    value={editedProj.title_ar}
                    onChange={InputHandler}
                    dir="rtl"
                  />
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
                    placeholder="Project Description (EN)"
                    value={editedProj.desc_en}
                    onChange={InputHandler}
                  />
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
                    placeholder="Project Description (AR)"
                    value={editedProj.desc_ar}
                    onChange={InputHandler}
                    dir="rtl"
                  />
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
                    placeholder="Project Repo Link"
                    value={editedProj.repoLink}
                    onChange={InputHandler}
                  />
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
                    placeholder="Project Live Link"
                    value={editedProj.liveLink}
                    onChange={InputHandler}
                  />
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
                    value={
                      Array.isArray(editedProj.categories)
                        ? editedProj.categories.join(", ")
                        : editedProj.categories || ""
                    }
                    onChange={InputHandler}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("placeholders.categories_helper")}
                  </p>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2 space-y-2 p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
                  <Label className={labelClasses}>Project Image</Label>
                  <Upload
                    setImageUrl={setImageUrl}
                    imageType="Projects"
                    currentImageUrl={editedProj.imageLink}
                  />

                  <AnimatePresence>
                    {(editedProj.imageLink || imageUrl) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative mt-4 rounded-lg overflow-hidden border border-white/10 shadow-lg w-full max-w-md mx-auto aspect-video"
                      >
                        <Image
                          src={imageUrl || editedProj.imageLink}
                          fill
                          className="object-cover"
                          alt="Project Preview"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Input type="hidden" name="id" value={editedProj.id} />
                  <Input
                    type="hidden"
                    name="imageLink"
                    value={imageUrl || editedProj.imageLink}
                  />
                </div>

                {/* Published Toggle */}
                <div className="md:col-span-2 flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="published-edit"
                      className="text-base font-medium"
                    >
                      {t("publish_toggle")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("publish_toggle_desc")}
                    </p>
                  </div>
                  <Switch
                    id="published-edit"
                    checked={editedProj.published !== false}
                    onCheckedChange={(checked) =>
                      setEditedProj({ ...editedProj, published: checked })
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                  <input
                    type="hidden"
                    name="published"
                    value={editedProj.published !== false ? "true" : "false"}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Submit
                  btnText="Edit Project"
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

export { EditProject };
