
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/src/lib/utils";
import { Project } from "@/src/lib/types/project";

interface ProjectStatusProps {
  initialData?: Project;
}

export function ProjectStatus({ initialData }: ProjectStatusProps) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const inputClasses = "bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80";
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-1">
        <Label htmlFor="categories" className={labelClasses}>
          Categories (comma separated)
        </Label>
        <Input
          id="categories"
          className={inputClasses}
          type="text"
          name="categories"
          defaultValue={
            Array.isArray(initialData?.categories)
              ? initialData.categories.join(", ")
              : initialData?.categories || ""
          }
          placeholder="React, Next.js, TypeScript"
        />
      </div>

      <div className="space-y-1">
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className={cn(
            "flex items-center justify-between h-auto py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden"
          )}
          onClick={() => {
            const el = document.getElementById('published') as HTMLButtonElement;
            el?.click();
          }}
        >
          <div className="flex flex-col gap-0.5 pointer-events-none">
            <Label htmlFor="published" className="cursor-pointer font-bold text-sm tracking-tight select-none">
              {t("publish_toggle")}
            </Label>
            <p className="text-xs text-muted-foreground/70 transition-colors group-hover:text-muted-foreground select-none">
              {t("publish_toggle_desc")}
            </p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              id="published"
              name="published"
              dir={locale === "ar" ? "rtl" : "ltr"}
              defaultChecked={initialData?.published !== false}
              value="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
