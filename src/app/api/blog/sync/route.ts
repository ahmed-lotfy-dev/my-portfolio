import { NextRequest, NextResponse } from "next/server";
import { syncBlogPosts } from "@/src/app/actions/postsActions";
import crypto from "crypto";

/**
 * GitHub Webhook / Manual Trigger for Blog Sync
 * POST /api/blog/sync
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const secret = process.env.SYNC_SECRET;

    // 1. Verify Signature (Industrial Standard)
    if (secret && signature) {
      const hmac = crypto.createHmac("sha256", secret);
      const digest = "sha256=" + hmac.update(payload).digest("hex");

      if (signature !== digest) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else if (secret && !signature) {
      // If secret is set but no signature provided (and not a manual Bearer call)
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 2. Trigger Sync
    const result = await syncBlogPosts();

    return NextResponse.json({
      message: "Sync completed successfully",
      count: result.count,
    });
  } catch (error: any) {
    console.error("[BlogSync API] Error:", error);
    return NextResponse.json(
      { error: "Sync failed", details: error.message },
      { status: 500 }
    );
  }
}

// Allow GET for manual debugging if needed (protected by secret)
export async function GET(request: NextRequest) {
  return POST(request);
}
