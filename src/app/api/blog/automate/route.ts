import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.WORKER_URL || "http://worker:3001";
const secret = process.env.SYNC_SECRET;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${WORKER_URL}/trigger/blog`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Worker error" }));
      return NextResponse.json(err, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Failed to reach worker:", e);
    return NextResponse.json(
      { error: "Worker unreachable" },
      { status: 502 },
    );
  }
}
