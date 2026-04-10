/**
 * Nanico OS Cockpit V1 - Mock Data
 * Static data structure for orchestration visualization
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

// System Metrics
export interface SystemMetrics {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  queuedTopics: number;
  blockedTopics: number;
  averageScore: number;
  uptime: string;
}

// ============= MOCK DATA =============

export const mockTopics: Topic[] = [
  {
    id: "ccn-notion",
    name: "CCN / Notion completo",
    score: 100,
    status: "done",
    executor: "nanico",
    closureCriteria: "Full Notion integration with CCN model complete",
    estimatedCompletion: "Completed",
  },
  {
    id: "obsidian-structure",
    name: "Obsidian, estruturação inicial",
    score: 100,
    status: "done",
    executor: "Claude Code",
    closureCriteria: "Initial Obsidian structure setup complete",
    estimatedCompletion: "Completed",
  },
  {
    id: "notion-v1",
    name: "Notion v1 mínima operacional",
    score: 35,
    status: "in-progress",
    executor: "nanico",
    closureCriteria: "Core Notion workflows functional and integrated",
    blockers: ["UI ↔ config real integration pending"],
    estimatedCompletion: "Next 2 weeks",
  },
  {
    id: "hygiene-openclaw",
    name: "Higiene estrutural ~/.openclaw",
    score: 15,
    status: "in-progress",
    executor: "GeminiCLI",
    closureCriteria: "Directory structure organized, configs normalized",
    estimatedCompletion: "Next 3 weeks",
  },
  {
    id: "notion-obsidian-bridge",
    name: "Ponte Notion → Obsidian",
    score: 0,
    status: "queued",
    executor: "Codex",
    closureCriteria: "Bidirectional sync between Notion and Obsidian",
    estimatedCompletion: "After Notion v1 completion",
  },
  {
    id: "personal-bootstrap",
    name: "personal bootstrap from nanicoOS",
    score: 0,
    status: "queued",
    executor: "nanico",
    closureCriteria: "Personal workflow fully bootstrapped and operational",
    estimatedCompletion: "Backlog",
  },
  {
    id: "ui-config-sync",
    name: "UI ↔ config real",
    score: 25,
    status: "blocked",
    executor: "Claude Code",
    closureCriteria: "UI state fully synchronized with actual system config",
    blockers: ["Awaiting config schema finalization"],
    estimatedCompletion: "Pending dependency resolution",
  },
];

export const mockAgents: Agent[] = [
  {
    id: "nanico",
    name: "nanico",
    emoji: "🦞",
    role: "Central Orchestrator",
    description: "Main system orchestrator and context maintainer",
    capabilities: [
      "System orchestration",
      "Context management",
      "Score tracking",
      "Agent dispatch",
      "Tool management",
    ],
    status: "online",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    emoji: "💻",
    role: "Development Executor",
    description: "Code development and UI implementation",
    capabilities: [
      "Frontend development",
      "Backend implementation",
      "UI/UX design",
      "Architecture design",
      "Testing & debugging",
    ],
    status: "online",
  },
  {
    id: "geminical",
    name: "GeminiCLI",
    emoji: "🧠",
    role: "Analysis & Structure",
    description: "System analysis and structural hygiene",
    capabilities: [
      "File system analysis",
      "Structure organization",
      "Dependency mapping",
      "Configuration validation",
      "Pattern recognition",
    ],
    status: "online",
  },
  {
    id: "codex",
    name: "Codex",
    emoji: "📚",
    role: "Integration Bridge",
    description: "System integrations and bridge development",
    capabilities: [
      "API integration",
      "Data synchronization",
      "Protocol implementation",
      "Bridge development",
      "Documentation",
    ],
    status: "idle",
  },
];

export const mockArtifacts: Artifact[] = [
  {
    id: "handoff-cockpit-v1",
    name: "HANDOFF — Cockpit V1",
    type: "handoff",
    url: "/api/files/download?path=/.openclaw/workspace/handoffs/HANDOFF_CLAUDECODE_NANICO_COCKPIT_V1.md",
    front: "Orchestration Infrastructure",
    description: "Nanico cockpit V1 specification and requirements",
    createdAt: "2026-04-10",
    relatedTopic: "cockpit-v1",
  },
  {
    id: "notion-schema",
    name: "Notion Integration Schema",
    type: "document",
    url: "/memory/notion-schema.md",
    front: "Data Integration",
    description: "Complete CCN Notion integration schema and mappings",
    createdAt: "2026-04-08",
    relatedTopic: "ccn-notion",
  },
  {
    id: "obsidian-vault",
    name: "Obsidian Vault Structure",
    type: "workspace",
    front: "Knowledge Management",
    description: "Initial Obsidian vault structure and organization",
    createdAt: "2026-04-07",
    relatedTopic: "obsidian-structure",
  },
  {
    id: "config-sync-spec",
    name: "Config Sync Specification",
    type: "document",
    url: "/docs/config-sync-spec.md",
    front: "System Architecture",
    description: "UI ↔ Config real synchronization specification",
    createdAt: "2026-04-05",
    relatedTopic: "ui-config-sync",
  },
  {
    id: "openclaw-audit",
    name: "OpenClaw Directory Audit",
    type: "file",
    front: "Infrastructure Hygiene",
    description: "Complete audit of ~/.openclaw directory structure",
    createdAt: "2026-04-09",
    relatedTopic: "hygiene-openclaw",
  },
  {
    id: "bridge-design",
    name: "Notion-Obsidian Bridge Design",
    type: "document",
    url: "/docs/bridge-design.md",
    front: "Data Integration",
    description: "Architecture for bidirectional Notion ↔ Obsidian sync",
    createdAt: "2026-04-10",
    relatedTopic: "notion-obsidian-bridge",
  },
];

export const mockMetrics: SystemMetrics = {
  totalTopics: mockTopics.length,
  completedTopics: mockTopics.filter((t) => t.status === "done").length,
  inProgressTopics: mockTopics.filter((t) => t.status === "in-progress").length,
  queuedTopics: mockTopics.filter((t) => t.status === "queued").length,
  blockedTopics: mockTopics.filter((t) => t.status === "blocked").length,
  averageScore:
    Math.round(
      (mockTopics.reduce((sum, t) => sum + t.score, 0) / mockTopics.length) * 10
    ) / 10,
  uptime: "100%",
};

export function getTopicsByStatus(status: Topic["status"]): Topic[] {
  return mockTopics.filter((t) => t.status === status);
}

export function getAgentTopics(agentName: string): Topic[] {
  return mockTopics.filter((t) => t.executor === agentName);
}

export function getArtifactsByFront(front: string): Artifact[] {
  return mockArtifacts.filter((a) => a.front === front);
}

export function getUniqueFronts(): string[] {
  return [...new Set(mockArtifacts.map((a) => a.front))].sort();
}
