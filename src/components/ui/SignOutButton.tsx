"use client"
import { Button } from "@/src/components/ui/button"
import { authClient } from "@/src/lib/auth-client"
import { usePathname } from "next/navigation"

type Props = {}

export default function SignOutButton({}: Props) {
  const pathname = usePathname()
  return (
    <div className={`w-full ${pathname==="/dashboard"? "pr-4 mt-4" : "pr-4"} mb-4`}>
      <form
        action={() => {
          authClient.signOut()
        }}
      >
        <Button className="w-full p-0">Sign Out</Button>
      </form>
    </div>
  )
}
