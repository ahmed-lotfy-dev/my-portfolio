import { NextRequest, NextResponse } from "next/server";
import { syncBlogPosts } from "@/src/app/actions/postsActions";

/**
 * GitHub Webhook / Manual Trigger for Blog Sync
 * POST /api/blog/sync
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Basic Auth / Token check (Optional but highly recommended)
    const authHeader = request.headers.get("authorization");
    const secret = process.env.SYNC_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
