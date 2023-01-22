"use client";

import { useState } from "react";
import Link from "next/link";
import { IoMenu, IoClose } from "react-icons/io5";

function Nav() {
  const [isOpened, setIsOpened] = useState(false);
  const toggle = () => setIsOpened(!isOpened);
  const close = () => setIsOpened(false);

  return (
    <header className=" bg-gray-700 border-b-2 border-gray-900 dark:bg-slate-700 relative text-gray-300">
      <div className="flex container mx-auto items-center justify-between">
        <h1 className="text-3xl font-bold py-8 pl-9 font-main cursor-pointer">
          &#123;AL&#125;
        </h1>
        <nav
          className={`flex md:hidden font-main text-cyan-50 justify-center items-center  ${
            isOpened ? "flex" : "hidden "
          } space-y-10 px-9 bg-gray-700 border-8 border-gray-400 flex-col absolute translate-y-[6.1rem] inset-0 h-[400px]`}
        >
          <Link
            href="/"
            className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm"
          >
            Home
          </Link>
          <Link
            href="/"
            className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800  transition-all rounded-sm"
          >
            Projects
          </Link>
          <Link
            href="/"
            className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800  transition-all rounded-sm"
          >
            Blog
          </Link>
          <Link
            href="/"
            className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800  transition-all rounded-sm"
          >
            Contact
          </Link>
        </nav>
        <nav className="hidden sm:flex font-main text-cyan-50  justify-center items-center space-x-7 mr-8">
          <Link
            href="/"
            className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm"
          >
            Home
          </Link>
          <Link
            href="/"
            className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800  transition-all rounded-sm"
          >
            Projects
          </Link>
          <Link
            href="/"
            className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800  transition-all rounded-sm"
          >
            Blog
          </Link>
          <Link
            href="/"
            className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800  transition-all rounded-sm"
          >
            Contact
          </Link>
        </nav>
        <IoMenu
          className="text-3xl font-bold sm:hidden mx-9 cursor-pointer"
          onClick={toggle}
          onBlur={close}
        />
      </div>
    </header>
  );
}

export default Nav;
