import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: unknown;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: string;
  }
}

interface User {
  role: string;
}

interface Account {}
interface Profile {}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
