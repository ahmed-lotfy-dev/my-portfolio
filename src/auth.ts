import NextAuth from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/src/db";
import { authConfig } from "@/src/auth.config";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  // @ts-ignore
  adapter: DrizzleAdapter(db),
  ...authConfig,
});
