"use client";

import { useState, useEffect } from "react";
import { CockpitNavigation } from "@/components/cockpit/CockpitNavigation";
import { CockpitOverview } from "@/components/cockpit/CockpitOverview";
import { CockpitKanban } from "@/components/cockpit/CockpitKanban";
import { CockpitTopics } from "@/components/cockpit/CockpitTopics";
import { CockpitArtifacts } from "@/components/cockpit/CockpitArtifacts";
import { CockpitAgents } from "@/components/cockpit/CockpitAgents";
import { CockpitExternalBackends } from "@/components/cockpit/CockpitExternalBackends";
import { CockpitState, defaultCockpitState } from "@/data/cockpit-state";

type TabType = "overview" | "kanban" | "topics" | "artifacts" | "agents" | "control" | "external";

export default function CockpitPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [state, setState] = useState<CockpitState>(defaultCockpitState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch cockpit state from API on component mount
  useEffect(() => {
    const fetchCockpitState = async () => {
      try {
        const response = await fetch("/api/cockpit/state");
        if (!response.ok) throw new Error("Failed to fetch cockpit state");
        const data = await response.json();

        // Extract metadata if available
        const meta = (data as any)._meta;
        if (meta) {
          setWorkspaceReady(meta.workspaceReady || false);
        }

        setState(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching cockpit state:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fall back to default state on error
        setState(defaultCockpitState);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCockpitState();
  }, []);

  // Update topic operation
  const updateTopicOperation = async (
    action: string,
    payload: Record<string, any>
  ) => {
    try {
      setIsUpdating(true);
      const response = await fetch("/api/cockpit/operations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload: { ...payload, updatedBy: "user" } }),
      });

      if (!response.ok) throw new Error("Failed to update operation");

      // Refresh cockpit state to reflect updated operations
      const stateResponse = await fetch("/api/cockpit/state");
      if (stateResponse.ok) {
        const data = await stateResponse.json();
        setState(data);
      }
    } catch (err) {
      console.error("Error updating operation:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ fontSize: "28px" }}>🦞</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Nanico OS Cockpit
              </h1>
              {workspaceReady && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--success)",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--success)",
                    }}
                  />
                  Workspace Live
                </div>
              )}
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                margin: "4px 0 0 0",
              }}
            >
              Central orchestration dashboard
              {!isLoading && state.lastUpdated && (
                <span style={{ fontSize: "11px", opacity: 0.6 }}>
                  {" "}
                  • Updated {new Date(state.lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <CockpitNavigation activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabType)} />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px",
        }}
      >
        {error && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderRadius: "8px",
              color: "var(--error)",
              marginBottom: "16px",
            }}
          >
            Error loading cockpit state: {error}
          </div>
        )}

        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--text-secondary)",
            }}
          >
            Loading cockpit state...
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <CockpitOverview metrics={state.metrics} lastUpdated={state.lastUpdated} />
            )}
            {activeTab === "kanban" && <CockpitKanban topics={state.topics} />}
            {activeTab === "topics" && <CockpitTopics topics={state.topics} />}
            {activeTab === "artifacts" && <CockpitArtifacts artifacts={state.artifacts} />}
            {activeTab === "agents" && <CockpitAgents agents={state.agents} topics={state.topics} />}
            {activeTab === "external" && (
              <CockpitExternalBackends backends={state.externalBackends} />
            )}
            {activeTab === "control" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderRadius: "8px",
                    borderLeft: "3px solid var(--info)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)" }}>
                    <strong>Control Panel:</strong> Make adjustments to topics locally.
                    Changes are saved immediately and don't affect workspace source data.
                  </p>
                </div>

                {state.topics.map((topic) => (
                  <div
                    key={topic.id}
                    style={{
                      padding: "16px",
                      backgroundColor: "var(--card)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600 }}>
                      {topic.name}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Current: {topic.score}/100 • {topic.status}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <button
                          onClick={() =>
                            updateTopicOperation("updateStatus", {
                              topicId: topic.id,
                              status: "queued",
                            })
                          }
                          disabled={isUpdating || topic.status === "queued"}
                          style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            borderRadius: "4px",
                            border: "1px solid var(--border)",
                            backgroundColor:
                              topic.status === "queued"
                                ? "rgba(251, 146, 60, 0.2)"
                                : "transparent",
                            color: "var(--text-secondary)",
                            cursor: isUpdating ? "not-allowed" : "pointer",
                            opacity: isUpdating ? 0.5 : 1,
                          }}
                        >
                          Queued
                        </button>
                        <button
                          onClick={() =>
                            updateTopicOperation("updateStatus", {
                              topicId: topic.id,
                              status: "in-progress",
                            })
                          }
                          disabled={isUpdating || topic.status === "in-progress"}
                          style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            borderRadius: "4px",
                            border: "1px solid var(--border)",
                            backgroundColor:
                              topic.status === "in-progress"
                                ? "rgba(59, 130, 246, 0.2)"
                                : "transparent",
                            color: "var(--text-secondary)",
                            cursor: isUpdating ? "not-allowed" : "pointer",
                            opacity: isUpdating ? 0.5 : 1,
                          }}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() =>
                            updateTopicOperation("updateStatus", {
                              topicId: topic.id,
                              status: "done",
                            })
                          }
                          disabled={isUpdating || topic.status === "done"}
                          style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            borderRadius: "4px",
                            border: "1px solid var(--border)",
                            backgroundColor:
                              topic.status === "done"
                                ? "rgba(34, 197, 94, 0.2)"
                                : "transparent",
                            color: "var(--text-secondary)",
                            cursor: isUpdating ? "not-allowed" : "pointer",
                            opacity: isUpdating ? 0.5 : 1,
                          }}
                        >
                          Done
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          Score:
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={topic.score}
                          onChange={(e) =>
                            updateTopicOperation("updateScore", {
                              topicId: topic.id,
                              score: parseInt(e.target.value, 10),
                            })
                          }
                          disabled={isUpdating}
                          style={{ flex: 1, cursor: isUpdating ? "not-allowed" : "pointer", opacity: isUpdating ? 0.5 : 1 }}
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            minWidth: "35px",
                          }}
                        >
                          {topic.score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
