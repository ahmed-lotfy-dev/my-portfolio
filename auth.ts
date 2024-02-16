import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    /** The user's postal address. */
    role: string;
  }
}

const config = {
  providers: [Google, Github],
  callbacks: {
    // @ts-ignore
    // async jwt({ user, trigger, session, token }: any) {
    //   if (user) {
    //     token.user = {
    //       _id: user._doc._id,
    //       email: user._doc.email,
    //       name: user._doc.name,
    //       isAdmin: user._doc.isAdmin,
    //     };
    //   }
    // },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
