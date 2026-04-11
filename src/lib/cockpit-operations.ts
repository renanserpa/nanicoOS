/**
 * Cockpit Operations — Local editable state for operational control
 *
 * This layer separates read-only workspace data from locally-editable operational state.
 * Allows manual adjustments, status changes, notes, and priority shifts without
 * affecting the workspace source of truth.
 */

export interface TopicOperation {
  topicId: string;
  status?: "done" | "in-progress" | "queued" | "blocked";
  score?: number;
  blockers?: string[];
  priority?: "critical" | "high" | "normal" | "low";
  notes?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CockpitOperations {
  version: 1;
  createdAt: string;
  lastUpdated: string;
  updatedBy: string;
  topicOperations: Record<string, TopicOperation>;
}

/**
 * Default empty operations state
 */
export const defaultCockpitOperations: CockpitOperations = {
  version: 1,
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  updatedBy: "system",
  topicOperations: {},
};

/**
 * Types for operation updates
 */
export type TopicStatusUpdate = {
  topicId: string;
  status: "done" | "in-progress" | "queued" | "blocked";
  updatedBy: string;
};

export type TopicScoreUpdate = {
  topicId: string;
  score: number; // 0-100
  updatedBy: string;
};

export type TopicBlockerUpdate = {
  topicId: string;
  blockers: string[];
  updatedBy: string;
};

export type TopicPriorityUpdate = {
  topicId: string;
  priority: "critical" | "high" | "normal" | "low";
  updatedBy: string;
};

export type TopicNoteUpdate = {
  topicId: string;
  notes: string;
  updatedBy: string;
};

/**
 * Merge operations onto base cockpit state
 * Operations override base values for editable fields
 */
export function mergeOperationsIntoState(
  baseState: any,
  operations: CockpitOperations
): any {
  const merged = JSON.parse(JSON.stringify(baseState)); // Deep copy

  // Apply operations to topics
  merged.topics = merged.topics.map((topic: any) => {
    const operation = operations.topicOperations[topic.id];
    if (!operation) return topic;

    return {
      ...topic,
      status: operation.status ?? topic.status,
      score: operation.score ?? topic.score,
      blockers: operation.blockers ?? topic.blockers,
      priority: operation.priority ?? topic.priority,
      notes: operation.notes ?? topic.notes,
    };
  });

  return merged;
}

/**
 * Track which fields are editable vs read-only
 */
export interface FieldEditability {
  topicId: string;
  editableFields: {
    status: boolean;
    score: boolean;
    blockers: boolean;
    priority: boolean;
    notes: boolean;
  };
  readOnlyReason?: string; // e.g., "from workspace", "locked"
}

export function getFieldEditability(
  topicId: string,
  isFromWorkspace: boolean = false
): FieldEditability {
  // Workspace-derived topics have limited editability
  // Local topics are fully editable
  return {
    topicId,
    editableFields: {
      status: !isFromWorkspace,
      score: !isFromWorkspace,
      blockers: true, // Always editable
      priority: true, // Always editable
      notes: true, // Always editable
    },
    readOnlyReason: isFromWorkspace ? "from workspace" : undefined,
  };
}
