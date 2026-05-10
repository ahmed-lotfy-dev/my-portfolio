import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

const WORKER_URL = process.env.WORKER_URL || "http://worker:3001";
const secret = process.env.SYNC_SECRET;

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (
      session?.user?.role !== "ADMIN" &&
      session?.user?.email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { type } = await req.json();

    if (!["full", "sql", "media"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid type" },
        { status: 400 },
      );
    }

    const res = await fetch(`${WORKER_URL}/trigger/backup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Worker error" }));
      return NextResponse.json(
        { success: false, ...err },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Failed to reach worker:", e);
    return NextResponse.json(
      { success: false, error: "Worker unreachable" },
      { status: 502 },
    );
  }
}
