import { z } from "zod";

export type BlogPostSchema = z.infer<typeof BlogPostSchema>;

export const BlogPostSchema = z.object({
  title: z
    .string()
    .url({ message: "Certificate image link is required" })
    .min(10, { message: "Certificate image link is required" }),

  content: z
    .string()
    .min(6, { message: "Certificate description is required" }),
  published: z.boolean(),
  author: z.string(),
  tags: z.string(),
});
