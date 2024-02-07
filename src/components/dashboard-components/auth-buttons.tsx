import { Button } from "@/src/components/ui/button";
import { SignInAction, SignOutAction } from "@/src/app/actions";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={SignInAction}>
      <Button {...props}>Sign In</Button>
    </form>
  );
}

export async function SignOut(
  props: React.ComponentPropsWithRef<typeof Button>
) {
  return (
    <form action={SignOutAction} className="w-full">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
