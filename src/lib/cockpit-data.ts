/**
 * Nanico OS Cockpit - Legacy Type Definitions
 * 
 * This file is kept for backward compatibility with existing code.
 * All actual mock data has been moved to src/data/cockpit-state.ts
 */

export interface Topic {
  id: string;
  name: string;
  score: number; // 0-100
  status: "done" | "in-progress" | "queued" | "blocked";
  executor: string; // agent name
  closureCriteria: string;
  estimatedCompletion?: string;
  blockers?: string[];
}

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  description: string;
  capabilities: string[];
  status: "online" | "offline" | "idle";
}

export interface Artifact {
  id: string;
  name: string;
  type: "document" | "file" | "handoff" | "workspace";
  url?: string;
  front: string; // category/initiative
  description: string;
  createdAt: string;
  relatedTopic?: string;
}

export interface SystemMetrics {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  queuedTopics: number;
  blockedTopics: number;
  averageScore: number;
  uptime: string;
}

// Re-export from cockpit-state for backward compatibility
export { defaultCockpitState as mockState } from "@/data/cockpit-state";
