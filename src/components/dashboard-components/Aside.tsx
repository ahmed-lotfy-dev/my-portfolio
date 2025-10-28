import Link from "next/link"
import ThemeToggle from "@/src/components/ThemeToggle"
import {
  IoHome,
  IoCode,
  IoGrid,
  IoRibbon,
  IoAddCircleSharp,
} from "react-icons/io5"
import UserButton from "@/src/components/dashboard-components/UserButton"
import { getLocale, getTranslations } from "next-intl/server"
import LanguageSwitcher from "../i18n/LanguageSwitcher"

export default async function Aside() {
  const locale = await getLocale()
  const t = await getTranslations("dashboard.nav")

  return (
    <aside className="flex flex-col w-56 border-r bg-card p-5 pt-5 gap-10">
      <div className="h-full space-y-4 flex flex-col gap-6 content-start">
        <div className="flex flex-col gap-6 ">
          <div className="flex gap-5 items-start first:mt-2">
            <IoHome className="text-muted-foreground w-6 h-6" />
            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/"
            >
              {t("home")}
            </Link>
          </div>

          <div className="flex gap-5 items-start">
            <IoGrid className="text-muted-foreground w-6 h-6" />

            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/dashboard"
            >
              {t("dashboard")}
            </Link>
          </div>
          <div className="flex gap-5 items-start">
            <IoCode className="text-muted-foreground w-6 h-6" />
            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/dashboard/projects"
            >
              {t("projects")}
            </Link>
          </div>

          <div className="flex gap-5 items-start">
            <IoRibbon className="text-muted-foreground w-6 h-6" />
            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/dashboard/certificates"
            >
              {t("certificates")}
            </Link>
          </div>

          <div className="flex gap-5 items-start">
            <IoAddCircleSharp className="text-muted-foreground w-6 h-6" />
            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/dashboard/blogs/new"
            >
              {t("blog")}
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3">
          <div
            className={`flex justify-center items-center gap-3 ${
              locale === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <UserButton />
        </div>
      </div>
    </aside>
  )
}
