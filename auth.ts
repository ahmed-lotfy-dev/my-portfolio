import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/src/app/lib/db"

declare module "next-auth" {
  interface User {
    role: string
  }
}

const config = {
  adapter: PrismaAdapter(db),
  providers: [Google, Github],
  callbacks: {
    session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
        },
      }
    },
  },
  trustHost: true,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
