import { NextRequest, NextResponse } from "next/server";
import { defaultCockpitState, recalculateMetrics } from "@/data/cockpit-state";

/**
 * GET /api/cockpit/state
 * 
 * Returns the current cockpit state — topics, agents, artifacts, and metrics.
 * This is the single source of truth for all cockpit data.
 * 
 * Future evolution:
 * - Load from Notion database
 * - Load from Obsidian vault
 * - Load from workspace handoffs
 * - Load from Supabase
 * 
 * For now, serves the defaultCockpitState with recalculated metrics.
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Future integrations would load from real sources here
    // e.g., const state = await loadStateFromNotion();
    // For now, use the default state with fresh metrics
    
    const state = recalculateMetrics(defaultCockpitState);

    return NextResponse.json(state, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching cockpit state:", error);
    return NextResponse.json(
      { error: "Failed to fetch cockpit state" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cockpit/state
 * 
 * Future: Allow authorized agents to update cockpit state
 * For now, this is a placeholder for future agent-driven updates
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement authorization and state mutation
    // For now, return a 405 Method Not Allowed
    
    return NextResponse.json(
      { error: "State mutations not yet implemented" },
      { status: 405 }
    );
  } catch (error) {
    console.error("Error updating cockpit state:", error);
    return NextResponse.json(
      { error: "Failed to update cockpit state" },
      { status: 500 }
    );
  }
}
