"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "../ui/button";

type ButtonProps = {
  className: string;
};
export const LoginButton = ({ className, ...rest }: ButtonProps) => {
  return (
    <Button className={className} onClick={() => signIn()}>
      Sign in
    </Button>
  );
};

export const LogoutButton = ({ className, ...rest }: ButtonProps) => {
  return (
    <Button className={className} onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};
