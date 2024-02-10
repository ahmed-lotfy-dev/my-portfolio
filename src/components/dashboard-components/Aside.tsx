"use client";
import Link from "next/link";
import { IoCodeWorkingSharp, IoTrophyOutline } from "react-icons/io5";
import { AiFillPlusCircle, AiFillHome } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { FaFileCode } from "react-icons/fa6";
import { PiCertificateFill } from "react-icons/pi";

export default function Aside() {
  return (
    <aside className="flex flex-initial flex-grow group h-full drop-shadow-lg">
      <div className="container mx-auto bg-gray-600 h-full p-6  space-y-5">
        <div className="flex gap-5 items-center mx-auto first:mt-2 ">
          <AiFillHome className="text-gray-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex transition-hover  duration-300 sm:flex"
            href="/"
          >
            Home Page
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <RiDashboardFill className="text-gray-300 w-[2rem] h-[2rem]" />

          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <FaFileCode className="text-gray-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard/projects"
          >
            Projects
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <PiCertificateFill className="text-gray-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard/certificates"
          >
            Certificates
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <AiFillPlusCircle className="text-gray-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex sm:flex"
            href="/dashboard/blogs/new"
          >
            Add Blog Post
          </Link>
        </div>
      </div>
    </aside>
  );
}
