"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { authClient } from "@/src/lib/auth-client";
import {
  Reorder,
  useDragControls,
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  deleteProjectAction,
  updateProjectOrder,
} from "@/src/app/actions/projectsActions";
import { Button } from "@/src/components/ui/button";
import { ImageCarousel } from "../../ui/ImageCarousel";
import { useLocale, useTranslations } from "next-intl";
import { notify } from "@/src/lib/utils/toast";
import Link from "next/link";
import {
  Trash2,
  ExternalLink,
  GripVertical,
  Loader2,
  Save,
  Plus,
  Pencil,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import ProjectCategories from "@/src/components/ui/ProjectCategories";

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

export default function ProjectList({ allProjects }: any) {
  const locale = useLocale();
  const t = useTranslations("projects");
  const [projects, setProjects] = useState(allProjects);
  const [isReordering, setIsReordering] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  useEffect(() => {
    setProjects(allProjects);
  }, [allProjects]);

  const handleReorder = (newOrder: any[]) => {
    setProjects(newOrder);
    setHasOrderChanged(true);
  };

  const saveOrder = async () => {
    setIsReordering(true);
    try {
      const updates = projects.map((proj: any, index: number) => ({
        id: proj.id,
        displayOrder: projects.length - index, // Higher order first
      }));

      const result = await updateProjectOrder(updates);
      if (result.success) {
        notify("Order updated successfully", true);
        setHasOrderChanged(false);
      } else {
        notify("Failed to update order", false);
      }
    } catch (error) {
      notify("Error saving order", false);
    } finally {
      setIsReordering(false);
    }
  };

  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      notify("You have no privileges doing this", false);
      return;
    }

    const result = await deleteProjectAction(id);
    if (result.success) {
      notify(result.message, true);
    } else {
      notify(result.message || "Failed to delete project", false);
    }
  };

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <div className="relative rounded-xl border border-border/50 shadow-sm z-10 overflow-hidden">
        <div className="absolute inset-0 bg-card/80 backdrop-blur-xl border-b border-border" />
        <div className="relative flex items-center justify-between px-6 py-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {t("title")}
          </h2>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {hasOrderChanged && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={saveOrder}
                  disabled={isReordering}
                  className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 h-10 px-4 rounded-md text-sm font-medium transition-all hover:shadow-xl hover:shadow-primary/30 flex items-center gap-2"
                >
                  {isReordering ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Order
                </motion.button>
              )}
            </AnimatePresence>
            <Link
              href="/dashboard/projects/new"
              className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 h-10 py-2 px-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("add-title")}
            </Link>
          </div>
        </div>
      </div>

      {/* Modern List */}
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1"></div>
          <div className="col-span-2">Image</div>
          <div className="col-span-4">Details</div>
          <div className="col-span-3 hidden md:block">Tags</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <Reorder.Group
          axis="y"
          values={projects}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {projects?.map((proj: any) => (
            <Reorder.Item
              key={proj.id}
              value={proj}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileDrag={{
                scale: 1.02,
                boxShadow:
                  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              }}
              className="group relative grid grid-cols-12 gap-4 items-center p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              {/* Drag Handle */}
              <div className="col-span-1 flex justify-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Image */}
              <div className="col-span-2">
                <ImageCarousel
                  images={[proj.coverImage]}
                  title={locale === "ar" ? proj.title_ar : proj.title_en}
                  className="h-16 w-24 rounded-lg ring-1 ring-border/50 hover:ring-primary/50 transition-all mb-0"
                />
              </div>

              {/* Details */}
              <div className="col-span-4 space-y-1">
                <h3 className="font-semibold text-lg leading-none truncate">
                  {locale === "ar" ? proj.title_ar : proj.title_en}
                </h3>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  {proj.liveLink && (
                    <a
                      href={proj.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" /> Live
                    </a>
                  )}
                  {proj.repoLink && (
                    <a
                      href={proj.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" /> Repo
                    </a>
                  )}
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-medium border",
                      proj.published
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    )}
                  >
                    {proj.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="col-span-3 hidden md:block">
                <ProjectCategories categories={proj.categories || []} limit={3} />
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-2 transition-opacity duration-200">
                <Link href={`/dashboard/projects/${proj.id}`}>
                  <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Pencil size={16} />
                  </button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project
                        "{locale === "ar" ? proj.title_ar : proj.title_en}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(proj.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
