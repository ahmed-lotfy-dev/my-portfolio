import { NextResponse } from "next/server";

/**
 * Health check endpoint for Docker container monitoring
 * Returns 200 OK when the application is running properly
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
