import { z } from "zod";
import { getTranslations } from "next-intl/server";

export type CertificateSchema = z.infer<typeof getCertificateSchema>;

export async function getCertificateSchema(lang: string) {
  const t = await getTranslations("validation.certificate");

  return z.object({
    title: z.string().min(6, { message: t("title_required") }),
    desc: z.string().min(6, { message: t("desc_required") }),
    courseLink: z
      .string()
      .url({ message: t("course_link_required") })
      .min(10, { message: t("course_link_required") }),
    profLink: z
      .string()
      .url({ message: t("prof_link_required") })
      .min(10, { message: t("prof_link_required") }),
    imageLink: z
      .string()
      .url({ message: t("image_link_required") })
      .min(10, { message: t("image_link_required") }),
    completedAt: z.string().optional(),
    published: z.boolean().optional().default(true),
  });
}

