import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import SignOutButton from "../ui/SignOutButton";
import { auth } from "@/src/app/lib/auth";
import SignInButton from "../ui/SignInButton";

export default async function UserButton({
  className,
}: {
  className?: string;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative w-8 h-8 rounded-full">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={user?.image || user?.image || "https://placehold.co/150"}
                alt={`${user?.name} ` ?? ``}
              />
              <AvatarFallback>{user?.email}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            {user ? (
              <SignOutButton />
            ) : (
              <div className="flex flex-col">
                <SignInButton provider="google" />
                <SignInButton provider="github" />
              </div>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
