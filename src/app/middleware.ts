import { authConfig } from "@/lib/auth"
import NextAuth from "next-auth"
export const { auth: middleware } = NextAuth(authConfig)
