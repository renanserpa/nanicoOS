/**
 * GET /api/cockpit/operations
 * PUT /api/cockpit/operations
 *
 * Read and update local cockpit operations state.
 * This is the control layer for manual cockpit adjustments.
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { resolve } from "path";
import {
  CockpitOperations,
  defaultCockpitOperations,
  TopicStatusUpdate,
  TopicScoreUpdate,
  TopicBlockerUpdate,
  TopicPriorityUpdate,
  TopicNoteUpdate,
} from "@/lib/cockpit-operations";

const OPERATIONS_FILE = resolve(process.cwd(), "data", "cockpit-operations.json");

/**
 * Read operations from local file with fallback
 */
async function readOperations(): Promise<CockpitOperations> {
  try {
    const content = await fs.readFile(OPERATIONS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    // File doesn't exist yet, return default
    return defaultCockpitOperations;
  }
}

/**
 * Write operations to local file
 */
async function writeOperations(operations: CockpitOperations): Promise<void> {
  try {
    // Ensure data directory exists
    const dir = resolve(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      OPERATIONS_FILE,
      JSON.stringify(operations, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Failed to write operations:", error);
    throw error;
  }
}

/**
 * GET /api/cockpit/operations
 * Returns current operations state
 */
export async function GET(request: NextRequest) {
  try {
    const operations = await readOperations();
    return NextResponse.json(operations, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error reading cockpit operations:", error);
    return NextResponse.json(
      { error: "Failed to read operations" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cockpit/operations
 * Update operations state with action
 * Body: { action: "updateStatus"|"updateScore"|..., payload: {...} }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    let operations = await readOperations();

    // Apply operation based on action type
    switch (action) {
      case "updateStatus":
        operations = applyStatusUpdate(operations, payload as TopicStatusUpdate);
        break;

      case "updateScore":
        operations = applyScoreUpdate(operations, payload as TopicScoreUpdate);
        break;

      case "updateBlockers":
        operations = applyBlockerUpdate(operations, payload as TopicBlockerUpdate);
        break;

      case "updatePriority":
        operations = applyPriorityUpdate(operations, payload as TopicPriorityUpdate);
        break;

      case "addNote":
        operations = applyNoteUpdate(operations, payload as TopicNoteUpdate);
        break;

      case "clearOperation":
        operations = clearOperation(operations, payload.topicId);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    // Update metadata
    operations.lastUpdated = new Date().toISOString();
    operations.updatedBy = payload.updatedBy || "system";

    // Write to file
    await writeOperations(operations);

    return NextResponse.json(operations, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Error updating cockpit operations:", error);
    return NextResponse.json(
      { error: "Failed to update operations" },
      { status: 500 }
    );
  }
}

/**
 * Apply status update to operations
 */
function applyStatusUpdate(
  ops: CockpitOperations,
  update: TopicStatusUpdate
): CockpitOperations {
  return {
    ...ops,
    topicOperations: {
      ...ops.topicOperations,
      [update.topicId]: {
        ...(ops.topicOperations[update.topicId] || {
          topicId: update.topicId,
          updatedAt: new Date().toISOString(),
          updatedBy: update.updatedBy,
        }),
        status: update.status,
        updatedAt: new Date().toISOString(),
        updatedBy: update.updatedBy,
      },
    },
  };
}

/**
 * Apply score update to operations
 */
function applyScoreUpdate(
  ops: CockpitOperations,
  update: TopicScoreUpdate
): CockpitOperations {
  // Clamp score to 0-100
  const score = Math.max(0, Math.min(100, update.score));

  return {
    ...ops,
    topicOperations: {
      ...ops.topicOperations,
      [update.topicId]: {
        ...(ops.topicOperations[update.topicId] || {
          topicId: update.topicId,
          updatedAt: new Date().toISOString(),
          updatedBy: update.updatedBy,
        }),
        score,
        updatedAt: new Date().toISOString(),
        updatedBy: update.updatedBy,
      },
    },
  };
}

/**
 * Apply blocker update to operations
 */
function applyBlockerUpdate(
  ops: CockpitOperations,
  update: TopicBlockerUpdate
): CockpitOperations {
  return {
    ...ops,
    topicOperations: {
      ...ops.topicOperations,
      [update.topicId]: {
        ...(ops.topicOperations[update.topicId] || {
          topicId: update.topicId,
          updatedAt: new Date().toISOString(),
          updatedBy: update.updatedBy,
        }),
        blockers: update.blockers,
        updatedAt: new Date().toISOString(),
        updatedBy: update.updatedBy,
      },
    },
  };
}

/**
 * Apply priority update to operations
 */
function applyPriorityUpdate(
  ops: CockpitOperations,
  update: TopicPriorityUpdate
): CockpitOperations {
  return {
    ...ops,
    topicOperations: {
      ...ops.topicOperations,
      [update.topicId]: {
        ...(ops.topicOperations[update.topicId] || {
          topicId: update.topicId,
          updatedAt: new Date().toISOString(),
          updatedBy: update.updatedBy,
        }),
        priority: update.priority,
        updatedAt: new Date().toISOString(),
        updatedBy: update.updatedBy,
      },
    },
  };
}

/**
 * Apply note update to operations
 */
function applyNoteUpdate(
  ops: CockpitOperations,
  update: TopicNoteUpdate
): CockpitOperations {
  return {
    ...ops,
    topicOperations: {
      ...ops.topicOperations,
      [update.topicId]: {
        ...(ops.topicOperations[update.topicId] || {
          topicId: update.topicId,
          updatedAt: new Date().toISOString(),
          updatedBy: update.updatedBy,
        }),
        notes: update.notes,
        updatedAt: new Date().toISOString(),
        updatedBy: update.updatedBy,
      },
    },
  };
}

/**
 * Clear all operations for a topic
 */
function clearOperation(ops: CockpitOperations, topicId: string): CockpitOperations {
  const { [topicId]: _, ...remaining } = ops.topicOperations;
  return {
    ...ops,
    topicOperations: remaining,
  };
}
