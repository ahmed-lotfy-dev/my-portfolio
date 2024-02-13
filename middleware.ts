import { NextRequest } from "next/server";
import { updateSession } from "@/src/app/actions/authActions";

export async function middleware(request: NextRequest) {
  console.log("refreshed");
  return await updateSession(request);
}
