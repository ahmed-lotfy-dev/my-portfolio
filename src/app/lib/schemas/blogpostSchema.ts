import { z } from "zod";

export type BlogPostSchema = z.infer<typeof BlogPostSchema>;

export const BlogPostSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Post title required and minimum 5 character" }),
  content: z.string().min(6, {
    message: "Post description is required and minimum 50 character",
  }),
  imageLink: z.string(),
  tags: z.string().array(),
  slug: z.string(),
  published: z.boolean(),
});
