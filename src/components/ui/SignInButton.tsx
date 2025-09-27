import { authClient } from "@/src/lib/auth-client"
import { Button } from "@/src/components/ui/button"

export default async function SignInButtons({
  type,
  user,
  className,
}: {
  type: "social" | "credentials"
  user?: { email: string; password: string }
  className?: string
}) {
  const { email, password } = user ?? { email: "", password: "" }
  return (
    <div className="flex flex-col gap-7 w-1/2 m-auto mb-5 justify-centeri items-center ">
      <form
        action={async () => {
          "use server"

          if (type === "social") {
            await authClient.signIn.social({ provider: "google" })
          } else {
            await authClient.signIn.email({ email, password })
          }
        }}
      >
        <Button className="m-auto w-full px-10 capitalize" type="submit">
          Sign in with Google
        </Button>
      </form>
    </div>
  )
}
