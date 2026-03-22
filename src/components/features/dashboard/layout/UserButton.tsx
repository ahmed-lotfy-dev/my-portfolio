"use client";

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
import Link from "next/link";
import { SignOutButton } from "@/src/components/features/auth/SignOutButton";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/src/lib/auth-client";
import { cn } from "@/src/lib/utils";

export default function UserButton({ className, user: initialUser }: { className?: string; user?: any }) {
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const t = useTranslations("nav");
  const locale = useLocale();

  const defaultAvatar =
    "https://api.dicebear.com/7.x/thumbs/svg?seed=guest&radius=50&backgroundType=gradientLinear&shapeColor=%23CBD5E1&mouth=smile";

  if (!user) {
    return (
      <div className={cn("shrink-0", className)}>
        <Link href={`/${locale}/login`}>
          <Button
            variant="ghost"
            className="h-10 rounded-full border border-primary/10 bg-transparent px-4 font-medium text-primary transition-all duration-300 hover:border-primary/25 hover:bg-primary/10 hover:text-primary-light"
          >
            {t("signin")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("shrink-0", className)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full border border-primary/10 bg-transparent p-0 transition-all duration-300 hover:border-primary/25 hover:bg-primary/10"
          >
            <Avatar className="h-10 w-10 ring-1 ring-primary/10">
              <AvatarImage
                src={user.image ?? defaultAvatar}
                alt={user.name ?? "User"}
              />
              <AvatarFallback className="text-xs font-medium">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.name ?? "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <SignOutButton
              variant="ghost"
              className="w-full justify-start cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {t("sign_out") || "Sign Out"}
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
