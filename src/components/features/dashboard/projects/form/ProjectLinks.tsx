
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useTranslations } from "next-intl";
import { Project } from "@/src/lib/types/project";

interface ProjectLinksProps {
  initialData?: Project;
}

export function ProjectLinks({ initialData }: ProjectLinksProps) {
  const t = useTranslations("projects");
  const inputClasses = "bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80";
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="repoLink" className={labelClasses}>Repo Link</Label>
        <Input
          id="repoLink"
          className={inputClasses}
          name="repoLink"
          defaultValue={initialData?.repoLink || ""}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="liveLink" className={labelClasses}>Live Link</Label>
        <Input
          id="liveLink"
          className={inputClasses}
          name="liveLink"
          defaultValue={initialData?.liveLink || ""}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="embedUrl" className={labelClasses}>{t("embed_url")}</Label>
        <Input
          id="embedUrl"
          className={inputClasses}
          name="embedUrl"
          placeholder={t("placeholders.embed_url")}
          defaultValue={initialData?.embedUrl || ""}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="featureVideo" className={labelClasses}>{t("feature_video")}</Label>
        <Input
          id="featureVideo"
          className={inputClasses}
          name="featureVideo"
          placeholder={t("placeholders.feature_video")}
          defaultValue={initialData?.featureVideo || ""}
        />
      </div>
    </div>
  );
}
