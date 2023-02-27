"use client";
import Link from "next/link";
import { useSession, getSession, signIn } from "next-auth/react";

const Page = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex h-full w-full justify-center items-start mt-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-full w-full justify-center items-start mt-10">
        <p>Access Denied</p>
        <Link href={"/api/auth/signin"}>Sign In</Link>
      </div>
    );
  }
  console.log(session);
  return (
    <div className="flex h-full w-full justify-center items-start mt-10">
      <h1>Welcome {session?.user?.name?.split(" ")[0]} to the dashboard</h1>
    </div>
  );
};

export default Page;
