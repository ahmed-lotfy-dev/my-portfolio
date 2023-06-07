"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IoMenu, IoClose } from "react-icons/io5"

function Nav() {
  const path = usePathname()
  const [isOpened, setIsOpened] = useState(false)
  const toggle = (e: any) => {
    setIsOpened(!isOpened)
    console.log(path)
  }
  const close = () => setIsOpened(false)

  return (
    <header className=' bg-gray-700 border-b-2 border-gray-900 dark:bg-slate-700 relative sm:static text-gray-300 '>
      <div className='flex container mx-auto px-5 items-center justify-between max-w-screen-xl'>
        <Link href={"/"}>
          <h1 className='text-3xl font-bold ml-3 py-7 font-main cursor-pointer'>
            &#123;AL&#125;
          </h1>
        </Link>
        <nav
          className={`flex flex-0  gap-7 sm:relative sm:flex-row sm:border-none sm:h-auto sm:space-x-0 sm:self-center  font-main text-cyan-50 justify-center items-center bg-gray-700 border-8 border-gray-400 flex-col inset-0 h-[400px] ${
            isOpened
              ? "flex animate-openmenu duration-500 translate-y-[6.4rem] absolute opacity-1 "
              : "hidden opacity-0 transition-all duration-500 sm:relative sm:flex sm:opacity-100"
          }`}
        >
          <Link
            href='/'
            className={`hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm ${
              path === "/" ? "active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href='/projects'
            className={`hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm ${
              path === "/projects" ? "active" : ""
            }`}
          >
            Projects
          </Link>
          <Link
            href='/blog'
            className={`hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm ${
              path === "/blog" ? "active" : ""
            }`}
          >
            Blog
          </Link>
          <Link
            href='/certificates'
            className={`hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm ${
              path === "/certificates" ? "active" : ""
            }`}
          >
            Certificates
          </Link>
          <Link
            href='/about'
            className={`hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm ${
              path === "/about" ? "active" : ""
            }`}
          >
            About
          </Link>
          <Link
            href='/contact'
            className={`hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm ${
              path === "/contact" ? "active" : ""
            }`}
          >
            Contact
          </Link>
          <Link
            href='/dashboard'
            className={`hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all delay-75 duration-250 rounded-sm ${
              path === "/contact" ? "active" : ""
            }`}
          >
            DASHBOARD
          </Link>
        </nav>

        <IoMenu
          className='text-3xl font-bold sm:hidden mr-3 cursor-pointer z-50 items-end'
          onClick={toggle}
          onBlur={close}
        />
      </div>
    </header>
  )
}

export default Nav
