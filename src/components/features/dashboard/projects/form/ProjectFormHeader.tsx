
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Project } from "@/src/lib/types/project";

interface ProjectFormHeaderProps {
  mode: "create" | "edit";
  initialData?: Project;
}

export function ProjectFormHeader({ mode, initialData }: ProjectFormHeaderProps) {
  const router = useRouter();
  const t = useTranslations("projects");
  const locale = useLocale();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/30 border border-border/50 p-4 rounded-2xl backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/projects")}
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {mode === "edit" ? t("edit-title") : t("add-title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "edit" ? t("edit-desc") : t("add-desc")}
          </p>
        </div>
      </div>

      {mode === "edit" && initialData?.slug && (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all"
        >
          <a
            href={`/${locale}/projects/${initialData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
            {t("view_project")}
          </a>
        </Button>
      )}
    </div>
  );
}
