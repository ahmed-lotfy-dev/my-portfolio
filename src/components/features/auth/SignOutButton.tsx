"use client"

import { Button, ButtonProps } from "@/src/components/ui/button"
import { authClient } from "@/src/lib/auth-client"
import { useRouter } from "next/navigation"

interface SignOutButtonProps extends ButtonProps {
  redirectUrl?: string
}

export function SignOutButton({
  children,
  redirectUrl = "/login",
  onClick,
  ...props
}: SignOutButtonProps) {
  const router = useRouter()

  const handleSignOut = async () => {

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(redirectUrl)
          router.refresh()
        },
      },
    })
  }

  return (
    <Button onClick={handleSignOut} {...props}>
      {children}
    </Button>
  )
}
