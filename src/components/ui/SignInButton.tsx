"use client"
import { useState } from "react"
import { authClient } from "@/src/lib/auth-client"
import { Button } from "@/src/components/ui/button"

export default function SignInButtons({
  type,
  user,
  className,
}: {
  type: "social" | "credentials"
  user?: { email: string; password: string }
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const email = user?.email ?? ""
  const password = user?.password ?? ""

  const handleClick = async () => {
    setLoading(true)
    try {
      if (type === "social") {
        await authClient.signIn.social({ provider: "google" })
      } else {
        await authClient.signIn.email({ email, password })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex flex-col gap-7 w-1/2 m-auto mb-5 justify-center items-center ${className ?? ""}`}>
      <Button
        className="m-auto w-full px-10 capitalize"
        type="button"
        onClick={handleClick}
        disabled={loading}
      >
        {type === "social" ? (loading ? "Redirecting..." : "Sign in with Google") : loading ? "Signing in..." : "Sign in"}
      </Button>
    </div>
  )
}
