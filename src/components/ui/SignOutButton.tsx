import { authClient } from "@/auth-client"
import { Button } from "@/src/components/ui/button"

type Props = {}

export default async function SignOutButton({}: Props) {
  return (
    <div className="w-full p-10">
      <form
        action={async () => {
          "use server"
          await authClient.signOut()
        }}
      >
        <Button className="w-full p-0">Sign Out</Button>
      </form>
    </div>
  )
}
