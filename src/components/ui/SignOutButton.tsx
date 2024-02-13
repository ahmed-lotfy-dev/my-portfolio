import { Button } from "@/src/components/ui/button";
import { signOut } from "@/auth";

type Props = {};

export default async function SignOutButton({}: Props) {
  return (
    <div className="w-full p-10">
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button className="w-full p-0">Sign Out</Button>
      </form>
    </div>
  );
}
