import { z } from "zod";

export type ProjectSchema = z.infer<typeof ProjectSchema>;

export const ProjectSchema = z.object({
  title: z.string().min(6, { message: "Project title link is required" }),
  desc: z.string().min(10, { message: "Project Description link is required" }),
  repoLink: z
    .string()
    .url({ message: "Project repo link  is required" })
    .min(10, { message: "Project repo link is required" }),
  liveLink: z
    .string()
    .url({ message: "Project link proof is required" })
    .min(10, { message: "Project live link is required" }),
  imageLink: z
    .string()
    .url({ message: "Project image link  is required" })
    .min(10, { message: "Project image link is required" }),
});
