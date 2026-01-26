import { NextRequest, NextResponse } from "next/server";
import { syncBlogPosts } from "@/src/app/actions/postsActions";
import crypto from "crypto";

/**
 * GitHub Webhook / Manual Trigger for Blog Sync
 * POST /api/blog/sync
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const signature = request.headers.get("x-hub-signature-256");
    const secret = process.env.SYNC_SECRET;

    if (!secret) {
      console.warn("SYNC_SECRET is not set, skipping auth check (NOT RECOMMENDED)");
    } else {
      let isAuthorized = false;

      // 1. Try Bearer Token (Manual Trigger)
      if (authHeader === `Bearer ${secret}`) {
        isAuthorized = true;
      }
      // 2. Try GitHub Signature (Webhook)
      else if (signature) {
        const body = await request.text();
        const hmac = crypto.createHmac("sha256", secret);
        const digest = "sha256=" + hmac.update(body).digest("hex");

        if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
          isAuthorized = true;
        } else {
          console.error("Invalid GitHub usage signature");
        }
      }

      if (!isAuthorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 2. Trigger Sync
    const result = await syncBlogPosts();

    return NextResponse.json({
      message: "Sync completed successfully",
      count: result.count,
      reconciled: result.reconciled,
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
