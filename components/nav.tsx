import Link from "next/link";
import { IoMenu } from "react-icons/io5";

function Nav() {
  return (
    <header className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-bold py-5 pl-7 font-main">&#123;AL&#125;</h1>
      <nav className="hidden sm:flex justify-between items-center px-8 space-x-6 ">
        <Link
          href="/"
          className="hover:text-red-700 hover:border-b-4 hover:border-b-red-800 transition-all rounded-sm"
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
        <Link
          href="/"
          className="bg-orange-400 rounded-md hover:bg-orange-500 text-blue-100 transition-all hover:rounded-lg border-2 border-solid border-red-800 px-4 py-1"
        >
          Resume
        </Link>
      </nav>
      <IoMenu className="text-3xl font-bold sm:hidden mx-6" />
    </header>
  );
}

export default Nav;
