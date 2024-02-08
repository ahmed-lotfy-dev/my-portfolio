import { signIn, signOut } from "@/src/auth";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export function SignIn(
  props: Omit<React.ComponentPropsWithRef<typeof Link>, "href">
) {
  return (
    <>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
        className="w-full"
      >
        <Button className="px-5 py-3">Sign in with Google</Button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
        className="w-full"
      >
        <Button className="px-5 py-3">Sign in with Github</Button>
      </form>
    </>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <Button className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
