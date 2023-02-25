import "./globals.css";
import { Josefin_Sans, Josefin_Slab } from "@next/font/google";
import { Session } from "next-auth";
import { headers } from "next/headers";
import AuthContext from "@/src/app/AuthContext";
import Nav from "../components/nav";

const josefinsans = Josefin_Sans({
  variable: "--main-font",
});

const josefinslab = Josefin_Slab({
  variable: "--heading-font",
});

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(headers().get("cookie") ?? "");

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <AuthContext session={session}>
          <Nav />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
