import Link from "next/link"
import ThemeToggle from "@/src/components/ThemeToggle"
import {
  IoHome,
  IoCode,
  IoGrid,
  IoRibbon,
  IoAddCircleSharp,
} from "react-icons/io5"
import UserButton from "@/src/components/dashboard-components/UserButton"

export default async function Aside() {
  return (
    <aside className="flex flex-col w-56 border-r bg-card pl-5 pt-10 gap-10">
      <div className="h-full space-y-4 flex flex-col gap-6 justify-between content-start">
        <div className="flex flex-col gap-6 ">
          <div className="flex gap-5 items-start first:mt-2">
            <IoHome className="text-muted-foreground w-6 h-6" />
            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/"
            >
              Home Page
            </Link>
          </div>
          <div className="flex gap-5 items-start">
            <IoGrid className="text-muted-foreground w-6 h-6" />

            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </div>
          <div className="flex gap-5 items-start">
            <IoCode className="text-muted-foreground w-6 h-6" />
            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/dashboard/projects"
            >
              Projects
            </Link>
          </div>
          <div className="flex gap-5 items-start">
            <IoRibbon className="text-muted-foreground w-6 h-6" />
            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/dashboard/certificates"
            >
              Certificates
            </Link>
          </div>
          {/* Add New Post Link */}
          <div className="flex gap-5 items-start">
            <IoAddCircleSharp className="text-muted-foreground w-6 h-6" />
            <Link
              className="text-foreground/90 hover:text-primary transition-colors"
              href="/dashboard/blogs/new"
            >
              Add Blog Post
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 pr-5 pb-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </aside>
  )
}
