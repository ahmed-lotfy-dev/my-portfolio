"use client";
import Aside from "./components/aside";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full justify-center items-start mt-10">
        <p>Loading...</p>
      </div>
    );
  }
  if (status === "unauthenticated") {
    return (
      <div className="flex">
        <Aside />
        <div className="flex flex-col gap-3 h-screen w-full justify-start items-center mt-10">
          <p>Access Denied</p>
          <Link href={"/api/auth/signin"}>Sign In</Link>
        </div>
      </div>
    );
  }
  console.log(session);
  if (role === "ADMIN" || role === "USER") {
    return (
      <div className="flex h-screen w-full">
        <Aside />
        {children}
      </div>
    );
  }
}
