import { createAuthClient } from "better-auth/client"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  // For Next.js, omit baseURL to use the current origin automatically
  plugins: [inferAdditionalFields<typeof auth>()],
})
