/**
 * Cockpit External Backends Panel
 *
 * Displays read-only status and minimal metadata from external backends:
 * - Notion: Operational backend
 * - Obsidian: Cognitive backend
 * - Supabase: Reserved for Phase 6
 */

import { ExternalBackends } from "@/data/cockpit-state";

interface CockpitExternalBackendsProps {
  backends?: ExternalBackends;
}

export function CockpitExternalBackends({ backends }: CockpitExternalBackendsProps) {
  if (!backends) {
    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderRadius: "8px",
          color: "var(--error)",
          marginBottom: "16px",
        }}
      >
        External backends data not available. Please refresh the page.
      </div>
    );
  }

  const BackendCard = ({
    title,
    emoji,
    available,
    status,
    details,
    error,
  }: {
    title: string;
    emoji: string;
    available: boolean;
    status?: string;
    details?: React.ReactNode;
    error?: string;
  }) => (
    <div
      style={{
        padding: "16px",
        backgroundColor: "var(--card)",
        borderRadius: "8px",
        border: `1px solid ${available ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
        marginBottom: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ fontSize: "24px" }}>{emoji}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{title}</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
            {available ? "🟢 Available" : "🔴 Unavailable"}
            {status && ` • ${status}`}
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderRadius: "4px",
            color: "var(--error)",
            fontSize: "12px",
            marginBottom: "12px",
          }}
        >
          {error}
        </div>
      )}

      {details && (
        <div
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            padding: "12px",
            borderRadius: "4px",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          {details}
        </div>
      )}
    </div>
  );

  const notionDetails = backends.notion.available && (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {backends.notion.databases && (
        <div>
          <strong>Databases:</strong> {backends.notion.databases.count} found
          {backends.notion.databases.types.length > 0 && (
            <>
              <div style={{ marginTop: "4px", paddingLeft: "8px" }}>
                {backends.notion.databases.types.map((type, i) => (
                  <div key={i}>• {type}</div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {backends.notion.lastSync && (
        <div style={{ fontSize: "11px", opacity: 0.7 }}>
          Last sync: {new Date(backends.notion.lastSync).toLocaleTimeString()}
        </div>
      )}
    </div>
  );

  const obsidianDetails = backends.obsidian.available && (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {backends.obsidian.vaultName && (
        <div>
          <strong>Vault:</strong> {backends.obsidian.vaultName}
        </div>
      )}
      {backends.obsidian.noteCount !== undefined && (
        <div>
          <strong>Notes:</strong> {backends.obsidian.noteCount} found
        </div>
      )}
      {backends.obsidian.mainIndexes && backends.obsidian.mainIndexes.length > 0 && (
        <div>
          <strong>Main Indexes:</strong>
          <div style={{ marginTop: "4px", paddingLeft: "8px" }}>
            {backends.obsidian.mainIndexes.map((idx, i) => (
              <div key={i}>• {idx}</div>
            ))}
          </div>
        </div>
      )}
      {backends.obsidian.lastModified && (
        <div style={{ fontSize: "11px", opacity: 0.7 }}>
          Last modified: {new Date(backends.obsidian.lastModified).toLocaleTimeString()}
        </div>
      )}
    </div>
  );

  const supabaseDetails = (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div>
        <strong>Status:</strong> {backends.supabase.status || "pending"}
      </div>
      {backends.supabase.message && (
        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          {backends.supabase.message}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderRadius: "8px",
          borderLeft: "3px solid var(--info)",
        }}
      >
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)" }}>
          <strong>External Backends:</strong> Read-only visibility into operational
          infrastructure. No mutations or bidirectional sync yet.
        </p>
      </div>

      <BackendCard
        title="Notion"
        emoji="📋"
        available={backends.notion.available}
        status={backends.notion.status}
        details={notionDetails}
        error={backends.notion.error}
      />

      <BackendCard
        title="Obsidian"
        emoji="🧠"
        available={backends.obsidian.available}
        details={obsidianDetails}
        error={backends.obsidian.error}
      />

      <BackendCard
        title="Supabase"
        emoji="🗄️"
        available={backends.supabase.available}
        status={backends.supabase.status}
        details={supabaseDetails}
      />

      <div
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          backgroundColor: "rgba(251, 146, 60, 0.05)",
          borderRadius: "8px",
          fontSize: "12px",
          color: "var(--text-secondary)",
        }}
      >
        <strong>Next Steps:</strong>
        <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
          <li>Phase 5 ✓ Read-only bridges for Notion & Obsidian</li>
          <li>Phase 6 → Supabase integration & database backend</li>
          <li>Phase 7 → Bidirectional sync with conflict resolution</li>
        </ul>
      </div>
    </div>
  );
}
