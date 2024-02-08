import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { DefaultSession, NextAuthConfig, User } from "next-auth";
import { AuthConfig } from "@auth/core";

export const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.sub = user.id; 
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  // pages: {
  //   signIn: "/signin",
  //   signOut: "/api/auth/signout",
  // },
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
