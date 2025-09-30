"use client"
import { ReactNode, useState } from "react"
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

  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)

  console.log(pathname)
  return (
    <header
      className={`${
        pathname === "/dashboard" ? "hidden" : "fixed"
      } inset-x-0 top-0 z-50 bg-gradient-to-r from-blue-400/70 to-blue-500/70 backdrop-blur-md supports-[backdrop-filter]:bg-blue-400/60 shadow-md `}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="">
          <Image src={LogoImage} width={100} height={100} alt={"Logo"} />
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden flex-1 items-center justify-center ml-auto gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative inline-flex items-center text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-blue-900"
                    : "text-gray-100 hover:text-white"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/dashboard"
              className={`text-sm font-semibold transition-colors ${
                pathname === "/dashboard"
                  ? "text-blue-900"
                  : "text-gray-100 hover:text-white"
              }`}
              aria-current={pathname === "/dashboard" ? "page" : undefined}
            >
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Right side (slots) */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {children}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={toggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-blue-300/40 md:hidden"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Overlay */}
        <div
          onClick={close}
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Panel */}
        <div
          className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-white/90 backdrop-blur-md shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b px-4 bg-gradient-to-r from-blue-50/80 to-blue-100/80 backdrop-blur">
            <Link
              href="/"
              onClick={close}
              className="text-lg font-bold text-blue-900"
            >
              {`{AL}`}
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-blue-200/40"
            >
              <X className="h-5 w-5 text-blue-900" />
            </button>
          </div>

          <ul className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    pathname === link.href
                      ? "bg-blue-100/60 text-blue-900"
                      : "text-gray-800 hover:bg-blue-50/60 hover:text-blue-900"
                  }`}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/dashboard"
                onClick={close}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/dashboard"
                    ? "bg-blue-100/60 text-blue-900"
                    : "text-gray-800 hover:bg-blue-50/60 hover:text-blue-900"
                }`}
                aria-current={pathname === "/dashboard" ? "page" : undefined}
              >
                Dashboard
              </Link>
            </li>
            <ThemeToggle />
          </ul>
        </div>
      </div>
    </header>
  )
}

export { Nav }
