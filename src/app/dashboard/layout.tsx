"use client";
import Aside from "./components/aside";
import Loading from "./components/loading";
import Notauth from "./components/notauth";

import { useSession, signIn } from "next-auth/react";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  if (status === "loading") {
    return <Loading />;
  }
  if (status === "unauthenticated") {
    return <Notauth />;
  }
  console.log(session);
  if (role === "ADMIN" || role === "USER") {
    return (
      <div className="flex h-[calc(100vh_-_10vh)] w-full">
        <Aside />
        {children}
      </div>
    );
  }
}
