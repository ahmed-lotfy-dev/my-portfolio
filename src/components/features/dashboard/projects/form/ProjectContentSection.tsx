
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Upload } from "@/src/components/features/dashboard/uploads/Upload";
import { Image as ImageIcon, X } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { Project } from "@/src/lib/types/project";
import { Dispatch, SetStateAction } from "react";

interface ProjectContentSectionProps {
  initialData?: Project;
  helperImageUrl: string;
  setHelperImageUrl: Dispatch<SetStateAction<string>>;
  copyToClipboard: (text: string) => void;
}

export function ProjectContentSection({
  initialData,
  helperImageUrl,
  setHelperImageUrl,
  copyToClipboard
}: ProjectContentSectionProps) {
  const inputClasses = "bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80";
  const labelClasses = "text-sm font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="space-y-6 p-6 rounded-xl bg-background/40 border border-border/50">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Case Study Content (Markdown)</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
          <ImageIcon size={14} />
          <span>Image Helper</span>
          <div className="w-px h-4 bg-border mx-1" />
          <div className="w-24 relative overflow-hidden">
            <Upload
              setImageUrl={(url) => {
                setHelperImageUrl(url);
                copyToClipboard(`![Image](${url})`);
              }}
              imageType="Blogs"
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none">Upload</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {helperImageUrl && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <code className="text-xs text-green-400 truncate flex-1 mr-4">![Image]({helperImageUrl})</code>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
              onClick={() => setHelperImageUrl("")}
              type="button"
            >
              <X size={14} />
            </Button>
          </m.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-1">
          <Label htmlFor="content_en" className={labelClasses}>
            Content (English)
          </Label>
          <Textarea
            id="content_en"
            className={cn(inputClasses, "min-h-[400px] font-mono text-sm leading-relaxed")}
            name="content_en"
            defaultValue={initialData?.content_en || ""}
            placeholder="# The Challenge&#10;Describe the problem...&#10;&#10;# The Solution&#10;How you solved it..."
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="content_ar" className={labelClasses}>
            Content (Arabic)
          </Label>
          <Textarea
            id="content_ar"
            className={cn(inputClasses, "min-h-[400px] font-mono text-sm leading-relaxed")}
            name="content_ar"
            defaultValue={initialData?.content_ar || ""}
            dir="rtl"
            placeholder="Arabic content..."
          />
        </div>
      </div>
    </div>
  );
}
