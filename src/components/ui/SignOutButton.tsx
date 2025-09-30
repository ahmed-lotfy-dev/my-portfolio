"use client"
import { Button } from "@/src/components/ui/button"
import { authClient } from "@/src/lib/auth-client"

type Props = {}

export default function SignOutButton({}: Props) {
  return (
    <div className="w-full p-10">
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
