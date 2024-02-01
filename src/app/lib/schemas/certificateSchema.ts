import { z } from "zod";

export type CertificateSchema = z.infer<typeof CertificateSchema>;

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
