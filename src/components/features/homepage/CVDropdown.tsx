"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Eye, Download } from "lucide-react";
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
          onClick={() => window.open("/ahmed-lotfy-cv-2026-11-21.pdf", "_blank")}
          className="cursor-pointer gap-2"
        >
          <Eye className="w-4 h-4" />
          {t("view_browser")}
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/ahmed-lotfy-cv-2026-11-21.pdf" download>
            <Download className="w-4 h-4" />
            {t("download")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
