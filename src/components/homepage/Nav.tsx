"use client"
import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import ThemeToggle from "@/src/components/ThemeToggle"
import LanguageSwitcher from "@/src/components/i18n/LanguageSwitcher"
import { useTheme } from "next-themes"
import LogoLight from "@/public/Logo-Blue-Dot.png"
import LogoDark from "@/public/Logo-Blue-Dot.png"
import { useLocale, useTranslations } from "next-intl"

const navLinks = [
  { href: "/", label: "home" },
  { href: "/#projects", label: "projects" },
  { href: "/blogs", label: "blog" },
  { href: "/#certificates", label: "certificates" },
  { href: "/#about", label: "about" },
  { href: "/#contact", label: "contact" },
  { href: "/dashboard", label: "dashboard" },
]

function Nav({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const t = useTranslations("nav")
  const locale = useLocale()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-100 ${
        scrolled &&
        "bg-background/70 backdrop-blur-md border-b border-border shadow-sm"
      } ${pathname.split("/").at(-1) === "dashboard" && "hidden"}`}
    >
      <nav className="max-w-6xl mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={!mounted || resolvedTheme === "light" ? LogoLight : LogoDark}
            width={80}
            height={80}
            alt="Logo"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {t(link.label)}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <LanguageSwitcher />
          {children}
        </div>

        <div className="flex items-center gap-2 md:hidden pr-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            aria-label="Open menu"
            onClick={toggle}
            className="p-2 rounded-md hover:bg-accent/30"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div
        className={`fixed top-0 h-full w-72 bg-background shadow-lg transform transition-transform duration-300 z-50
    ${open ? "translate-x-0" : ""}
    ${
      locale === "ar"
        ? open
          ? "left-0 translate-x-0"
          : "-translate-x-full left-0"
        : open
        ? "right-0 translate-x-0"
        : "translate-x-full right-0"
    }
  `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" onClick={close}>
            <Image
              src={!mounted || resolvedTheme === "light" ? LogoLight : LogoDark}
              width={70}
              height={70}
              alt="Logo"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="p-2 rounded-md hover:bg-accent/30"
          >
            <X className="h-6 w-6 text-foreground" />
          </button>
        </div>
        <ul className="flex flex-col p-4 space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                className="block px-4 py-2 text-sm font-medium text-foreground rounded-md hover:bg-accent/30"
              >
                {t(link.label)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

export { Nav }
