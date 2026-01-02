"use client"

import { Button, ButtonProps } from "@/src/components/ui/button"
import { authClient } from "@/src/lib/auth-client"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"

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
    // Capture sign-out event before resetting PostHog
    posthog.capture("user_signed_out")
    posthog.reset()

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
