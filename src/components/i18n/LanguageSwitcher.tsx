"use client"
import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const handleSwitch = () => {
    // Save current scroll position
    const scrollY = window.scrollY

    // Compute next locale
    const nextLocale = locale === "en" ? "ar" : "en"

    // Replace the current locale in the pathname with the next locale
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`)

    // Navigate to the same path but with new locale
    router.push(newPath, { scroll: false })

    // Restore scroll after navigation finishes
    setTimeout(() => window.scrollTo(0, scrollY), 100)
  }

  return (
    <button
      type="button"
      aria-label="Toggle language"
      title={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      onClick={handleSwitch}
      className="font-arabic inline-flex h-10 min-w-[4.25rem] items-center justify-center rounded-full border border-primary/10 bg-transparent px-4 text-muted-foreground transition-all duration-300 hover:border-primary/25 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
    >
      <span className="sr-only">
        {locale === "en" ? "Switch to Arabic" : "Switch to English"}
      </span>
      {locale === "en" ? (
        <span className="text-sm font-medium">عربي</span>
      ) : (
        <span className="text-sm font-medium">EN</span>
      )}
    </button>
  )
}
