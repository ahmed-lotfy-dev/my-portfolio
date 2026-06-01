import createMiddleware from "next-intl/middleware";
import { routing } from "@/src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - /api (API routes)
  // - /_next/static (static files)
  // - /_next/image (image optimization)
  // - /favicon.ico (favicon)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
