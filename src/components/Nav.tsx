"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, SidebarClose } from "lucide-react";
import { useSession } from "next-auth/react";
import UserButton from "./dashboard-components/UserButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function Nav() {
  const path = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [isOpened, setIsOpened] = useState(false);
  console.log(user);
  const toggleMenu = () => {
    setIsOpened(!isOpened);
  };

  return (
    <nav className="relative w-full h-24 shadow-xl bg-gray-700 border-b-1 border-gray-900 dark:bg-slate-700  text-gray-300">
      <div className="container flex justify-between w-full h-full">
        {/* Logo */}
        <div>
          <Link href={"/"} className="">
            <h1 className="text-3xl font-bold  py-7 font-main cursor-pointer">
              &#123;AL&#125;
            </h1>
          </Link>
        </div>
        {/* Nav */}
        <div className="flex justify-center items-center">
          <nav className="flex justify-center items-center">
            <ul
              className={`hidden md:flex md:justify-center md:items-center ${
                isOpened
                  ? "flex w-full h-full bg-red-700"
                  : "hidden md:flex gap-5 font-main text-cyan-50"
              } `}
            >
              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className={` hover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                    path === "/" ? "active" : ""
                  }`}
                >
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              {path && (
                <li
                  className={`hover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                    path === "/" ? "active" : ""
                  }`}
                >
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              )}
            </ul>
          </nav>

          <UserButton className="absolute right-20 md:ml-5 md:static" />
          
        </div>
        {/* Menu Icon */}
        <div className="md:hidden flex justify-center items-center cursor-pointer">
          <Menu size={25} onClick={toggleMenu} />
        </div>
      </div>
      {/* Responsive Menu*/}
      <div
        className={`${
          isOpened
            ? "fixed left-[0%] top-0  w-full h-svh bg-gray-600 md:hidden ease-in duration-500"
            : "fixed left-[100%] top-0 w-full h-svh bg-gray-600 ease-in duration-500"
        }`}
      >
        <div className="flex w-full justify-between items-start">
          <ul className="w-full flex flex-col justify-start items-center h-screen mt-14 ml-20">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className={`py-4 cursor-pointer hover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                  path === "/" ? "active" : ""
                }`}
              >
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            {path && (
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
          <div className="mt-9 mr-9 cursor-pointer" onClick={toggleMenu}>
            <SidebarClose size={25} className="fill-gray-500" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Nav };
