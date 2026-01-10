"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createExperience,
  updateExperience,
} from "@/src/app/actions/experienceActions";
import { IoArrowBack, IoSave } from "react-icons/io5";
import Link from "next/link";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role_en: z.string().min(1, "Role (EN) is required"),
  role_ar: z.string().min(1, "Role (AR) is required"),
  description_en: z.string().min(1, "Description (EN) is required"),
  description_ar: z.string().min(1, "Description (AR) is required"),
  date_en: z.string().min(1, "Date (EN) is required"),
  date_ar: z.string().min(1, "Date (AR) is required"),
  tech_stack: z.string().min(1, "Tech stack is required"),
  displayOrder: z.number().default(0),
  published: z.boolean().default(true),
});

export default function ExperienceForm({ experience }: { experience?: any }) {
  const t = useTranslations("experiences");
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience
      ? {
        ...experience,
        tech_stack: experience.tech_stack.join(", "),
      }
      : {
        company: "",
        role_en: "",
        role_ar: "",
        description_en: "",
        description_ar: "",
        date_en: "",
        date_ar: "",
        tech_stack: "",
        displayOrder: 0,
        published: true,
      },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        tech_stack: data.tech_stack.split(",").map((s: string) => s.trim()),
      };

      if (experience) {
        await updateExperience(experience.id, formattedData);
        toast.success("Experience updated successfully");
      } else {
        await createExperience(formattedData);
        toast.success("Experience created successfully");
      }
      router.push(`/${locale}/dashboard/experiences`);
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/dashboard/experiences`}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <IoArrowBack className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold">
          {experience ? t("edit-title") : t("add-title")}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-card p-8 rounded-2xl border border-border shadow-sm"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("company")}</label>
            <input
              {...register("company")}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.company && (
              <p className="text-xs text-destructive">{errors.company.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("published")}</label>
            <div className="flex items-center gap-2 h-10">
              <input
                type="checkbox"
                {...register("published")}
                className="w-5 h-5 accent-primary"
              />
              <span className="text-sm text-muted-foreground">Show in portfolio</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("role_en")}</label>
            <input
              {...register("role_en")}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.role_en && (
              <p className="text-xs text-destructive">{errors.role_en.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("role_ar")}</label>
            <input
              {...register("role_ar")}
              dir="rtl"
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.role_ar && (
              <p className="text-xs text-destructive">{errors.role_ar.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("date_en")}</label>
            <input
              {...register("date_en")}
              placeholder="e.g. 2024 — Present"
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.date_en && (
              <p className="text-xs text-destructive">{errors.date_en.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("date_ar")}</label>
            <input
              {...register("date_ar")}
              dir="rtl"
              placeholder="مثلاً ٢٠٢٤ — الحالي"
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.date_ar && (
              <p className="text-xs text-destructive">{errors.date_ar.message as string}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("desc_en")}</label>
          <textarea
            {...register("description_en")}
            rows={4}
            className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
          {errors.description_en && (
            <p className="text-xs text-destructive">{errors.description_en.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("desc_ar")}</label>
          <textarea
            {...register("description_ar")}
            dir="rtl"
            rows={4}
            className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
          {errors.description_ar && (
            <p className="text-xs text-destructive">{errors.description_ar.message as string}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("tech_stack")}</label>
            <input
              {...register("tech_stack")}
              placeholder="React, Next.js, Node.js"
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.tech_stack && (
              <p className="text-xs text-destructive">{errors.tech_stack.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("displayOrder")}</label>
            <input
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "..." : <><IoSave className="w-5 h-5" /> {t("save")}</>}
        </button>
      </form>
    </div>
  );
}
