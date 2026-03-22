export type NavLink = {
  href: string;
  label: string;
  type: "route" | "section";
};

export const navLinks: NavLink[] = [
  { href: "/", label: "home", type: "route" },
  { href: "/#projects", label: "projects", type: "section" },
  { href: "/blogs", label: "blog", type: "route" },
  { href: "/#about", label: "about", type: "section" },
  { href: "/#testimonials", label: "testimonials", type: "section" },
  { href: "/#contact", label: "contact", type: "section" },
  { href: "/dashboard", label: "dashboard", type: "route" },
];
