import { Button } from "@/src/components/ui/button";
import { SignInAction } from "@/src/app/actions";

export default function SignInButtons({
  provider,
  className,
}: {
  provider: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-7 w-1/2 m-auto mb-5">
      <form action={SignInAction} className="w-1/3 m-auto">
        <input type="hidden" name="provider" value={provider} />
        <Button className="w-full p-6">
          Sign In With {provider.toUpperCase()}
        </Button>
      </form>
    </div>
  );
}
