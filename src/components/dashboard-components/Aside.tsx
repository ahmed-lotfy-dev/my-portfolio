"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IoHome,
  IoCode,
  IoGrid,
  IoRibbon,
  IoAddCircleSharp,
} from "react-icons/io5"
import { cn } from "@/src/lib/utils"
import { useTranslations } from "next-intl"

export default function Aside() {
  const pathname = usePathname()
  const t = useTranslations("dashboard.nav")

  const navLinks = [
    { href: "/", icon: IoHome, text: t("home") },
    { href: "/dashboard", icon: IoGrid, text: t("dashboard") },
    { href: "/dashboard/projects", icon: IoCode, text: t("projects") },
    {
      href: "/dashboard/certificates",
      icon: IoRibbon,
      text: t("certificates"),
    },
    { href: "/dashboard/blogs/new", icon: IoAddCircleSharp, text: t("blog") },
  ]

  return (
    <aside className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <IoHome className="h-6 w-6" />
            <span className="">{t("home")}</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.text}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
