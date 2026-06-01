import { NextResponse } from "next/server";

/**
 * GET /api/flags
 *
 * Reads feature flags from FEATURE_FLAGS env var (JSON string).
 * Next.js auto-loads .env via Bun.
 *
 * Big company pattern: backend owns the truth, frontend consumes.
 * Flags configured server-side, exposed via API.
 *
 * Example .env:
 *   FEATURE_FLAGS={"maintenance":false,"newDashboard":true}
 */

function parseFlags(): Record<string, boolean> {
  try {
    const raw = process.env.FEATURE_FLAGS;
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, boolean>;
    }
    return {};
  } catch {
    console.error("[flags] Failed to parse FEATURE_FLAGS — expected valid JSON object");
    return {};
  }
}

export async function GET() {
  const flags = parseFlags();
  return NextResponse.json({
    flags,
    maintenance: flags.maintenance === true,
  });
}
