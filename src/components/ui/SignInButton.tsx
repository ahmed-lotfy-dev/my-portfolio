import { signIn } from "@/lib/auth";
import { Button } from "@/src/components/ui/button";

export default async function SignInButtons({
  provider,
  className,
}: {
  provider?: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-7 w-1/2 m-auto mb-5 justify-centeri items-center ">
      <form
        action={async () => {
          "use server";
          await signIn(provider);
        }}
      >
        <Button className="m-auto w-full px-10 capitalize" type="submit">
          Sign in with {provider}
        </Button>
      </form>
    </div>
  );
}
