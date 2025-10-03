"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/src/lib/auth-client"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"

export default function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCredentials = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
      })
      console.log("SIGNUP RESULT:", res)
      if(res.data?.user){
        router.push("/")
        router.refresh()
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      await authClient.signIn.social({ provider: "google" })
    } catch (e: any) {
      setError(e?.message ?? "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card border rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Join to manage your content
        </p>
      </div>

      <div className="grid gap-4">
        <div className="relative text-center">
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            or
          </span>
          <div className="h-px bg-border" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        <Button
          onClick={handleCredentials}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
