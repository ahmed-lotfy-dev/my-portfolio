import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/src/db"
import * as schema from "@/src/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema,
    provider: "pg",

    usePlural: true, // ✅ tell Better Auth you’re using plurals
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
