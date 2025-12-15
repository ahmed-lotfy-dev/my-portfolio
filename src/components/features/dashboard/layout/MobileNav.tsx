"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/src/components/ui/sheet"
import { Button } from "@/src/components/ui/button"
import {
  IoHome,
  IoCode,
  IoGrid,
  IoRibbon,
  IoAddCircleSharp,
  IoMenu,
} from "react-icons/io5"
import { cn } from "@/src/lib/utils"
import { useTranslations } from "next-intl"

export default function MobileNav() {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <IoMenu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.text}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
