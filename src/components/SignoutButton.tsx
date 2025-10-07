"use client"

import { authClient } from "@/src/lib/auth-client"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/")
              router.refresh()
            },
          },
        })
      }}
      className="w-full text-left text-destructive hover:text-destructive focus:text-destructive"
    >
      Sign Out
    </button>
  )
}
