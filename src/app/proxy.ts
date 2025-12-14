import { NextRequest, NextResponse } from "next/server"

// Middleware removed - PostHog proxying handled by next.config.ts rewrites
// Authentication handled in server actions

export async function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [], // No middleware needed
}
