import Link from "next/link";
import {
  IoHome,
  IoCode,
  IoGrid,
  IoRibbon,
  IoAddCircleSharp,
} from "react-icons/io5";

export default function Aside() {
  return (
    <aside className="flex flex-initial flex-grow group">
      <div className="container mx-auto bg-gray-600 h-full p-6  space-y-5">
        <div className="flex gap-5 items-center mx-auto first:mt-2 ">
          <IoHome className="text-gray-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex transition-hover  duration-300 sm:flex"
            href="/"
          >
            Home Page
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <IoGrid className="text-gray-300 w-[2rem] h-[2rem]" />

          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <IoCode className="text-gray-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard/projects"
          >
            Projects
          </Link>
        </div>
        <div className="flex gap-5 items-center mx-auto">
          <IoRibbon className="text-gray-300 w-[2rem] h-[2rem]" />
          <Link
            className="text-gray-100 hidden group-hover:flex  sm:flex"
            href="/dashboard/certificates"
          >
            Certificates
          </Link>
        </div>
        {/* Add New Post Link */}
        <div className="flex gap-5 items-center mx-auto">
          <IoAddCircleSharp className="text-gray-300 w-[2rem] h-[2rem]" />
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
