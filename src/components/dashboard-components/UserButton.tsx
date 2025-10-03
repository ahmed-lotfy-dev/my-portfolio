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
import { authClient } from "@/src/lib/auth-client" // import the auth client
import { usePathname, useRouter } from "next/navigation"

export default function UserButton({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = authClient.useSession.get()

  // Crisp, neutral SVG avatar that matches most designs
  const defaultAvatar =
    "https://api.dicebear.com/7.x/thumbs/svg?seed=guest&radius=50&backgroundType=gradientLinear&shapeColor=%23CBD5E1&mouth=smile"

  // When not authenticated: show a clear sign-in button (no dropdown)\
  const user = session?.user
  console.log({ user })
  if (!user) {
    return (
      <div className={className}>
        <Button
          type="button"
          onClick={() => router.push("/login")}
          className={`inline-flex items-center gap-2 whitespace-nowrap ${
            pathname === "/dashboard" ? "pl-3 mb-1 " : ""
          }`}
          variant="outline"
        >
          <Avatar className="h-6 w-6 ring-1 ring-gray-300 dark:ring-neutral-700">
            <AvatarImage src={defaultAvatar} alt="Guest" />
            <AvatarFallback className="text-[10px]">G</AvatarFallback>
          </Avatar>
          <span>Sign in</span>
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
              <AvatarImage
                src={user.image ?? defaultAvatar}
                alt={user.name ?? "User"}
              />
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
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.refresh() 
                  },
                },
              })
            }}
            className="text-destructive focus:text-destructive"
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
