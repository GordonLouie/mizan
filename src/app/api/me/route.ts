/**
 * GET /api/me — the authoritative, server-validated viewer.
 * Returns { email, tier, authConfigured }. The client uses this for the real
 * entitlement (LockedFeature), not localStorage.
 */
import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = await getViewer();
  return NextResponse.json(viewer);
}
