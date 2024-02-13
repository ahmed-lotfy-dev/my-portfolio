"use server";

import bcrypt from "bcrypt";
import { db } from "@/src/db";
import { users } from "@/src/db/schema/users";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const secrey = process.env.SECRET;
const key = new TextEncoder().encode(secrey);

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as unknown as string;
  try {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (dbUser) return;
    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = await db
      .insert(users)
      .values({ id: crypto.randomUUID(), name, email, password: hashedPw })
      .returning();
    const expires = new Date(Date.now() + 10 * 1000);
    const session = await encrypt({ newUser, expires });
    const cookieStore = cookies();
    cookieStore.set({
      name: "session",
      value: session,
      httpOnly: true,
      path: "/",
      expires,
    });
    redirect("/dashboard");
  } catch (error) {
    return { error };
  }
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
export async function setSession(session: any, expires: any): Promise<any> {}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) throw new Error("Wrong Credentials");
  const isMatched = await bcrypt.compare(user.password, password);
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });
  const cookieStore = cookies();
  cookieStore.set({
    name: "session",
    value: session,
    httpOnly: true,
    path: "/",
    expires,
  });
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
