import { z } from "zod";

export type ContactInputs = z.infer<typeof contactSchema>;

export const contactSchema = z.object({
  name: z.string().min(5).max(80),
  email: z.string().email(),
  subject: z
    .string()
    .min(6, { message: "could you please provide me with subject" }),
  message: z
    .string()
    .min(10, { message: "could you please provide me with heads up" })
    .refine((value) => !/\b(?:https?|ftp):\/\/[^\s]+\b/i.test(value), {
      message: "Please keep your message without links and work related",
    }),
});
