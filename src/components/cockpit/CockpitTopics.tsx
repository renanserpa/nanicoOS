/**
 * Cockpit Topics & Scores
 * Detailed view of all topics with progression
 */

import { mockTopics, Topic } from "@/lib/cockpit-data";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export function CockpitTopics() {
  const sortedTopics = [...mockTopics].sort((a, b) => {
    // Sort by: blocked → in-progress → queued → done
    const statusOrder = { blocked: 0, "in-progress": 1, queued: 2, done: 3 };
    const statusDiff =
      statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    // Then by score (descending)
    return b.score - a.score;
  });

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
          Topics & Scores
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Detailed progression tracking across all initiatives
        </p>
      </div>

      {/* Table View */}
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 100px 120px 100px",
            gap: "16px",
            padding: "16px",
            backgroundColor: "var(--card-elevated)",
            borderBottom: "1px solid var(--border)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          <div>Topic</div>
          <div>Status</div>
          <div>Score</div>
          <div>Executor</div>
          <div>Est. Completion</div>
        </div>

        {/* Table Rows */}
        <div>
          {sortedTopics.map((topic, idx) => (
            <TopicRow key={topic.id} topic={topic} isLast={idx === sortedTopics.length - 1} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {[
          {
            status: "done" as const,
            label: "Complete",
            color: "var(--success)",
            icon: "✅",
          },
          {
            status: "in-progress" as const,
            label: "In Progress",
            color: "var(--info)",
            icon: "🚀",
          },
          {
            status: "queued" as const,
            label: "Queued",
            color: "var(--warning)",
            icon: "📋",
          },
          {
            status: "blocked" as const,
            label: "Blocked",
            color: "var(--error)",
            icon: "🚫",
          },
        ].map(({ label, color, icon }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
            }}
          >
            <span style={{ fontSize: "18px" }}>{icon}</span>
            <span style={{ color: "var(--text-secondary)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicRow({ topic, isLast }: { topic: Topic; isLast: boolean }) {
  const statusColors = {
    done: { bg: "rgba(16, 185, 129, 0.1)", text: "var(--success)" },
    "in-progress": { bg: "rgba(59, 130, 246, 0.1)", text: "var(--info)" },
    queued: { bg: "rgba(217, 119, 6, 0.1)", text: "var(--warning)" },
    blocked: { bg: "rgba(239, 68, 68, 0.1)", text: "var(--error)" },
  };

  const statusLabels = {
    done: "Done",
    "in-progress": "In Progress",
    queued: "Queued",
    blocked: "Blocked",
  };

  const scoreColor =
    topic.score === 100
      ? "var(--success)"
      : topic.score >= 50
        ? "var(--info)"
        : topic.score > 0
          ? "var(--warning)"
          : "var(--text-muted)";

  const colors = statusColors[topic.status];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 100px 120px 100px",
        gap: "16px",
        padding: "16px",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        alignItems: "center",
        backgroundColor: "var(--card)",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--card-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--card)";
      }}
    >
      {/* Topic Name + Blockers */}
      <div>
        <div
          style={{
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: "14px",
            marginBottom: "4px",
          }}
        >
          {topic.name}
        </div>
        {topic.blockers && topic.blockers.length > 0 && (
          <div
            style={{
              fontSize: "11px",
              color: "var(--error)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <AlertCircle style={{ width: "12px", height: "12px" }} />
            {topic.blockers[0]}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {statusLabels[topic.status]}
      </div>

      {/* Score */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: scoreColor,
            marginBottom: "4px",
          }}
        >
          {topic.score}
        </div>
        <div
          style={{
            height: "4px",
            backgroundColor: "var(--border)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${topic.score}%`,
              backgroundColor: scoreColor,
            }}
          />
        </div>
      </div>

      {/* Executor */}
      <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
        {topic.executor}
      </div>

      {/* Estimated Completion */}
      <div
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          textAlign: "right",
        }}
      >
        {topic.estimatedCompletion || "-"}
      </div>
    </div>
  );
}
