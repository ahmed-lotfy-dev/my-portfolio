import { z } from "zod"
import { getTranslations } from "next-intl/server"

// Pure i18n schema (no fallback)
export async function getContactSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "contact.validation" })

  return z.object({
    name: z
      .string()
      .min(5, { message: t("name_min") })
      .max(80, { message: t("name_max") }),
    email: z.string().email({ message: t("email_invalid") }),
    subject: z.string().min(6, { message: t("subject_min") }),
    message: z
      .string()
      .min(10, { message: t("message_min") })
      .refine((value) => !/\b(?:https?|ftp):\/\/[^\s]+\b/i.test(value), {
        message: t("message_links"),
      }),
  })
}

export type ContactSchema = z.infer<
  Awaited<ReturnType<typeof getContactSchema>>
>
