import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
})
