import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.SYNC_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  exec("bun run run:blog", {
    cwd: process.cwd(),
    env: { ...process.env },
    shell: "/bin/sh",
  });

  return NextResponse.json({ message: "Blog automation started" });
}
