/**
 * Cockpit Artifacts / Handoffs
 * Grouped by front/initiative
 */

import { mockArtifacts, getUniqueFronts, getArtifactsByFront } from "@/lib/cockpit-data";
import { FileText, Link2, Folder, Archive } from "lucide-react";

const typeIcons = {
  document: <FileText style={{ width: "16px", height: "16px" }} />,
  file: <Folder style={{ width: "16px", height: "16px" }} />,
  handoff: <Archive style={{ width: "16px", height: "16px" }} />,
  workspace: <Folder style={{ width: "16px", height: "16px" }} />,
};

export function CockpitArtifacts() {
  const fronts = getUniqueFronts();

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
          Artifacts & Handoffs
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Generated artifacts grouped by initiative/front
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {fronts.map((front) => {
          const artifacts = getArtifactsByFront(front);

          return (
            <div
              key={front}
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Front Header */}
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "var(--card-elevated)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "24px",
                    backgroundColor: "var(--accent)",
                    borderRadius: "2px",
                  }}
                />
                <h3 style={{ color: "var(--text-primary)", fontWeight: 600, flex: 1 }}>
                  {front}
                </h3>
                <span
                  style={{
                    backgroundColor: "var(--border)",
                    color: "var(--text-secondary)",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {artifacts.length}
                </span>
              </div>

              {/* Artifacts List */}
              <div style={{ padding: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {artifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      style={{
                        backgroundColor: "var(--card-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "12px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                        cursor: artifact.url ? "pointer" : "default",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (artifact.url) {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 2px 8px rgba(0,0,0,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (artifact.url) {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                          (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        }
                      }}
                      onClick={() => {
                        if (artifact.url) {
                          window.open(artifact.url, "_blank");
                        }
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          color: "var(--accent)",
                          flex: "0 0 auto",
                          marginTop: "2px",
                        }}
                      >
                        {typeIcons[artifact.type]}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              fontSize: "14px",
                            }}
                          >
                            {artifact.name}
                          </div>
                          {artifact.url && (
                            <Link2
                              style={{
                                width: "14px",
                                height: "14px",
                                color: "var(--text-muted)",
                              }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            marginBottom: "4px",
                          }}
                        >
                          {artifact.description}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            fontSize: "11px",
                            color: "var(--text-muted)",
                          }}
                        >
                          <span>Type: {artifact.type}</span>
                          <span>•</span>
                          <span>Created: {artifact.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h3 style={{ color: "var(--text-primary)", marginBottom: "8px", fontWeight: 600 }}>
          About Artifacts
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
          Artifacts are generated deliverables, documents, and handoff materials from completed
          topics. Click on any artifact with a link to access the resource. Artifacts are
          organized by the initiative front they belong to, enabling quick navigation and
          cross-reference with active topics.
        </p>
      </div>
    </div>
  );
}
