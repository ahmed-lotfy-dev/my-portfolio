"use client"
import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import ThemeToggle from "@/src/components/ThemeToggle"
import LogoImage from "@/public/Logo-black-white.png"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
]

function Nav({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      } ${pathname.startsWith("/dashboard") ? "hidden" : ""}`}
    >
      <nav className="max-w-6xl mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src={LogoImage} width={80} height={80} alt="Logo" />
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href="/dashboard">
            <span className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Dashboard
            </span>
          </Link>
          {children}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={toggle}
          className="md:hidden"
        >
          <Menu className="h-6 w-6 text-foreground" />
        </button>
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
        className={`fixed right-0 top-0 h-full w-72 bg-background shadow-lg transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" onClick={close}>
            <Image src={LogoImage} width={70} height={70} alt="Logo" />
          </Link>
          <button type="button" aria-label="Close menu" onClick={close}>
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
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/dashboard"
              onClick={close}
              className="block px-4 py-2 text-sm font-medium text-foreground rounded-md hover:bg-accent/30"
            >
              Dashboard
            </Link>
          </li>
          <li className="pt-4">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </header>
  )
}

export { Nav }
