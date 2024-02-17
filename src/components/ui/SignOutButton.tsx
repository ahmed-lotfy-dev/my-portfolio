import React from "react";
import { Button } from "@/src/components/ui/button";
import { SignOutAction } from "@/src/app/actions";
type Props = {};

export default function SignOutButton({}: Props) {
  return (
    <form action={SignOutAction} className="w-full p-10">
      <Button className="w-full p-0">Sign Out</Button>
    </form>
  );
}
