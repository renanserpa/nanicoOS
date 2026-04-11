"use client";

import { useState, useEffect } from "react";
import { CockpitNavigation } from "@/components/cockpit/CockpitNavigation";
import { CockpitOverview } from "@/components/cockpit/CockpitOverview";
import { CockpitKanban } from "@/components/cockpit/CockpitKanban";
import { CockpitTopics } from "@/components/cockpit/CockpitTopics";
import { CockpitArtifacts } from "@/components/cockpit/CockpitArtifacts";
import { CockpitAgents } from "@/components/cockpit/CockpitAgents";
import { CockpitState, defaultCockpitState } from "@/data/cockpit-state";

type TabType = "overview" | "kanban" | "topics" | "artifacts" | "agents";

export default function CockpitPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [state, setState] = useState<CockpitState>(defaultCockpitState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workspaceReady, setWorkspaceReady] = useState(false);

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
          </>
        )}
      </div>
    </div>
  );
}
