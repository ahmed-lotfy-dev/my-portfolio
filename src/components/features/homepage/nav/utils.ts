import type { NavLink } from "./config";

export function stripLocale(pathname: string, locale: string) {
  const normalized = pathname.replace(new RegExp(`^/${locale}`), "");
  return normalized === "" ? "/" : normalized;
}

export function localizeHref(locale: string, href: string) {
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

export function isActiveLink(
  link: NavLink,
  normalizedPath: string,
  activeSection: string | null
) {
  if (link.type === "section") {
    return normalizedPath === "/" && activeSection === link.href.replace("/", "");
  }

  if (link.href === "/") {
    return normalizedPath === "/" && !activeSection;
  }

  return normalizedPath === link.href || normalizedPath.startsWith(`${link.href}/`);
}
