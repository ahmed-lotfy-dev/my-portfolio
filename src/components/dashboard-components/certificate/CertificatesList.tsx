"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/src/components/ui/table";
import { deleteCertificateAction } from "@/src/app/actions/certificatesActions";
import { EditPopover } from "../EditPopover";
import ImageViewer from "@/src/components/ui/ImageViewer";
import { IoImage } from "react-icons/io5";
import { useLocale, useTranslations } from "next-intl";

function CertificateList({ allCertificates }: any) {
  const locale = useLocale();
  const t = useTranslations("certificates");

  const isArabic = locale === "ar";

  return (
    <div
      className={`w-full mt-18 ${
        isArabic ? "rtl text-right" : "ltr text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="m-auto w-full lg:w-2/3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={`font-extrabold ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {t("table.title")}
              </TableHead>
              <TableHead
                className={`font-extrabold ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {t("table.author")}
              </TableHead>
              <TableHead
                className={`font-extrabold ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {t("table.course_link")}
              </TableHead>
              <TableHead
                className={`font-extrabold ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {t("table.proof")}
              </TableHead>
              <TableHead
                className={`font-extrabold ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {t("table.options")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allCertificates?.map((cert: any) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">
                  <Link href={`/certificates/${cert.title}`}>{cert.title}</Link>
                </TableCell>
                <TableCell>{cert.desc}</TableCell>
                <TableCell>
                  <Link href={cert.courseLink} target="_blank">
                    {t("table.view_course")}
                  </Link>
                </TableCell>
                <TableCell>
                  <ImageViewer
                    imageUrl={cert.imageLink}
                    altText={cert.Title}
                    trigger={
                      <img src={cert.imageLink} className="w-36 h-20 pointer" />
                    }
                  />
                </TableCell>

                <TableCell>
                  <EditPopover
                    EditedObject={cert}
                    onDeleteClick={() => deleteCertificateAction(cert.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export { CertificateList };
