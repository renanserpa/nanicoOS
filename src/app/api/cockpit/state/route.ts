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
    let state = recalculateMetrics(defaultCockpitState);
    let isHybrid = false;

    // Try to load real workspace data
    const { readNotionStatus, readTopoNotionV1 } = await import("@/lib/workspace-reader");
    const { parseTopicScore } = await import("@/lib/workspace-bridge");

    const [notionStatusResult, topoResult] = await Promise.all([
      readNotionStatus(),
      readTopoNotionV1(),
    ]);

    // Process TOPO if available to update Notion v1 topic score
    if (topoResult.success && topoResult.content) {
      try {
        const topoData = parseTopicScore(topoResult.content);
        
        // Find and update the Notion v1 topic if it exists
        const notionV1Index = state.topics.findIndex(
          (t) => t.id === "topo-1-notion-v1"
        );
        if (notionV1Index !== -1) {
          state.topics[notionV1Index] = {
            ...state.topics[notionV1Index],
            score: topoData.score,
            status: topoData.status,
          };
        }
        
        isHybrid = true;
      } catch (parseError) {
        console.warn("Failed to parse TOPO:", parseError);
      }
    }

    // Ensure metrics are recalculated with any topic updates
    state = recalculateMetrics(state);

    // Merge local operations (user edits) into state
    try {
      const { mergeOperationsIntoState } = await import("@/lib/cockpit-operations");
      const { promises: fs } = await import("fs");
      const { resolve } = await import("path");
      
      const operationsFile = resolve(process.cwd(), "data", "cockpit-operations.json");
      const operationsContent = await fs.readFile(operationsFile, "utf-8");
      const operations = JSON.parse(operationsContent);
      
      state = mergeOperationsIntoState(state, operations);
      state = recalculateMetrics(state);
    } catch {
      // Operations file may not exist yet, that's fine
    }

    // Add data source information to response
    const responseBody = {
      ...state,
      _meta: {
        dataSource: isHybrid ? "hybrid" : "mock",
        workspaceReady: isHybrid,
        timestamp: new Date().toISOString(),
        notionStatusAvailable: notionStatusResult.success,
        topoAvailable: topoResult.success,
      },
    };

    return NextResponse.json(responseBody, {
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
