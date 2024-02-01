"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfile from "@/src/components/ui/UserProfile";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Session } from "next-auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  session: Session | null;
};

function Nav({ session }: Props) {
  const path = usePathname();
  const user = session?.user;
  const [isOpened, setIsOpened] = useState(false);

  const toggleMenu = () => {
    setIsOpened(!isOpened);
  };

  return (
    <nav className="fixed w-full h-24 shadow-xl bg-gray-700 border-b-1 border-gray-900 dark:bg-slate-700  text-gray-300">
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
                <Link key={link.label} href={link.href}>
                  <li
                    className={` hover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                      path === "/" ? "active" : ""
                    }`}
                  >
                    {link.label}
                  </li>
                </Link>
              ))}
              {path && (
                <Link href="/dashboard">
                  <li
                    className={`hover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                      path === "/" ? "active" : ""
                    }`}
                  >
                    Dashboard
                  </li>
                </Link>
              )}

              {user && <UserProfile user={user} className="block" />}
            </ul>
          </nav>
        </div>
        {/* Menu Icon */}
        <div className="md:hidden flex justify-center items-center cursor-pointer">
          <AiOutlineMenu size={25} onClick={toggleMenu} />
        </div>
      </div>
      {/* Responsive Menu*/}
      <div
        className={`${
          isOpened
            ? "fixed left-0 top-0  w-full h-screen bg-gray-600 md:hidden ease-in duration-500"
            : "fixed left-[-100%] top-0 w-full h-screen bg-gray-600 ease-in duration-500"
        }`}
      >
        <div className="flex w-full justify-between items-start">
          <ul className="w-full flex flex-col justify-center items-center mt-14 ml-10">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <li
                  className={`py-4 cursor-pointer hover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                    path === "/" ? "active" : ""
                  }`}
                >
                  {link.label}
                </li>
              </Link>
            ))}
            {path && (
              <Link href="/dashboard">
                <li
                  className={`py-4 cursor-pointerhover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                    path === "/" ? "active" : ""
                  }`}
                >
                  Dashboard
                </li>
              </Link>
            )}

            {user && <UserProfile user={user} className="block" />}
          </ul>
          <div className="mt-9 mr-9 cursor-pointer" onClick={toggleMenu}>
            <AiOutlineClose size={25} className="fill-gray-500" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Nav };
