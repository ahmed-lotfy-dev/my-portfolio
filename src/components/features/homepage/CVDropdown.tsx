"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Eye, Download, FileText } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function CVDropdown({ children }: { children: React.ReactNode }) {
  const t = useTranslations("hero.cv_modal");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => window.open("/Ahmed-Lotfy-CV.pdf", "_blank")}
          className="cursor-pointer gap-2"
        >
          <Eye className="w-4 h-4" />
          {t("view_browser")}
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/Ahmed-Lotfy-CV.pdf" download>
            <Download className="w-4 h-4" />
            {t("download")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/cv/Ahmed_Shoman_Full_Stack_ATS_CV.docx" download>
            <FileText className="w-4 h-4" />
            <span className="flex flex-col">
              <span>{t("download_ats")}</span>
              <span className="text-xs text-muted-foreground">
                {t("ats_description")}
              </span>
            </span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
