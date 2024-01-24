import { z } from "zod";

export type CertificateSchema = z.infer<typeof CertificateSchema>;

export const CertificateSchema = z.object({
  certTitle: z
    .string()
    .min(6, { message: "Certificate title link is required" }),
  certDesc: z
    .string()
    .min(6, { message: "Certificate description is required" }),
  courseLink: z
    .string()
    .url({ message: "Certificate link proof is required" })
    .min(10, { message: "Certificate link proof is required" }),
  certProfLink: z
    .string()
    .url({ message: "Certificate link proof is required" })
    .min(10, { message: "Certificate link proof is required" }),
  certImageLink: z
    .string()
    .url({ message: "Certificate image link is required" })
    .min(10, { message: "Certificate image link is required" }),
});
