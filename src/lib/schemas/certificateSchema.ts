import { z } from "zod";
import { getTranslations } from "next-intl/server";

export type CertificateSchema = z.infer<typeof CertificateSchema>;

export async function createCertificateSchema() {
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
  });
}

export const CertificateSchema = z.object({
  title: z.string().min(6, { message: "Certificate title link is required" }),
  desc: z.string().min(6, { message: "Certificate description is required" }),
  courseLink: z
    .string()
    .url({ message: "Certificate link proof is required" })
    .min(10, { message: "Certificate link proof is required" }),
  profLink: z
    .string()
    .url({ message: "Certificate link proof is required" })
    .min(10, { message: "Certificate link proof is required" }),
  imageLink: z
    .string()
    .url({ message: "Certificate image link is required" })
    .min(10, { message: "Certificate image link is required" }),
});
