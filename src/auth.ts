import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig, User } from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/src/app/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
    } & Omit<User, "id">;
  }
}

export const {
  handlers: { GET, POST },
  signIn,signOut,
  auth,
} = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIET_ID,
      clientSecret: process.env.GITHUB_CLIET_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
