/**
 * GET /api/cockpit/external-backends
 *
 * Returns status of all external backends (Notion, Obsidian, Supabase, etc.)
 * This endpoint provides read-only visibility into backend systems.
 *
 * Response structure:
 * - notion: Notion database status and minimal metadata
 * - obsidian: Obsidian vault structure and note count
 * - supabase: Reserved space for future database backend
 *
 * All bridges are resilient — if one fails, others continue reporting.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllExternalBridges } from "@/lib/external-bridges";

export async function GET(request: NextRequest) {
  try {
    const bridges = await getAllExternalBridges();

    return NextResponse.json(bridges, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching external backends:", error);

    // Return graceful degradation response
    return NextResponse.json(
      {
        error: "Unable to fetch external backend status",
        timestamp: new Date().toISOString(),
        notion: {
          available: false,
          error: "Service check failed",
        },
        obsidian: {
          available: false,
          error: "Service check failed",
        },
        supabase: {
          available: false,
          status: "planned",
          error: "Reserved for Phase 6",
        },
      },
      {
        status: 200, // Return 200 even on partial failure — graceful degradation
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Content-Type": "application/json",
        },
      }
    );
  }
}
