import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "./src/db";
import { eq } from "drizzle-orm";
import { users } from "./src/db/schema/users";
import type { User } from "./src/db/schema/users";
import { z } from "zod";
import credentials from "next-auth/providers/credentials";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
      role: string;
      id: string;
      name: string;
      email: string;
    } & Omit<User, "id">;
  }
}

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isLoggedIn) {
        return true;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      return `/dashboard`;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(5) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          console.log({ user });
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  secret: process.env.SECRET,
} satisfies NextAuthConfig;
