/**
 * GET /api/cockpit/backends
 *
 * Aggregated status of all external backends:
 * - Notion (operational database)
 * - Obsidian (cognitive vault)
 * - Supabase (planned, future)
 *
 * This is a read-only, resilient endpoint that doesn't break
 * if any backend is temporarily unavailable.
 */

import { NextRequest, NextResponse } from "next/server";

export interface BackendStatus {
  notion: {
    connected: boolean;
    lastRead?: string;
    projects?: number;
    tasks?: number;
    decisions?: number;
    areas?: number;
    total?: number;
    error?: string;
  };
  obsidian: {
    present: boolean;
    accessible: boolean;
    noteCount: number;
    hasIndex: boolean;
    error?: string;
  };
  supabase: {
    planned: boolean;
    status: "not_started" | "planned" | "in_progress" | "ready";
  };
  lastUpdated: string;
}

export async function GET(request: NextRequest) {
  try {
    const [notionStatus, obsidianStatus] = await Promise.all([
      fetchNotionStatus(),
      fetchObsidianStatus(),
    ]);

    const response: BackendStatus = {
      notion: {
        connected: notionStatus.connected,
        lastRead: notionStatus.lastSuccessfulRead,
        projects: notionStatus.bases.projects.recordCount,
        tasks: notionStatus.bases.tasks.recordCount,
        decisions: notionStatus.bases.decisions.recordCount,
        areas: notionStatus.bases.areas.recordCount,
        total: notionStatus.totalRecords,
        error: notionStatus.error,
      },
      obsidian: {
        present: obsidianStatus.present,
        accessible: obsidianStatus.accessible,
        noteCount: obsidianStatus.noteCount,
        hasIndex: obsidianStatus.hasMainIndex,
        error: obsidianStatus.error,
      },
      supabase: {
        planned: true,
        status: "planned",
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching backend status:", error);
    // Return degraded but functional response
    return NextResponse.json(
      {
        notion: { connected: false, error: "Failed to fetch" },
        obsidian: { present: false, accessible: false, noteCount: 0, hasIndex: false },
        supabase: { planned: true, status: "planned" as const },
        lastUpdated: new Date().toISOString(),
      },
      { status: 200 } // Still 200 so the cockpit doesn't panic
    );
  }
}

/**
 * Fetch Notion status with error handling
 */
async function fetchNotionStatus() {
  try {
    const { fetchNotionStatus } = await import("@/lib/notion-bridge");
    return await fetchNotionStatus();
  } catch (error) {
    console.error("Error in Notion bridge:", error);
    return {
      connected: false,
      lastSuccessfulRead: new Date().toISOString(),
      bases: {
        projects: { id: "", name: "Projects", recordCount: 0, lastQueried: new Date().toISOString() },
        tasks: { id: "", name: "Tasks", recordCount: 0, lastQueried: new Date().toISOString() },
        decisions: { id: "", name: "Decisions", recordCount: 0, lastQueried: new Date().toISOString() },
        areas: { id: "", name: "Areas", recordCount: 0, lastQueried: new Date().toISOString() },
      },
      totalRecords: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch Obsidian status with error handling
 */
async function fetchObsidianStatus() {
  try {
    const { fetchObsidianStatus } = await import("@/lib/obsidian-bridge");
    return await fetchObsidianStatus();
  } catch (error) {
    console.error("Error in Obsidian bridge:", error);
    return {
      present: false,
      accessible: false,
      lastChecked: new Date().toISOString(),
      vaultPath: "",
      noteCount: 0,
      hasMainIndex: false,
      hasContextMap: false,
      hasDecisionLog: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
