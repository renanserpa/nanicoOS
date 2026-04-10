/**
 * Cockpit Agents / Executors
 * Agent roles and capabilities
 */

import { mockAgents, getAgentTopics } from "@/lib/cockpit-data";
import { Circle, Zap, CheckCircle } from "lucide-react";

export function CockpitAgents() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          Agents & Executors
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Active agents and their roles in the orchestration system
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {mockAgents.map((agent) => {
          const topics = getAgentTopics(agent.name);
          const activeTopic = topics.find((t) => t.status === "in-progress");

          return (
            <div
              key={agent.id}
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ fontSize: "32px" }}>{agent.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontSize: "16px",
                      marginBottom: "2px",
                    }}
                  >
                    {agent.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--accent)",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    {agent.role}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                    }}
                  >
                    <Circle
                      style={{
                        width: "8px",
                        height: "8px",
                        fill:
                          agent.status === "online"
                            ? "var(--success)"
                            : agent.status === "idle"
                              ? "var(--warning)"
                              : "var(--text-muted)",
                        color:
                          agent.status === "online"
                            ? "var(--success)"
                            : agent.status === "idle"
                              ? "var(--warning)"
                              : "var(--text-muted)",
                      }}
                    />
                    <span style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                {agent.description}
              </div>

              {/* Capabilities */}
              <div>
                <h4 style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
                  Capabilities
                </h4>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {agent.capabilities.map((cap) => (
                    <span
                      key={cap}
                      style={{
                        backgroundColor: "var(--card-elevated)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                      }}
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics Status */}
              <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                <h4 style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
                  Assignments
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                    <CheckCircle style={{ width: "14px", height: "14px", color: "var(--success)" }} />
                    <span style={{ color: "var(--text-secondary)" }}>
                      {topics.filter((t) => t.status === "done").length} Completed
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                    <Zap style={{ width: "14px", height: "14px", color: "var(--info)" }} />
                    <span style={{ color: "var(--text-secondary)" }}>
                      {topics.filter((t) => t.status === "in-progress").length} In Progress
                    </span>
                  </div>
                </div>

                {/* Current Topic */}
                {activeTopic && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      backgroundColor: "var(--card-elevated)",
                      border: "1px solid var(--info)",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ color: "var(--info)", fontWeight: 600, marginBottom: "4px" }}>
                      Current: {activeTopic.name}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                      Score: {activeTopic.score}/100
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Architecture */}
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h3 style={{ color: "var(--text-primary)", marginBottom: "12px", fontWeight: 600 }}>
          🦞 System Architecture
        </h3>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "12px",
          }}
        >
          Nanico OS operates as a multi-agent orchestration system. The nanico core maintains
          system state, score tracking, and agent dispatch. Each agent (Claude Code, GeminiCLI,
          Codex) specializes in specific domain capabilities and reports back to nanico with
          completion status and deliverables. The cockpit visualizes this orchestration in
          real-time.
        </p>
        <div style={{ backgroundColor: "var(--card-elevated)", padding: "12px", borderRadius: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
          <strong>Terminal Mode:</strong> The terminal CLI remains the primary command interface. This cockpit is a complementary visualization layer.
        </div>
      </div>
    </div>
  );
}
