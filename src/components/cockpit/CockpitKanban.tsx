/**
 * Cockpit Kanban Board
 * Organized by status: queue, in-progress, done, blocked
 */

import { Topic } from "@/lib/cockpit-data";
import { getTopicsByStatus } from "@/lib/cockpit-data";

const statusConfig = {
  queued: { icon: "📋", label: "Queue", color: "#6b7280" },
  "in-progress": { icon: "🚀", label: "In Progress", color: "#3b82f6" },
  done: { icon: "✅", label: "Done", color: "#10b981" },
  blocked: { icon: "🚫", label: "Blocked", color: "#ef4444" },
};

export function CockpitKanban() {
  const statuses: Array<"queued" | "in-progress" | "done" | "blocked"> = [
    "queued",
    "in-progress",
    "done",
    "blocked",
  ];

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
          Orchestration Pipeline
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Topics organized by workflow status
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {statuses.map((status) => {
          const topics = getTopicsByStatus(status);
          const config = statusConfig[status];

          return (
            <div
              key={status}
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Column Header */}
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
                <span style={{ fontSize: "20px" }}>{config.icon}</span>
                <h3 style={{ color: "var(--text-primary)", fontWeight: 600, flex: 1 }}>
                  {config.label}
                </h3>
                <div
                  style={{
                    backgroundColor: config.color,
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {topics.length}
                </div>
              </div>

              {/* Topics List */}
              <div style={{ padding: "12px" }}>
                {topics.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px 16px",
                      color: "var(--text-muted)",
                      fontSize: "14px",
                    }}
                  >
                    No topics
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {topics.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  const scoreColor =
    topic.score === 100
      ? "var(--success)"
      : topic.score >= 50
        ? "var(--info)"
        : topic.score > 0
          ? "var(--warning)"
          : "var(--text-muted)";

  return (
    <div
      style={{
        backgroundColor: "var(--card-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "12px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Topic Name */}
      <div
        style={{
          fontWeight: 600,
          color: "var(--text-primary)",
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        {topic.name}
      </div>

      {/* Executor */}
      <div
        style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          marginBottom: "8px",
        }}
      >
        Executor: <strong>{topic.executor}</strong>
      </div>

      {/* Score Bar */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
            fontSize: "11px",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>Progress</span>
          <span style={{ color: scoreColor, fontWeight: 600 }}>
            {topic.score}/100
          </span>
        </div>
        <div
          style={{
            height: "6px",
            backgroundColor: "var(--border)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${topic.score}%`,
              backgroundColor: scoreColor,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      {/* Blockers */}
      {topic.blockers && topic.blockers.length > 0 && (
        <div
          style={{
            fontSize: "11px",
            color: "var(--error)",
            padding: "6px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderRadius: "4px",
            marginTop: "8px",
          }}
        >
          ⚠️ {topic.blockers[0]}
        </div>
      )}

      {/* Completion estimate */}
      {topic.estimatedCompletion && (
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "8px",
            paddingTop: "8px",
            borderTop: "1px solid var(--border)",
          }}
        >
          Est: {topic.estimatedCompletion}
        </div>
      )}
    </div>
  );
}
