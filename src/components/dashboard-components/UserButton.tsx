"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import SignOutButton from "../ui/SignOutButton"
import { authClient } from "@/src/lib/auth-client"

export default function UserButton({
  className,
}: {
  className?: string
}) {
  const { data: session } = authClient.useSession.get()
  const user = session?.user

  // Crisp, neutral SVG avatar that matches most designs
  const defaultAvatar =
    "https://api.dicebear.com/7.x/thumbs/svg?seed=guest&radius=50&backgroundType=gradientLinear&shapeColor=%23CBD5E1&mouth=smile"

  // When not authenticated: show a clear sign-in button (no dropdown)
  if (!user) {
    return (
      <div className={className}>
        <Button
          type="button"
          onClick={() => authClient.signIn.social({ provider: "google" })}
          className="inline-flex items-center gap-2 px-6 md:px-8 whitespace-nowrap"
          variant="outline"
        >
          <Avatar className="h-6 w-6 ring-1 ring-gray-300 dark:ring-neutral-700">
            <AvatarImage src={defaultAvatar} alt="Guest" />
            <AvatarFallback className="text-[10px]">G</AvatarFallback>
          </Avatar>
          <span>Sign in with Google</span>
        </Button>
      </div>
    )
  }

  // When authenticated: keep dropdown for account actions
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
            <Avatar className="h-9 w-9 ring-1 ring-gray-300 dark:ring-neutral-700">
              <AvatarImage src={user.image ?? defaultAvatar} alt={user.name ?? "User"} />
              <AvatarFallback className="text-xs font-medium">
                {user.name ?? user.email ?? "User"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className="p-0">
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
