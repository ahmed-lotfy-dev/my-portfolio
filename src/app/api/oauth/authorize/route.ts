import { NextRequest, NextResponse } from "next/server"

import { absoluteUrl, siteConfig } from "@/src/lib/agent-ready/site"

export async function GET(request: NextRequest) {
  const loginUrl = new URL(absoluteUrl(siteConfig.loginPath))
  const redirectUri = request.nextUrl.searchParams.get("redirect_uri")

  if (redirectUri) {
    loginUrl.searchParams.set("redirect_uri", redirectUri)
  }

  loginUrl.searchParams.set("agent_auth", "interactive")

  return NextResponse.redirect(loginUrl)
}
