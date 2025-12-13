import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/src/db"
import * as schema from "@/src/db/schema"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema,
    provider: "pg",
    usePlural: true,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // Prevent users from setting their own role
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],

  trustedOrigins:
    process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : (() => {
          const baseUrl = process.env.BETTER_AUTH_URL || process.env.BASE_URL;
          if (!baseUrl) return [];
          
          // Add both www and non-www versions
          const origins = [baseUrl];
          if (baseUrl.includes('://www.')) {
            // If URL has www, add non-www version
            origins.push(baseUrl.replace('://www.', '://'));
          } else if (baseUrl.includes('://')) {
            // If URL doesn't have www, add www version
            origins.push(baseUrl.replace('://', '://www.'));
          }
          return origins;
        })(),
})
