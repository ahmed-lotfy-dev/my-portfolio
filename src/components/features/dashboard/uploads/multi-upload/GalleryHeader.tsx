
import { ImageIcon, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useTranslations, useLocale } from "next-intl";
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

interface GalleryHeaderProps {
  imageCount: number;
  isDeletingAll: boolean;
  onDeleteAll: () => void;
  isDeleting: boolean;
}

export function GalleryHeader({
  imageCount,
  isDeletingAll,
  onDeleteAll,
  isDeleting
}: GalleryHeaderProps) {
  const t = useTranslations("projects");
  const locale = useLocale();

  return (
    <div className={cn("flex items-center justify-between px-1", locale === 'ar' && "flex-row-reverse")}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        {t("gallery")} ({imageCount})
      </h3>

      {imageCount > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 transition-colors"
              disabled={isDeleting}
            >
              {isDeletingAll ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
              {t("delete_all")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("delete_all")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("delete_all_confirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteAll}
                className="bg-destructive hover:bg-destructive/90 transition-colors"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
