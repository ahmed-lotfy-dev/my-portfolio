import { auth } from "@/src/lib/auth" // the server instance from better-auth
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import Link from "next/link"
import { headers } from "next/headers"
import SignOutButton from "@/src/components/SignoutButton"

export default async function UserButton({
  className,
}: {
  className?: string
}) {
  const header =await headers()
  const session = await auth.api.getSession({headers:header}) 
  const user = session?.user

  const defaultAvatar =
    "https://api.dicebear.com/7.x/thumbs/svg?seed=guest&radius=50&backgroundType=gradientLinear&shapeColor=%23CBD5E1&mouth=smile"

  if (!user) {
    return (
      <div className={className}>
        <Link href="/login">
          <Button variant="outline">Sign in</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
            <Avatar className="h-9 w-9 ring-1 ring-gray-300 dark:ring-neutral-700">
              <AvatarImage
                src={user.image ?? defaultAvatar}
                alt={user.name ?? "User"}
              />
              <AvatarFallback className="text-xs font-medium">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.name ?? "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
