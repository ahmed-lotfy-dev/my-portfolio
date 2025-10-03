"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/src/lib/auth-client"
import { Button } from "@/src/components/ui/button"
import UserButton from "@/src/components/dashboard-components/UserButton"

export default function SignInButtons({ className }: { className?: string }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)

  const refreshSession = useCallback(async () => {
    try {
      const s: any = await authClient.getSession()
      setUser(s?.user ?? null)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  if (user) {
    return <UserButton className={className} />
  }

  return (
    <div className={`flex justify-center ${className ?? ""}`}>
      <Button type="button" onClick={() => router.push("/login")}>
        Sign in
      </Button>
    </div>
  )
}
