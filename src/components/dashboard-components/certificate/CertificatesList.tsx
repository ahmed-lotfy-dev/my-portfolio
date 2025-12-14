"use client";

import Link from "next/link";
import { authClient } from "@/src/lib/auth-client";
import { deleteCertificateAction } from "@/src/app/actions/certificatesActions";
import { EditCertificate } from "./EditCertificate";
import { ImageCarousel } from "@/src/components/ui/ImageCarousel";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Trash2, Award, FileText } from "lucide-react";
import { AddCertificateComponent } from "./AddCertificate";
import Image from "next/image";

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
import { notify } from "@/src/lib/utils/toast";
import { Button } from "@/src/components/ui/button";

function CertificateList({ allCertificates }: any) {
  const locale = useLocale();
  const t = useTranslations("certificates");
  const isArabic = locale === "ar";

  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleDelete = async (id: string, title: string) => {
    if (!isAdmin) {
      notify("You have no privileges doing this", false);
      return;
    }

    const result = await deleteCertificateAction(id);
    if (result.success) {
      notify(result.message, true);
    } else {
      notify(result.message || "Failed to delete certificate", false);
    }
  };

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border/50 shadow-sm sticky top-0 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-card/80 backdrop-blur-xl border-b border-border" />
        <div className="relative flex items-center justify-between px-6 py-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {t("table.title")}
          </h2>
          <AddCertificateComponent />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {allCertificates?.map((cert: any, index: number) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Image Section */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted/50">
                {cert.imageLink ? (
                  <ImageCarousel
                    images={[cert.imageLink]}
                    title={cert.title}
                    className="w-full h-full mb-0"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Award className="h-12 w-12 opacity-20" />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col p-5 gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="font-semibold text-lg leading-tight text-foreground line-clamp-1"
                    title={cert.title}
                  >
                    {cert.title}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                  {cert.desc}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                  <div className="flex gap-2 items-center">
                    {cert.courseLink && (
                      <Link
                        href={cert.courseLink}
                        target="_blank"
                        className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        title={t("table.view_course")}
                      >
                        <ExternalLink size={16} />
                      </Link>
                    )}
                    {cert.profLink && (
                      <Link
                        href={cert.profLink}
                        target="_blank"
                        className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        title={t("table.proof")}
                      >
                        <FileText size={16} />
                      </Link>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <EditCertificate EditedObject={cert} />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Certificate?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{cert.title}".
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(cert.id, cert.title)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { CertificateList };
