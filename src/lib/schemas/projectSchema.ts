import { z } from "zod";
import { getTranslations } from "next-intl/server";

// Pure async schema (no fallback)
export async function getProjectSchema() {
  const t = await getTranslations("projects.validation");

  return z.object({
    title_en: z.string().min(3, { message: t("title_en_required") }),
    title_ar: z.string().optional(),
    desc_en: z.string().min(10, { message: t("desc_en_required") }),
    desc_ar: z.string().optional(),
    slug: z.string().min(3, { message: "slug" }).optional().or(z.literal("")),
    content_en: z.string().optional(),
    content_ar: z.string().optional(),
    repoLink: z.string().url({ message: t("repo_link_invalid") }),
    liveLink: z.string().url({ message: t("live_link_invalid") }),
    imageLink: z.string().url({ message: t("image_link_required") }),
    categories: z.array(z.string()).optional().default([]),
  });
}

export type ProjectSchema = z.infer<
  Awaited<ReturnType<typeof getProjectSchema>>
>;
