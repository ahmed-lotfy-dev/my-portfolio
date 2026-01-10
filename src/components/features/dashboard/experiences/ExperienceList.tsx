"use client";

import { useTranslations } from "next-intl";
import { IoAdd, IoPencil, IoTrash, IoEyeOff, IoBriefcase } from "react-icons/io5";
import Link from "next/link";
import { useLocale } from "next-intl";
import { deleteExperience } from "@/src/app/actions/experienceActions";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

export default function ExperienceList({
  experiences,
  isAdmin,
}: {
  experiences: any[];
  isAdmin: boolean;
}) {
  const t = useTranslations("experiences");
  const locale = useLocale();
  const [items, setItems] = useState(experiences);

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience(id);
      setItems(items.filter((item) => item.id !== id));
      toast.success("Experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete experience or unauthorized");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <IoBriefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
        </div>
        {isAdmin && (
          <Link
            href={`/${locale}/dashboard/experiences/new`}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
          >
            <IoAdd className="w-5 h-5" />
            {t("add-title")}
          </Link>
        )}
      </div>

      <div className="grid gap-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl bg-muted/30">
            <IoBriefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No experiences found.</p>
          </div>
        ) : (
          items.map((exp) => (
            <div
              key={exp.id}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {exp.company}
                  </h3>
                  {!exp.published && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">
                      <IoEyeOff className="w-3 h-3" />
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary/80">
                    {locale === "ar" ? exp.role_ar : exp.role_en}
                  </span>
                  <span className="hidden sm:inline w-1 h-1 rounded-full bg-border" />
                  <span className="font-medium">
                    {locale === "ar" ? exp.date_ar : exp.date_en}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2 mt-4 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/${locale}/dashboard/experiences/${exp.id}`}
                    className="p-3 rounded-xl bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-95"
                    title="Edit"
                  >
                    <IoPencil className="w-5 h-5" />
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-3 rounded-xl bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all active:scale-95"
                        title="Delete"
                      >
                        <IoTrash className="w-5 h-5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border-border bg-card/95 backdrop-blur-xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          experience at {exp.company}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(exp.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
