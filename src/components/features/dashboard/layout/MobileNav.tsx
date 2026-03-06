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
  IoBriefcase,
  IoChatboxEllipsesOutline,
  IoSaveSharp,
  IoMenu,
} from "react-icons/io5"
import { cn } from "@/src/lib/utils"
import { useTranslations } from "next-intl"
import { authClient } from "@/src/lib/auth-client"

export default function MobileNav() {
  const pathname = usePathname()
  const t = useTranslations("dashboard.nav")
  const { data: session } = authClient.useSession()
  const isAdmin = session?.user?.role === "ADMIN"
  const navLinks = [
    { href: "/", icon: IoHome, text: t("home") },
    { href: "/dashboard", icon: IoGrid, text: t("dashboard") },
    { href: "/dashboard/projects", icon: IoCode, text: t("projects") },
    {
      href: "/dashboard/certificates",
      icon: IoRibbon,
      text: t("certificates"),
    },
    { href: "/dashboard/experiences", icon: IoBriefcase, text: t("experiences") },
    ...(isAdmin ? [{ href: "/dashboard/testimonials", icon: IoRibbon, text: t("testimonials") }] : []),
    { href: "/dashboard/blogs", icon: IoChatboxEllipsesOutline, text: t("blog") },
    { href: "/dashboard/backups", icon: IoSaveSharp, text: t("backups") },
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
