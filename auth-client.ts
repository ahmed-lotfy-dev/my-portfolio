import { createAuthClient } from "better-auth/client"
import { auth } from "./src/app/lib/auth.js"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [inferAdditionalFields<typeof auth>()],
})
