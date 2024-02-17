import React from "react";
import { Button } from "@/src/components/ui/button";
import { SignInAction } from "@/src/app/actions";

export default function SignInButtons() {
  return (
    <div className="flex flex-col gap-7">
      <form action={SignInAction} className="w-1/3 m-auto mt-5">
        <input type="hidden" name="provider" value="github" />
        <Button className="w-full p-6">Sign In With Github</Button>
      </form>
      <form action={SignInAction} className="w-1/3 m-auto">
        <input type="hidden" name="provider" value="google" />
        <Button className="w-full p-6">Sign In With Google</Button>
      </form>
    </div>
  );
}
