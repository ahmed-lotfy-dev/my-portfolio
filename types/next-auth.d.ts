import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken: unknown
    /** This is an example. You can find me in types/next-auth.d.ts */
    user: {
      /** The user's postal address. */
      id: string
      email: string
      role: string
    } & DefaultSession["user"]
  }
}

/**
 * The shape of the user object returned in the OAuth providers' `profile` callback,
 * or the second parameter of the `session` callback, when using a database.
 */
interface User {}
/**
 * Usually contains information about the provider being used
 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
 */
interface Account {}
/** The OAuth profile returned from your provider */
interface Profile {}

import { JWT } from "next-auth/jwt"

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    idToken?: string
  }
}
