/**
 * CockpitBackends — Display status of external backends
 *
 * Shows real-time connection status and operational metrics for:
 * - Notion (operational database)
 * - Obsidian (cognitive vault)
 * - Supabase (planned, future)
 */

import { useEffect, useState } from "react";

interface BackendInfo {
  connected?: boolean;
  lastRead?: string;
  projects?: number;
  tasks?: number;
  decisions?: number;
  areas?: number;
  total?: number;
  error?: string;
  present?: boolean;
  accessible?: boolean;
  noteCount?: number;
  hasIndex?: boolean;
  planned?: boolean;
  status?: string;
}

export interface CockpitBackendsProps {}

export function CockpitBackends({}: CockpitBackendsProps) {
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackends = async () => {
      try {
        const response = await fetch("/api/cockpit/backends");
        if (!response.ok) throw new Error("Failed to fetch backend status");
        const data = await response.json();
        setBackendStatus(data);
      } catch (err) {
        console.error("Error fetching backend status:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackends();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBackends, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
        Loading backend status...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "12px",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderRadius: "6px",
          color: "var(--error)",
          fontSize: "12px",
        }}
      >
        Error loading backend status: {error}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
      {/* Notion Card */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "var(--card)",
          borderRadius: "8px",
          border: `1px solid ${backendStatus.notion.connected ? "var(--success)" : "var(--border)"}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "20px" }}>📋</span>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>Notion</h3>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "10px",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: "3px",
              backgroundColor: backendStatus.notion.connected
                ? "rgba(34, 197, 94, 0.2)"
                : "rgba(156, 163, 175, 0.2)",
              color: backendStatus.notion.connected ? "var(--success)" : "var(--text-secondary)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: backendStatus.notion.connected ? "var(--success)" : "gray",
              }}
            />
            {backendStatus.notion.connected ? "Connected" : "Offline"}
          </span>
        </div>

        {backendStatus.notion.connected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Projects:</span>
              <strong>{backendStatus.notion.projects || 0}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Tasks:</span>
              <strong>{backendStatus.notion.tasks || 0}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Decisions:</span>
              <strong>{backendStatus.notion.decisions || 0}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-secondary)" }}>Total:</span>
              <strong>{backendStatus.notion.total || 0}</strong>
            </div>
            {backendStatus.notion.lastRead && (
              <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "4px" }}>
                Last read: {new Date(backendStatus.notion.lastRead).toLocaleTimeString()}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {backendStatus.notion.error || "Unable to connect"}
          </div>
        )}
      </div>

      {/* Obsidian Card */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "var(--card)",
          borderRadius: "8px",
          border: `1px solid ${backendStatus.obsidian.accessible ? "var(--success)" : "var(--border)"}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "20px" }}>🧠</span>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>Obsidian</h3>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "10px",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: "3px",
              backgroundColor: backendStatus.obsidian.accessible
                ? "rgba(34, 197, 94, 0.2)"
                : "rgba(156, 163, 175, 0.2)",
              color: backendStatus.obsidian.accessible ? "var(--success)" : "var(--text-secondary)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: backendStatus.obsidian.accessible ? "var(--success)" : "gray",
              }}
            />
            {backendStatus.obsidian.accessible ? "Ready" : "Unavailable"}
          </span>
        </div>

        {backendStatus.obsidian.accessible ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Notes:</span>
              <strong>{backendStatus.obsidian.noteCount || 0}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Main Index:</span>
              <strong>{backendStatus.obsidian.hasIndex ? "✓" : "—"}</strong>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--success)",
                marginTop: "8px",
                padding: "6px",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderRadius: "4px",
              }}
            >
              Vault operational
            </div>
          </div>
        ) : (
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {backendStatus.obsidian.error || "Vault not accessible"}
          </div>
        )}
      </div>

      {/* Supabase Card (Planned) */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "var(--card)",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          opacity: 0.6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "20px" }}>☁️</span>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>Supabase</h3>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "10px",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: "3px",
              backgroundColor: "rgba(251, 146, 60, 0.2)",
              color: "var(--warning)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--warning)",
              }}
            />
            Planned
          </span>
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            padding: "8px",
            textAlign: "center",
          }}
        >
          Backend reserved for future integration
        </div>
      </div>
    </div>
  );
}
