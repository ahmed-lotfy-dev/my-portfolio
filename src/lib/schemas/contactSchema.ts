// src/lib/schemas/contactSchema.ts
import { z } from "zod"
import en from "@/src/messages/en.json"
import ar from "@/src/messages/ar.json"

export const getContactSchema = (locale: string) => {
  const t = locale === "ar" ? ar.contact.error : en.contact.error

  return z.object({
    name: z
      .string()
      .min(5, { message: t.name_min })
      .max(80, { message: t.name_max }),
    email: z.string().email({ message: t.email_invalid }),
    subject: z.string().min(6, { message: t.subject_min }),
    message: z
      .string()
      .min(10, { message: t.message_min })
      .refine((value) => !/\b(?:https?|ftp):\/\/[^\s]+\b/i.test(value), {
        message: t.message_links,
      }),
  })
}

export type ContactInputs = z.infer<ReturnType<typeof getContactSchema>>
