"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfile from "@/src/components/ui/UserProfile";
import { IoClose, IoMenu } from "react-icons/io5";
import { Session } from "next-auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/#blog", label: "Blog" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  session: Session | null;
};

export default function Nav({ session }: Props) {
  const path = usePathname();
  const user = session?.user;
  const [isOpened, setIsOpened] = useState(false);

  const toggleMenu = () => {
    setIsOpened(!isOpened);
  };

  console.log(isOpened);

  return (
    <nav className="fixed w-full bg-gray-700 border-b-1 border-gray-900 dark:bg-slate-700  text-gray-300">
      <div className="container flex justify-between h-full mx-auto">
        {/* Logo */}
        <div>
          <Link href={"/"} className="pl-10">
            <h1 className="text-3xl font-bold  py-7 font-main cursor-pointer">
              &#123;AL&#125;
            </h1>
          </Link>
        </div>
        {/* Nav */}
        <div>
          <>
            <nav
              className={`w-full h-24 shadow-xl justify-end items-center ${
                isOpened
                  ? "flex w-full h-full bg-red-700"
                  : "hidden md:flex gap-5 font-main text-cyan-50"
              } `}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={` hover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                    path === "/" ? "active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {path && (
                <Link
                  href="/dashboard"
                  className={`hover:text-blue-400 hover:border-b-4 hover:border-b-blue-600 transition-all delay-75 duration-250 ${
                    path === "/" ? "active" : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}

              {user && <UserProfile user={user} className="block" />}
            </nav>
            {isOpened ? (
              <IoClose
                className={`text-3xl font-bold mr-3 cursor-pointer md:hidden`}
                onClick={toggleMenu}
              />
            ) : (
              <IoMenu
                className={`text-3xl font-bold mr-3 cursor-pointer md:hidden`}
                onClick={toggleMenu}
              />
            )}
          </>
        </div>
      </div>
    </nav>
  );
}
