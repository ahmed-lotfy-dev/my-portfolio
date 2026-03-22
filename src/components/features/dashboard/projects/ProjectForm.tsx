
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Submit from "@/src/components/ui/formSubmitBtn";
import { notify } from "@/src/lib/utils/toast";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

// Sub-components
import { ProjectFormHeader } from "./form/ProjectFormHeader";
import { ProjectBasicInfo } from "./form/ProjectBasicInfo";
import { ProjectContentSection } from "./form/ProjectContentSection";
import { ProjectLinks } from "./form/ProjectLinks";
import { ProjectStatus } from "./form/ProjectStatus";
import { ProjectMediaSection } from "./form/ProjectMediaSection";

// Types
import { ProjectFormProps } from "@/src/lib/types/project";

export default function ProjectForm({
  initialData,
  action,
  mode,
  user,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, null as any);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialData?.coverImage || "");
  const [images, setImages] = useState<string[]>(initialData?.images || (initialData?.coverImage ? [initialData.coverImage] : []));
  const [titleEn, setTitleEn] = useState(initialData?.title_en || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugEdited, setIsSlugEdited] = useState(mode === "edit");
  const t = useTranslations("projects");
  const [helperImageUrl, setHelperImageUrl] = useState("");

  useEffect(() => {
    if (!imageUrl && images.length > 0) {
      setImageUrl(images[0]);
    }
  }, [images, imageUrl]);

  useEffect(() => {
    if (state && "success" in state && state.success) {
      const eventName = mode === "create" ? "project_created" : "project_updated";
      posthog.capture(eventName, {
        project_title: titleEn,
        project_slug: slug,
        categories_count: images.length,
      });
      notify(state.message, true);
      router.push("/dashboard/projects");
      router.refresh();
    } else if (state?.message) {
      notify(state.message, false);
    }
  }, [state, router, mode, titleEn, slug, images.length]);

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

  const handleRegenerateSlug = () => {
    const generated = titleEn.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    setSlug(generated);
    setIsSlugEdited(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    notify("Copied to clipboard!", true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <ProjectFormHeader mode={mode} initialData={initialData} />

      <div className="bg-card/30 border border-border/50 rounded-2xl shadow-xl backdrop-blur-sm p-6 overflow-hidden">
        <form action={formAction} className="flex flex-col gap-8">
          {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}

          <ProjectBasicInfo
            titleEn={titleEn}
            onTitleChange={handleTitleChange}
            slug={slug}
            onSlugChange={handleSlugChange}
            onRegenerateSlug={handleRegenerateSlug}
            initialData={initialData}
          />

          <ProjectContentSection
            initialData={initialData}
            helperImageUrl={helperImageUrl}
            setHelperImageUrl={setHelperImageUrl}
            copyToClipboard={copyToClipboard}
          />

          <div className="space-y-6 p-6 rounded-xl bg-background/40 border border-border/50">
            <h2 className="text-xl font-semibold">Media & Metadata</h2>
            <ProjectStatus initialData={initialData} />
            <ProjectLinks initialData={initialData} />
            <ProjectMediaSection
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              images={images}
              setImages={setImages}
              titleEn={titleEn}
              slug={slug}
              initialData={initialData}
              user={user}
            />
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
    </div>
  );
}
