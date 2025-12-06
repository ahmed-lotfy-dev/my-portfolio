"use client";

import Link from "next/link";
import { deleteCertificateAction } from "@/src/app/actions/certificatesActions";
import { EditCertificate } from "./EditCertificate";
import ImageViewer from "@/src/components/ui/ImageViewer";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Trash2, Award, FileText } from "lucide-react";
import { AddCertificateComponent } from "./AddCertificate";
import Image from "next/image";

function CertificateList({ allCertificates }: any) {
  const locale = useLocale();
  const t = useTranslations("certificates");
  const isArabic = locale === "ar";

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
                  <ImageViewer
                    imageUrl={cert.imageLink}
                    altText={cert.title}
                    trigger={
                      <div className="relative w-full h-full cursor-pointer group-hover:scale-105 transition-transform duration-500">
                        <Image
                          src={cert.imageLink}
                          alt={cert.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    }
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
                  <div className="flex gap-2">
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
                    <EditCertificate EditedObject={cert} />
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
