import { z } from "zod";

export type postSchema = z.infer<typeof postSchema>;

export const postSchema = z.object({
  postTitle: z
    .string()
    .min(5, { message: "Post title required and minimum 5 character" }),
  postContent: z.string().min(6, {
    message: "Post description is required and minimum 50 character",
  }),
  slug: z.string(),
  postImageLink: z.string(),
  postsCategories: z.string().array(),
  published: z.boolean(),
});
