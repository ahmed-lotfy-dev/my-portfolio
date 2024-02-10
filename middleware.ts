import { auth } from "@/src/auth";

export const middleware = auth;

export const config = { matcher: ["/dashboard"] };
