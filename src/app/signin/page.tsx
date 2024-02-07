"use client";
import { Button } from "@/src/components/ui/button";
import { signIn } from "@/src/auth";
import googleIcon from "../../../public/google-icon.svg";
import { Github } from "lucide-react";

function page() {
  return (
    <div className="flex h-[calc(100vh_-_10vh)] w-full pt-14">
      <div
        className="flex flex-col justify-start items-center w-full mt-20"
        suppressHydrationWarning
      >
        <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          <img src={googleIcon} className="text-2xl" />
          <span className="ml-3">Sign in with Google</span>
        </Button>
        <Button
          className="mt-6"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        >
          <Github className="text-3xl" />
          <span className="ml-3">Sign in with Github</span>
        </Button>
      </div>
    </div>
  );
}

export default page;
