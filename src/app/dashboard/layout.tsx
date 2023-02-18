"use client";

import Aside from "./components/aside";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const DashboardLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  console.log(session);
  if (!session) {
    return (
      <div className="flex flex-col gap-5 justify-center items-center h-[calc(100vh-92px)] w-full basis-6/7">
        You Are Not Authorised To Be Here
        <Link
          href={"/api/auth/signin"}
          className="px-6 py-3 rounded-md hover:rounded-lg bg-green-900 hover:bg-green-800 text-gray-300"
        >
          Sign In
        </Link>
        <Link
          href={"/api/auth/sighout"}
          className="px-6 py-3 rounded-md hover:rounded-lg bg-green-900 hover:bg-green-800 text-gray-300"
        >
          Sign Out
        </Link>
      </div>
    );
  }
  return (
    <section className="flex h-full">
      {/* Include shared UI here e.g. a header or sidebar */}
      <Aside />
      {children}
    </section>
  );
};

export default DashboardLayout;
