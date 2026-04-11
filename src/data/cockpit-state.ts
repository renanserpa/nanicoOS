/**
 * Nanico OS Cockpit — Centralized State
 * 
 * This is the single source of truth for all cockpit data.
 * Future integrations (Supabase, Notion, Obsidian) will update this structure.
 */

export interface CockpitState {
  lastUpdated: string; // ISO timestamp
  topics: Array<{
    id: string;
    name: string;
    score: number; // 0-100
    status: "done" | "in-progress" | "queued" | "blocked";
    executor: string;
    closureCriteria: string;
    estimatedCompletion?: string;
    blockers?: string[];
  }>;
  agents: Array<{
    id: string;
    name: string;
    emoji: string;
    role: string;
    description: string;
    capabilities: string[];
    status: "online" | "offline" | "idle";
  }>;
  artifacts: Array<{
    id: string;
    name: string;
    type: "document" | "file" | "handoff" | "workspace";
    url?: string;
    front: string;
    description: string;
    createdAt: string;
    relatedTopic?: string;
  }>;
  metrics: {
    totalTopics: number;
    completedTopics: number;
    inProgressTopics: number;
    queuedTopics: number;
    blockedTopics: number;
    averageScore: number;
    uptime: string;
  };
}

/**
 * Default cockpit state — structured for easy future updates
 * This will be loaded as the base state; future integrations will populate it from real sources
 */
export const defaultCockpitState: CockpitState = {
  lastUpdated: new Date().toISOString(),
  
  topics: [
    // COMPLETED INITIATIVES
    {
      id: "ccn-notion",
      name: "CCN / Notion Integration Complete",
      score: 100,
      status: "done",
      executor: "nanico",
      closureCriteria: "Full Notion integration with CCN model complete",
      estimatedCompletion: "Completed 2026-04-05",
    },
    {
      id: "obsidian-structure",
      name: "Obsidian Vault Structure Setup",
      score: 100,
      status: "done",
      executor: "Claude Code",
      closureCriteria: "Initial Obsidian structure and folder organization complete",
      estimatedCompletion: "Completed 2026-04-03",
    },
    {
      id: "nanico-cockpit-v1",
      name: "Nanico Cockpit V1 Launch",
      score: 100,
      status: "done",
      executor: "Claude Code",
      closureCriteria: "Full cockpit with overview, kanban, topics, artifacts, agents visible",
      estimatedCompletion: "Completed 2026-04-10",
    },

    // ACTIVE INITIATIVES (IN PROGRESS)
    {
      id: "notion-v1-operational",
      name: "Notion v1 — Minimal Operational State",
      score: 45,
      status: "in-progress",
      executor: "nanico",
      closureCriteria: "Core Notion workflows functional: project pages, task tracking, status updates",
      blockers: ["Waiting on final schema validation from Codex"],
      estimatedCompletion: "2026-04-18",
    },
    {
      id: "openclaw-hygiene",
      name: "OpenClaw Structural Hygiene Phase 1",
      score: 30,
      status: "in-progress",
      executor: "GeminiCLI",
      closureCriteria: "Directory structure organized, configs normalized, duplicates removed",
      estimatedCompletion: "2026-04-20",
    },
    {
      id: "cockpit-v1-polish",
      name: "Nanico Cockpit V1 — Polish & UX",
      score: 60,
      status: "in-progress",
      executor: "Claude Code",
      closureCriteria: "Visual refinement, branding alignment, blocked/active item emphasis",
      estimatedCompletion: "2026-04-14",
    },
    {
      id: "agent-dispatch-improvements",
      name: "Agent Dispatch & Coordination Layer",
      score: 35,
      status: "in-progress",
      executor: "nanico",
      closureCriteria: "Agents can self-report progress, status updates integrated into cockpit",
      estimatedCompletion: "2026-04-22",
    },

    // QUEUED / BACKLOG ITEMS
    {
      id: "notion-obsidian-bridge",
      name: "Notion ↔ Obsidian Bidirectional Bridge",
      score: 0,
      status: "queued",
      executor: "Codex",
      closureCriteria: "Real-time sync between Notion and Obsidian with conflict resolution",
      estimatedCompletion: "After Notion v1 completion",
    },
    {
      id: "personal-bootstrap",
      name: "Personal Bootstrap from Nanico OS",
      score: 0,
      status: "queued",
      executor: "nanico",
      closureCriteria: "Personal workflow fully bootstrapped, daily systems operational",
      estimatedCompletion: "2026-05-01",
    },
    {
      id: "openclaw-phase2",
      name: "OpenClaw Hygiene Phase 2 — Config Standardization",
      score: 0,
      status: "queued",
      executor: "GeminiCLI",
      closureCriteria: "All config files follow standard schema, env vars documented",
      estimatedCompletion: "2026-05-10",
    },
    {
      id: "cockpit-realtime",
      name: "Cockpit V2 — Real-time Agent Status Updates",
      score: 0,
      status: "queued",
      executor: "Claude Code",
      closureCriteria: "Live agent status, websocket integration, real-time score updates",
      estimatedCompletion: "2026-05-15",
    },
    {
      id: "skill-registry",
      name: "Skill Registry & Discovery System",
      score: 0,
      status: "queued",
      executor: "Codex",
      closureCriteria: "Agents can register, discover, and invoke skills dynamically",
      estimatedCompletion: "2026-05-20",
    },

    // BLOCKED ITEMS (WAITING ON DEPENDENCIES)
    {
      id: "ui-config-sync",
      name: "UI ↔ Config Real Synchronization",
      score: 25,
      status: "blocked",
      executor: "Claude Code",
      closureCriteria: "UI state fully synchronized with actual system config, no manual updates",
      blockers: ["Awaiting config schema finalization from Codex"],
      estimatedCompletion: "Pending dependency resolution",
    },
    {
      id: "notion-api-integration",
      name: "Notion API Direct Integration",
      score: 15,
      status: "blocked",
      executor: "Codex",
      closureCriteria: "Direct API calls to Notion, no manual exports/imports",
      blockers: [
        "Notion API credentials not yet configured",
        "Rate limiting strategy needs design",
      ],
      estimatedCompletion: "Pending setup",
    },
  ],

  agents: [
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
  ],

  artifacts: [
    {
      id: "handoff-cockpit-v1",
      name: "HANDOFF — Cockpit V1 Launch",
      type: "handoff",
      url: "/api/files/download?path=/.openclaw/workspace/handoffs/HANDOFF_CLAUDECODE_CONTINUATION_2026-04-10.md",
      front: "Orchestration Infrastructure",
      description: "Complete Nanico cockpit V1 specification with visual design, data structure, and UX requirements",
      createdAt: "2026-04-10",
      relatedTopic: "nanico-cockpit-v1",
    },
    {
      id: "handoff-cockpit-polish",
      name: "HANDOFF — Cockpit V1 Polish Phase",
      type: "handoff",
      url: "/api/files/download?path=/.openclaw/workspace/handoffs/HANDOFF_COCKPIT_POLISH.md",
      front: "Orchestration Infrastructure",
      description: "Branding refinement, UX improvements, and visual polish for Nanico OS cockpit",
      createdAt: "2026-04-10",
      relatedTopic: "cockpit-v1-polish",
    },
    {
      id: "notion-schema",
      name: "Notion Integration Schema v2",
      type: "document",
      front: "Data Integration",
      description: "CCN Notion integration schema with mapping tables, field definitions, and API endpoints",
      createdAt: "2026-04-08",
      relatedTopic: "ccn-notion",
    },
    {
      id: "obsidian-vault",
      name: "Obsidian Vault Structure",
      type: "workspace",
      front: "Knowledge Management",
      description: "Organized vault structure: daily notes, projects, research, literature",
      createdAt: "2026-04-07",
      relatedTopic: "obsidian-structure",
    },
    {
      id: "notion-v1-spec",
      name: "Notion v1 Minimal Spec",
      type: "document",
      front: "Product Specification",
      description: "Scope for minimal viable Notion integration: projects, tasks, status tracking",
      createdAt: "2026-04-09",
      relatedTopic: "notion-v1-operational",
    },
    {
      id: "config-sync-spec",
      name: "Config Sync Architecture",
      type: "document",
      front: "System Architecture",
      description: "Design for bidirectional UI ↔ config synchronization without manual updates",
      createdAt: "2026-04-05",
      relatedTopic: "ui-config-sync",
    },
    {
      id: "openclaw-audit",
      name: "OpenClaw Directory Audit Report",
      type: "file",
      front: "Infrastructure Hygiene",
      description: "Complete audit of ~/.openclaw structure with recommendations for organization",
      createdAt: "2026-04-09",
      relatedTopic: "openclaw-hygiene",
    },
    {
      id: "bridge-design",
      name: "Notion-Obsidian Bridge Architecture",
      type: "document",
      front: "Data Integration",
      description: "Design for bidirectional sync with conflict resolution and real-time updates",
      createdAt: "2026-04-10",
      relatedTopic: "notion-obsidian-bridge",
    },
    {
      id: "agent-dispatch-spec",
      name: "Agent Dispatch Protocol v1",
      type: "document",
      front: "System Architecture",
      description: "Protocol for agents to self-report progress, blockers, and completions",
      createdAt: "2026-04-10",
      relatedTopic: "agent-dispatch-improvements",
    },
    {
      id: "skill-registry-design",
      name: "Skill Registry System Design",
      type: "document",
      front: "System Architecture",
      description: "Architecture for dynamic skill registration, discovery, and invocation",
      createdAt: "2026-04-09",
      relatedTopic: "skill-registry",
    },
  ],

  metrics: {
    totalTopics: 15,
    completedTopics: 3,
    inProgressTopics: 4,
    queuedTopics: 5,
    blockedTopics: 2,
    averageScore: 44.3,
    uptime: "100%",
  },
};

/**
 * Helper function to update metrics based on topics
 * This ensures metrics always stay in sync with topic data
 */
export function recalculateMetrics(state: CockpitState): CockpitState {
  const { topics } = state;
  return {
    ...state,
    lastUpdated: new Date().toISOString(),
    metrics: {
      totalTopics: topics.length,
      completedTopics: topics.filter((t) => t.status === "done").length,
      inProgressTopics: topics.filter((t) => t.status === "in-progress").length,
      queuedTopics: topics.filter((t) => t.status === "queued").length,
      blockedTopics: topics.filter((t) => t.status === "blocked").length,
      averageScore: Math.round(
        (topics.reduce((sum, t) => sum + t.score, 0) / topics.length) * 10
      ) / 10,
      uptime: state.metrics.uptime,
    },
  };
}
