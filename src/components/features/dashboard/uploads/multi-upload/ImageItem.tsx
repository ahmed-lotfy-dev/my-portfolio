
import Image from "next/image";
import { Star, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useTranslations } from "next-intl";
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

interface ImageItemProps {
  url: string;
  isPrimary: boolean;
  isBeingDeleted: boolean;
  onSetPrimary: (url: string) => void;
  onDelete: (url: string) => void;
  index: number;
}

export function ImageItem({
  url,
  isPrimary,
  isBeingDeleted,
  onSetPrimary,
  onDelete,
  index
}: ImageItemProps) {
  const t = useTranslations("projects");

  return (
    <div
      className={cn(
        "group relative aspect-video w-full rounded-xl overflow-hidden border-2 bg-background shadow-sm transition-all hover:shadow-md",
        isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border/50 hover:border-border",
        isBeingDeleted && "opacity-50"
      )}
    >
      <Image
        src={url}
        alt={`Project image ${index + 1}`}
        fill
        className="object-cover"
        unoptimized={url.toLowerCase().includes('.gif')}
      />

      {/* Actions Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        {!isBeingDeleted && (
          <Button
            size="sm"
            variant={isPrimary ? "secondary" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSetPrimary(url);
            }}
            className="gap-2"
            disabled={isPrimary}
            type="button"
          >
            <Star className={cn("w-4 h-4", isPrimary && "fill-current")} />
            {isPrimary ? t("already_cover") : t("set_cover")}
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 z-20"
              disabled={isBeingDeleted}
              onClick={(e) => e.stopPropagation()}
            >
              {isBeingDeleted ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the image from storage.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(url);
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {isPrimary && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" /> Cover
        </div>
      )}

      {isBeingDeleted && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-white text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Deleting...
          </div>
        </div>
      )}
    </div>
  );
}
