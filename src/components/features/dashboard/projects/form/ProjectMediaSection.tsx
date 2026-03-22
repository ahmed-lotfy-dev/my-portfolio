
import { Label } from "@/src/components/ui/label";
import { Upload } from "@/src/components/features/dashboard/uploads/Upload";
import { MultiImageUpload } from "@/src/components/features/dashboard/uploads/MultiImageUpload";
import { useTranslations } from "next-intl";
import { Project } from "@/src/lib/types/project";
import { Dispatch, SetStateAction } from "react";

interface ProjectMediaSectionProps {
  imageUrl: string;
  setImageUrl: Dispatch<SetStateAction<string>>;
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
  titleEn: string;
  slug: string;
  initialData?: Project;
  user?: any;
}

export function ProjectMediaSection({
  imageUrl,
  setImageUrl,
  images,
  setImages,
  titleEn,
  slug,
  initialData,
  user
}: ProjectMediaSectionProps) {
  const t = useTranslations("projects");
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className={labelClasses}>{t("featured_image")}</Label>
        <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
          <Upload
            setImageUrl={setImageUrl}
            imageType="Projects"
            currentImageUrl={imageUrl}
            itemTitle={titleEn}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelClasses}>Project Images</Label>
        <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
          <MultiImageUpload
            images={images}
            setImages={setImages}
            primaryImage={imageUrl}
            setPrimaryImage={setImageUrl}
            imageType="Projects"
            itemSlug={slug}
            itemTitle={titleEn}
            projectId={initialData?.id}
            user={user}
          />
          <input type="hidden" name="coverImage" value={imageUrl} />
          <input type="hidden" name="images" value={JSON.stringify(images)} />
        </div>
      </div>
    </div>
  );
}
