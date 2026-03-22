
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { ChangeEvent } from "react";
import { cn } from "@/src/lib/utils";
import { Project } from "@/src/lib/types/project";

interface ProjectBasicInfoProps {
  titleEn: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  slug: string;
  onSlugChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRegenerateSlug: () => void;
  initialData?: Project;
}

export function ProjectBasicInfo({
  titleEn,
  onTitleChange,
  slug,
  onSlugChange,
  onRegenerateSlug,
  initialData
}: ProjectBasicInfoProps) {
  const inputClasses = "bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80";
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="space-y-6 p-6 rounded-xl bg-background/40 border border-border/50">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <Label htmlFor="title_en" className={labelClasses}>
            Title (English)
          </Label>
          <Input
            id="title_en"
            className={inputClasses}
            type="text"
            name="title_en"
            value={titleEn}
            onChange={onTitleChange}
            placeholder="Project Title"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="title_ar" className={labelClasses}>
            Title (Arabic)
          </Label>
          <Input
            id="title_ar"
            className={inputClasses}
            type="text"
            name="title_ar"
            defaultValue={initialData?.title_ar || ""}
            dir="rtl"
            placeholder="Arabic Title"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="slug" className={labelClasses}>
            Slug (URL Identifier) - unique
          </Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              className={inputClasses}
              type="text"
              name="slug"
              value={slug}
              onChange={onSlugChange}
              placeholder="e.g. self-tracker"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onRegenerateSlug}
              title="Regenerate from Title"
            >
              Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Used for the case study URL: /projects/{slug || '...'}</p>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="desc_en" className={labelClasses}>
            Short Description (English)
          </Label>
          <Textarea
            id="desc_en"
            className={cn(inputClasses, "min-h-[80px]")}
            name="desc_en"
            defaultValue={initialData?.desc_en || ""}
            placeholder="Brief summary for the card..."
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="desc_ar" className={labelClasses}>
            Short Description (Arabic)
          </Label>
          <Textarea
            id="desc_ar"
            className={cn(inputClasses, "min-h-[80px]")}
            name="desc_ar"
            defaultValue={initialData?.desc_ar || ""}
            dir="rtl"
            placeholder="Arabic summary..."
          />
        </div>
      </div>
    </div>
  );
}
