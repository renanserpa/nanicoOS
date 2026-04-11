/**
 * Cockpit Overview
 * System summary and key metrics
 */

import { CockpitState } from "@/data/cockpit-state";
import { CockpitBackends } from "./CockpitBackends";
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  Zap,
  TrendingUp,
} from "lucide-react";

interface CockpitOverviewProps {
  metrics: CockpitState["metrics"];
  lastUpdated: string;
}

export function CockpitOverview({ metrics, lastUpdated }: CockpitOverviewProps) {
  const scorePercentage = Math.round(metrics.averageScore);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Main Headline */}
      <div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          🦞 Nanico OS Orchestration Dashboard
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Central control panel for system status, topic progression, and agent
          activity
        </p>
      </div>

      {/* System Status Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {/* Total Score */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <TrendingUp style={{ color: "var(--accent)", width: "20px", height: "20px" }} />
            <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
              SYSTEM SCORE
            </span>
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: "4px",
            }}
          >
            {scorePercentage}/100
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            {metrics.averageScore.toFixed(1)} avg across topics
          </div>
        </div>

        {/* Completed */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <CheckCircle style={{ color: "var(--success)", width: "20px", height: "20px" }} />
            <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
              COMPLETED
            </span>
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "var(--success)",
              marginBottom: "4px",
            }}
          >
            {metrics.completedTopics}/{metrics.totalTopics}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            {Math.round((metrics.completedTopics / metrics.totalTopics) * 100)}% complete
          </div>
        </div>

        {/* In Progress */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Zap style={{ color: "var(--info)", width: "20px", height: "20px" }} />
            <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
              IN PROGRESS
            </span>
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "var(--info)",
              marginBottom: "4px",
            }}
          >
            {metrics.inProgressTopics}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Active fronts
          </div>
        </div>

        {/* Queued */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Clock style={{ color: "var(--warning)", width: "20px", height: "20px" }} />
            <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
              QUEUED
            </span>
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "var(--warning)",
              marginBottom: "4px",
            }}
          >
            {metrics.queuedTopics}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Backlog
          </div>
        </div>

        {/* Blocked */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <AlertCircle style={{ color: "var(--error)", width: "20px", height: "20px" }} />
            <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
              BLOCKED
            </span>
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "var(--error)",
              marginBottom: "4px",
            }}
          >
            {metrics.blockedTopics}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Needs attention
          </div>
        </div>

        {/* Uptime */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Circle style={{ color: "var(--success)", width: "20px", height: "20px" }} />
            <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
              SYSTEM
            </span>
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "var(--success)",
              marginBottom: "4px",
            }}
          >
            {metrics.uptime}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Operational
          </div>
        </div>
      </div>

      {/* External Backends Status */}
      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          🌐 External Backends
        </h3>
        <CockpitBackends />
      </div>

      {/* System Status Text */}
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <h3 style={{ color: "var(--text-primary)", margin: 0, fontWeight: 600 }}>
            Current Status
          </h3>
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "14px" }}>
          Nanico OS is operating as the central orchestrator and context maintainer. The system
          is actively managing <strong>{metrics.inProgressTopics} concurrent initiatives</strong> with
          <strong> {metrics.blockedTopics} topics requiring attention</strong>. Core infrastructure
          (CCN/Notion integration and Obsidian structuring) is complete. Next priority: Notion v1
          minimal operational state and structural hygiene of ~/.openclaw.
        </p>
      </div>
    </div>
  );
}
