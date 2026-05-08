export type NavLink = {
  href: string;
  label: string;
  type: "route" | "section";
};

export const navLinks: NavLink[] = [
  { href: "/", label: "home", type: "route" },
  { href: "/projects", label: "projects", type: "route" },
  { href: "/blogs", label: "blog", type: "route" },
  { href: "/about", label: "about", type: "route" },
  { href: "/contact", label: "contact", type: "route" },
];
