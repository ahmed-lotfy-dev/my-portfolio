"use client";
import Link from "next/link";
import {
  IoHomeOutline,
  IoGridOutline,
  IoCodeWorkingSharp,
  IoTrophyOutline,
} from "react-icons/io5";

export default function Aside() {
  return (
    <aside className="flex flex-initial flex-grow group h-full">
      <div className="container mx-auto bg-gray-600 h-full p-6  space-y-5">
        <div className="flex gap-5 items-center mx-auto first:mt-2 ">
          <IoHomeOutline className="text-blue-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex transition-hover  duration-300 sm:flex"
            href="/"
          >
            Home Page
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <IoGridOutline className="text-blue-300 w-[2rem] h-[2rem]" />

          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <IoCodeWorkingSharp className="text-blue-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard/projects"
          >
            Projects
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <IoTrophyOutline className="text-blue-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard/certificates"
          >
            Certificates
          </Link>
        </div>
      </div>
    </aside>
  );
}
