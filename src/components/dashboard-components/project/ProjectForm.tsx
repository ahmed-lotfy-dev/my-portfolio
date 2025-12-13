"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import Submit from "@/src/components/ui/formSubmitBtn";
import { Upload } from "../Upload";
import { notify } from "@/src/lib/utils/toast";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Image as ImageIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
  initialData?: any;
  action: any;
  mode: "create" | "edit";
}

export default function ProjectForm({
  initialData,
  action,
  mode,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, null as any);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialData?.imageLink || "");
  const [titleEn, setTitleEn] = useState(initialData?.title_en || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugEdited, setIsSlugEdited] = useState(mode === "edit");
  const t = useTranslations("projects");
  const [helperImageUrl, setHelperImageUrl] = useState("");

  useEffect(() => {
    if (state && "success" in state && state.success) {
      notify(state.message, true);
      router.push("/dashboard/projects");
      router.refresh();
    } else if (state?.message) {
      notify(state.message, false);
    }
  }, [state, router]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleEn(val);
    if (!isSlugEdited) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugEdited(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    notify("Copied to clipboard!", true);
  };

  const inputClasses =
    "bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80";
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-card/30 border border-border/50 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {mode === "create" ? t("add-title") : t("edit-title")}
        </h1>
        <p className="text-muted-foreground">
          {mode === "create" ? t("add-desc") : t("edit-desc")}
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-8">
        {mode === "edit" && <input type="hidden" name="id" value={initialData.id} />}

        {/* Basic Info Section */}
        <div className="space-y-6 p-6 rounded-xl bg-background/40 border border-border/50">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="title_en" className={labelClasses}>
                Title (English)
              </Label>
              <Input
                id="title_en"
                className={inputClasses}
                type="text"
                name="title_en"
                value={titleEn}
                onChange={handleTitleChange}
                placeholder="Project Title"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="title_ar" className={labelClasses}>
                Title (Arabic)
              </Label>
              <Input
                id="title_ar"
                className={inputClasses}
                type="text"
                name="title_ar"
                defaultValue={initialData?.title_ar || ""}
                dir="rtl"
                placeholder="Arabic Title"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="slug" className={labelClasses}>
                Slug (URL Identifier) - unique
              </Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  className={inputClasses}
                  type="text"
                  name="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. self-tracker"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const generated = titleEn.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
                    setSlug(generated);
                    setIsSlugEdited(true);
                  }}
                  title="Regenerate from Title"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Used for the case study URL: /projects/{slug || '...'}</p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="desc_en" className={labelClasses}>
                Short Description (English)
              </Label>
              <Textarea
                id="desc_en"
                className={cn(inputClasses, "min-h-[80px]")}
                name="desc_en"
                defaultValue={initialData?.desc_en || ""}
                placeholder="Brief summary for the card..."
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="desc_ar" className={labelClasses}>
                Short Description (Arabic)
              </Label>
              <Textarea
                id="desc_ar"
                className={cn(inputClasses, "min-h-[80px]")}
                name="desc_ar"
                defaultValue={initialData?.desc_ar || ""}
                dir="rtl"
                placeholder="Arabic summary..."
              />
            </div>
          </div>
        </div>

        {/* Case Study Content Section */}
        <div className="space-y-6 p-6 rounded-xl bg-background/40 border border-border/50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Case Study Content (Markdown)</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              <ImageIcon size={14} />
              <span>Image Helper</span>
              <div className="w-[1px] h-4 bg-border mx-1" />
              <div className="w-24 relative overflow-hidden">
                <Upload
                  setImageUrl={(url) => {
                    setHelperImageUrl(url);
                    copyToClipboard(`![Image](${url})`);
                  }}
                  imageType="Blogs"
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none">Upload</span>
              </div>
            </div>
          </div>

          {/* Image Helper Result */}
          <AnimatePresence>
            {helperImageUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <code className="text-xs text-green-400 truncate flex-1 mr-4">![Image]({helperImageUrl})</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                  onClick={() => setHelperImageUrl("")}
                  type="button"
                >
                  <X size={14} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <Label htmlFor="content_en" className={labelClasses}>
                Content (English)
              </Label>
              <Textarea
                id="content_en"
                className={cn(inputClasses, "min-h-[400px] font-mono text-sm leading-relaxed")}
                name="content_en"
                defaultValue={initialData?.content_en || ""}
                placeholder="# The Challenge&#10;Describe the problem...&#10;&#10;# The Solution&#10;How you solved it..."
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="content_ar" className={labelClasses}>
                Content (Arabic)
              </Label>
              <Textarea
                id="content_ar"
                className={cn(inputClasses, "min-h-[400px] font-mono text-sm leading-relaxed")}
                name="content_ar"
                defaultValue={initialData?.content_ar || ""}
                dir="rtl"
                placeholder="Arabic content..."
              />
            </div>
          </div>
        </div>

        {/* Media & Meta */}
        <div className="space-y-6 p-6 rounded-xl bg-background/40 border border-border/50">
          <h2 className="text-xl font-semibold">Media & Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="categories" className={labelClasses}>
                Categories (comma separated)
              </Label>
              <Input
                id="categories"
                className={inputClasses}
                type="text"
                name="categories"
                defaultValue={
                  Array.isArray(initialData?.categories)
                    ? initialData.categories.join(", ")
                    : initialData?.categories || ""
                }
                placeholder="React, Next.js, TypeScript"
              />
            </div>

            <div className="space-y-1">
              {/* Toggle Published */}
              <div className="flex items-center justify-between h-10 px-4 rounded-md border border-white/10 bg-white/5">
                <Label htmlFor="published" className="cursor-pointer">Published</Label>
                <Switch
                  id="published"
                  name="published"
                  defaultChecked={initialData?.published !== false}
                  value="true"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="repoLink" className={labelClasses}>Repo Link</Label>
              <Input
                id="repoLink"
                className={inputClasses}
                name="repoLink"
                defaultValue={initialData?.repoLink || ""}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="liveLink" className={labelClasses}>Live Link</Label>
              <Input
                id="liveLink"
                className={inputClasses}
                name="liveLink"
                defaultValue={initialData?.liveLink || ""}
              />
            </div>

            {/* Main Image */}
            <div className="md:col-span-2 space-y-2">
              <Label className={labelClasses}>Cover Image</Label>
              <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
                <Upload
                  setImageUrl={(url) => setImageUrl(url)}
                  imageType="Projects"
                  currentImageUrl={initialData?.imageLink}
                  itemTitle={titleEn}
                />
                <AnimatePresence>
                  {imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative mt-4 rounded-lg overflow-hidden aspect-video max-w-sm mx-auto border border-border"
                    >
                      <Image
                        src={imageUrl}
                        fill
                        className="object-cover"
                        alt="Preview"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <input type="hidden" name="imageLink" value={imageUrl} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Submit
            btnText={mode === "create" ? t("add-title") : "Save Changes"}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-lg shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
