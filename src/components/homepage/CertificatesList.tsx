"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/src/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ImageViewer from "@/src/components/ui/ImageViewer";

// Define the type for certificates
type Certificate = {
  id: string;
  title: string;
  desc: string;
  imageLink: string;
  courseLink: string;
  profLink: string;
};

// Accept certificates as props instead of fetching at module level
// This is the proper Next.js 16 pattern: Server Component fetches, Client Component receives
export default function CertificatesList({ certificates }: { certificates?: Certificate[] }) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  const handleEyeClick = (e: React.MouseEvent, cert: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCertificate(cert);
    setShowImageViewer(true);
  };

  return (
    <>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates?.map((cert: any) => (
          <Link key={cert.id} href={`/certificates/${cert.id}`}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card className="flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-primary/50">
                  <div className="p-6 flex flex-col grow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold line-clamp-2" title={cert.title}>
                          {cert.title}
                        </h3>
                      </div>
                      <button
                        onClick={(e) => handleEyeClick(e, cert)}
                        className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                        aria-label="Preview certificate"
                      >
                        <Eye className="w-5 h-5 text-primary shrink-0" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {cert.desc}
                    </p>
                  </div>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-[320px] sm:w-[420px] max-w-[90vw] p-2">
                <Image
                  src={cert.imageLink}
                  alt={cert.title}
                  width={420}
                  height={315}
                  className="rounded-md w-full h-auto"
                  sizes="(max-width: 640px) 320px, 420px"
                  loading="lazy"
                />
              </HoverCardContent>
            </HoverCard>
          </Link>
        ))}
      </div>

      {/* Image Viewer Modal */}
      {showImageViewer && selectedCertificate && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowImageViewer(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageViewer(false)}
              className="absolute -top-12 right-0 text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Close ✕
            </button>
            <ImageViewer
              imageUrl={selectedCertificate.imageLink}
              altText={selectedCertificate.title}
              className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src={selectedCertificate.imageLink}
                alt={selectedCertificate.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </ImageViewer>
          </div>
        </div>
      )}
    </>
  );
}
