"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoArrowBack, IoSave } from "react-icons/io5";
import Link from "next/link";
import {
  createTestimonial,
  updateTestimonial,
} from "@/src/app/actions/testimonials/mutations";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  quote_en: z.string().min(1, "English quote is required"),
  quote_ar: z.string().min(1, "Arabic quote is required"),
  displayOrder: z.number().min(0, "Display order must be 0 or greater").default(0),
  published: z.boolean().default(true),
});

export default function TestimonialForm({ testimonial }: { testimonial?: any }) {
  const t = useTranslations("testimonials_dashboard");
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial
      ? {
        ...testimonial,
        displayOrder: testimonial.displayOrder ?? 0,
        published: testimonial.published ?? true,
      }
      : {
        name: "",
        role: "",
        quote_en: "",
        quote_ar: "",
        displayOrder: 0,
        published: true,
      },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (testimonial) {
        await updateTestimonial(testimonial.id, data);
        toast.success("Testimonial updated successfully");
      } else {
        await createTestimonial(data);
        toast.success("Testimonial created successfully");
      }
      router.push(`/${locale}/dashboard/testimonials`);
    } catch (_error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/dashboard/testimonials`}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <IoArrowBack className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold">
          {testimonial ? t("edit-title") : t("add-title")}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-card p-8 rounded-2xl border border-border shadow-sm"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("name")}</label>
            <input
              {...register("name")}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("role")}</label>
            <input
              {...register("role")}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message as string}</p>
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
              <span className="text-sm text-muted-foreground">{t("show_in_portfolio")}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("displayOrder")}</label>
            <input
              type="number"
              min={0}
              {...register("displayOrder", { valueAsNumber: true })}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.displayOrder && (
              <p className="text-xs text-destructive">{errors.displayOrder.message as string}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("quote_en")}</label>
          <textarea
            {...register("quote_en")}
            rows={4}
            className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
          {errors.quote_en && (
            <p className="text-xs text-destructive">{errors.quote_en.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("quote_ar")}</label>
          <textarea
            {...register("quote_ar")}
            dir="rtl"
            rows={4}
            className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
          {errors.quote_ar && (
            <p className="text-xs text-destructive">{errors.quote_ar.message as string}</p>
          )}
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
