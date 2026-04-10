"use client";

import { useState } from "react";
import { CockpitNavigation } from "@/components/cockpit/CockpitNavigation";
import { CockpitOverview } from "@/components/cockpit/CockpitOverview";
import { CockpitKanban } from "@/components/cockpit/CockpitKanban";
import { CockpitTopics } from "@/components/cockpit/CockpitTopics";
import { CockpitArtifacts } from "@/components/cockpit/CockpitArtifacts";
import { CockpitAgents } from "@/components/cockpit/CockpitAgents";
import { mockMetrics } from "@/lib/cockpit-data";

type TabType = "overview" | "kanban" | "topics" | "artifacts" | "agents";

export default function CockpitPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

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
          <div>
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
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                margin: "4px 0 0 0",
              }}
            >
              Central orchestration dashboard
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
        {activeTab === "overview" && <CockpitOverview metrics={mockMetrics} />}
        {activeTab === "kanban" && <CockpitKanban />}
        {activeTab === "topics" && <CockpitTopics />}
        {activeTab === "artifacts" && <CockpitArtifacts />}
        {activeTab === "agents" && <CockpitAgents />}
      </div>
    </div>
  );
}
