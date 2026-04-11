/**
 * Workspace Bridge — Ingest real workspace files into cockpit
 *
 * This layer reads markdown files from ~/.openclaw/workspace and normalizes
 * them into cockpit state format. Uses file system access via API endpoints.
 */

import { CockpitState } from "@/data/cockpit-state";

export interface WorkspaceBridgeConfig {
  workspaceRoot: string; // e.g., "/Users/serpa/.openclaw/workspace"
  fallbackToMocks: boolean; // If true, use mocks when files are unavailable
}

/**
 * Parse Notion status from NOTION_STATUS_*.md file
 * Extracts database counts and operational status
 */
export function parseNotionStatus(content: string): {
  projectCount: number;
  taskCount: number;
  decisionCount: number;
  areaCount: number;
  lastUpdate: string;
} {
  const projectMatch = content.match(/### Projects[\s\S]*?- registros encontrados: (\d+)/);
  const taskMatch = content.match(/### Tasks[\s\S]*?- registros encontrados: (\d+)/);
  const decisionMatch = content.match(/### Decisions[\s\S]*?- registros encontrados: (\d+)/);
  const areaMatch = content.match(/### Areas[\s\S]*?- registros encontrados: (\d+)/);

  return {
    projectCount: parseInt(projectMatch?.[1] || "0", 10),
    taskCount: parseInt(taskMatch?.[1] || "0", 10),
    decisionCount: parseInt(decisionMatch?.[1] || "0", 10),
    areaCount: parseInt(areaMatch?.[1] || "0", 10),
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Parse topic score from TOPO_*.md file
 * Extracts score, state, and progress markers
 */
export function parseTopicScore(content: string): {
  score: number;
  status: "done" | "in-progress" | "queued" | "blocked";
  lastUpdate: string;
  source: string;
} {
  // Look for "estado atual: X/100" pattern
  const scoreMatch = content.match(/estado atual:\s*(\d+)\/100/);
  const score = parseInt(scoreMatch?.[1] || "0", 10);

  // Determine status from score
  let status: "done" | "in-progress" | "queued" | "blocked" = "queued";
  if (score === 100) status = "done";
  else if (score >= 30) status = "in-progress";
  else if (score > 0) status = "queued";

  return {
    score,
    status,
    lastUpdate: new Date().toISOString(),
    source: "workspace/architecture",
  };
}

/**
 * Extract artifact references from handoff files
 * Builds a map of document -> related topics
 */
export function parseArtifactReferences(
  content: string,
  artifactName: string
): Array<{ name: string; type: "handoff" | "architecture"; related?: string }> {
  // Simple extraction of markdown headers and section references
  const artifacts: Array<{ name: string; type: "handoff" | "architecture"; related?: string }> = [
    {
      name: artifactName,
      type: artifactName.includes("HANDOFF") ? "handoff" : "architecture",
    },
  ];

  // Extract referenced sections (h2 and h3 headers)
  const headerMatches = content.matchAll(/^#+\s+(.+)$/gm);
  for (const match of headerMatches) {
    const header = match[1];
    if (header && header.length > 3) {
      artifacts.push({
        name: header,
        type: "architecture",
      });
    }
  }

  return artifacts;
}

/**
 * Merge workspace data into cockpit state
 * Uses real data where available, falls back to mocks
 */
export function mergeWorkspaceData(
  baseCockpitState: CockpitState,
  workspaceData: Partial<CockpitState>
): CockpitState {
  const merged = { ...baseCockpitState };

  // Update metrics if workspace data has real counts
  if (workspaceData.metrics) {
    merged.metrics = {
      ...merged.metrics,
      ...workspaceData.metrics,
    };
  }

  // Update topics with workspace data (real Notion topics)
  if (workspaceData.topics && workspaceData.topics.length > 0) {
    // Update existing topics with workspace info
    merged.topics = merged.topics.map((topic) => {
      const workspaceTopic = workspaceData.topics?.find((t) => t.id === topic.id);
      return workspaceTopic ? { ...topic, ...workspaceTopic } : topic;
    });

    // Add new topics from workspace
    const existingIds = new Set(merged.topics.map((t) => t.id));
    const newTopics = (workspaceData.topics || []).filter(
      (t) => !existingIds.has(t.id)
    );
    merged.topics.push(...newTopics);
  }

  // Mark data source
  merged.lastUpdated = workspaceData.lastUpdated || new Date().toISOString();

  return merged;
}

/**
 * Data source metadata for transparency
 */
export interface DataSourceInfo {
  type: "mock" | "workspace" | "hybrid";
  sources: Array<{
    name: string;
    path: string;
    lastRead?: string;
  }>;
  coverage: {
    topics: "mock" | "real" | "hybrid";
    agents: "mock" | "real" | "hybrid";
    artifacts: "mock" | "real" | "hybrid";
    metrics: "mock" | "real" | "hybrid";
  };
}

export function createDataSourceInfo(isHybrid: boolean = false): DataSourceInfo {
  if (isHybrid) {
    return {
      type: "hybrid",
      sources: [
        {
          name: "NOTION_STATUS_2026-04-10.md",
          path: "~/.openclaw/workspace/integrations/NOTION_STATUS_2026-04-10.md",
        },
        {
          name: "TOPO_1_NOTION_V1_MINIMA.md",
          path: "~/.openclaw/workspace/architecture/TOPO_1_NOTION_V1_MINIMA.md",
        },
        {
          name: "Mock data fallback",
          path: "src/data/cockpit-state.ts",
        },
      ],
      coverage: {
        topics: "hybrid",
        agents: "mock",
        artifacts: "mock",
        metrics: "hybrid",
      },
    };
  }

  return {
    type: "mock",
    sources: [
      {
        name: "Default cockpit state",
        path: "src/data/cockpit-state.ts",
      },
    ],
    coverage: {
      topics: "mock",
      agents: "mock",
      artifacts: "mock",
      metrics: "mock",
    },
  };
}
