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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import Link from "next/link";
import { SignOutButton } from "@/src/components/features/auth/SignOutButton";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/src/lib/auth-client";
import { cn } from "@/src/lib/utils";
import { 
  IoPerson, 
  IoSettingsOutline, 
  IoGridOutline, 
  IoLogOutOutline,
  IoShieldCheckmarkOutline
} from "react-icons/io5";

export default function UserButton({ 
  className, 
  user: initialUser,
  isInline = false,
  onItemClick
}: { 
  className?: string; 
  user?: any;
  isInline?: boolean;
  onItemClick?: () => void;
}) {
  const { data: session } = authClient.useSession();
  const user = initialUser || session?.user;
  const t = useTranslations("nav");
  const locale = useLocale();

  const defaultAvatar =
    "https://api.dicebear.com/7.x/thumbs/svg?seed=guest&radius=50&backgroundType=gradientLinear&shapeColor=%23CBD5E1&mouth=smile";

  if (!user) {
    return (
      <div className={cn(isInline ? "w-full" : "shrink-0", className)}>
        <Link href={`/${locale}/login`} onClick={isInline ? onItemClick : undefined} className={isInline ? "block w-full" : ""}>
          <Button
            variant="ghost"
            className={cn(
              "h-10 rounded-full border border-primary/20 bg-primary/5 font-medium text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/20 hover:text-primary-light active:scale-95 shadow-sm shadow-primary/5",
              isInline ? "w-full justify-center" : "px-5"
            )}
          >
            {t("signin")}
          </Button>
        </Link>
      </div>
    );
  }

  if (isInline && user) {
    return (
      <div className={cn("flex flex-col space-y-4", className)}>
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-10 w-10 ring-1 ring-primary/20">
            <AvatarImage src={user.image ?? defaultAvatar} alt={user.name ?? "User"} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 overflow-hidden">
            <p className="text-sm font-bold leading-none text-white truncate font-heading tracking-tight">
              {user.name ?? "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <Link
            href={`/${locale}/dashboard`}
            onClick={onItemClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-primary/10 hover:text-primary text-muted-foreground"
          >
            <IoGridOutline className="h-5 w-5" />
            <span className="font-medium">{t("dashboard") || "Dashboard"}</span>
          </Link>
          
          <Link
            href={`/${locale}/dashboard/profile`}
            onClick={onItemClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-primary/10 hover:text-primary text-muted-foreground"
          >
            <IoPerson className="h-5 w-5" />
            <span className="font-medium">{t("profile") || "Profile"}</span>
          </Link>

          <Link
            href={`/${locale}/dashboard/profile#settings`}
            onClick={onItemClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-primary/10 hover:text-primary text-muted-foreground"
          >
            <IoSettingsOutline className="h-5 w-5" />
            <span className="font-medium">{t("settings") || "Settings"}</span>
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <div className={cn("shrink-0", className)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group relative h-10 w-10 rounded-full border border-primary/20 bg-card/40 p-0 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)] active:scale-95"
          >
            <Avatar className="h-full w-full ring-1 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
              <AvatarImage
                src={user.image ?? defaultAvatar}
                alt={user.name ?? "User"}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          className="mt-6 w-64 glass-premium p-1.5 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2" 
          align="end" 
          forceMount
        >
          <DropdownMenuLabel className="mb-2 px-3 py-2.5">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-1 ring-primary/20">
                <AvatarImage src={user.image ?? defaultAvatar} alt={user.name ?? "User"} />
                <AvatarFallback className="text-xs">{user.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 overflow-hidden">
                <p className="text-sm font-bold leading-none text-foreground truncate font-heading tracking-tight">
                  {user.name ?? "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            {isAdmin && (
              <div className="mt-2 flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary w-fit">
                <IoShieldCheckmarkOutline className="h-3 w-3" />
                Admin
              </div>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-primary/10 mx-1" />

          <DropdownMenuGroup className="py-1">
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/dashboard`}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                <IoGridOutline className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="font-medium">{t("dashboard") || "Dashboard"}</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/dashboard/profile`}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                <IoPerson className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="font-medium">{t("profile") || "Profile"}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/dashboard/profile#settings`}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                <IoSettingsOutline className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="font-medium">{t("settings") || "Settings"}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-primary/10 mx-1" />

          <div className="p-1">
            <SignOutButton
              variant="ghost"
              className="group flex h-9 w-full cursor-pointer items-center justify-start gap-3 rounded-lg px-3 text-sm text-destructive transition-all duration-200 hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
            >
              <IoLogOutOutline className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span className="font-medium">{t("sign_out") || "Sign Out"}</span>
            </SignOutButton>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
