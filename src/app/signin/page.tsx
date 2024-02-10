"use client";
import { Button } from "@/src/components/ui/button";
import { signIn } from "next-auth/react";
import GithubIcon from "@/public/icons/logo-github.svg";
import GoogleIcon from "@/public/icons/logo-google.svg";
import Image from "next/image";

function page() {
  return (
    <div className="flex h-[calc(100vh_-_10vh)] w-full pt-14">
      <div
        className="flex flex-col justify-start items-center w-full mt-20"
        suppressHydrationWarning
      >
        <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          <Image
            src={GoogleIcon}
            width={25}
            height={25}
            alt="GoogleIcon"
            className="text-2xl"
          />
          <span className="ml-3">Sign in with Google</span>
        </Button>
        <Button
          className="mt-6"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        >
          <Image
            src={GithubIcon}
            width={25}
            height={25}
            alt="GoogleIcon"
            color="white"
            className="text-2xl"
          />
          <span className="ml-3">Sign in with Github</span>
        </Button>
      </div>
    </div>
  );
}

export default page;
