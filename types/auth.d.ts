import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    name: string;
    email: string;
    image: string;
    accessToken: string;
    id: string;
    role: string;
  }

  interface Session extends DefaultSession {
    user: DefaultUser;
    accessToken: unknown;
    expires: DateTime;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    id: string;
    role: string;
  }
}
