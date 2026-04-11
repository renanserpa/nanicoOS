/**
 * TopicControls — Interactive control panel for individual topics
 *
 * Allows manual adjustment of:
 * - Status (done/in-progress/queued/blocked)
 * - Score (0-100)
 * - Blockers (add/remove)
 * - Priority (critical/high/normal/low)
 * - Notes (short progress notes)
 */

import { useState } from "react";

export interface TopicControlsProps {
  topicId: string;
  currentStatus: "done" | "in-progress" | "queued" | "blocked";
  currentScore: number;
  currentBlockers?: string[];
  currentPriority?: "critical" | "high" | "normal" | "low";
  currentNotes?: string;
  isReadOnly?: boolean;
  onStatusChange?: (status: "done" | "in-progress" | "queued" | "blocked") => void;
  onScoreChange?: (score: number) => void;
  onBlockersChange?: (blockers: string[]) => void;
  onPriorityChange?: (priority: "critical" | "high" | "normal" | "low") => void;
  onNotesChange?: (notes: string) => void;
}

export function TopicControls({
  topicId,
  currentStatus,
  currentScore,
  currentBlockers = [],
  currentPriority = "normal",
  currentNotes = "",
  isReadOnly = false,
  onStatusChange,
  onScoreChange,
  onBlockersChange,
  onPriorityChange,
  onNotesChange,
}: TopicControlsProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(currentNotes);
  const [isBlocked, setIsBlocked] = useState(currentStatus === "blocked");

  const statusColors: Record<string, string> = {
    done: "rgba(34, 197, 94, 0.2)",
    "in-progress": "rgba(59, 130, 246, 0.2)",
    queued: "rgba(251, 146, 60, 0.2)",
    blocked: "rgba(239, 68, 68, 0.2)",
  };

  const statusTextColors: Record<string, string> = {
    done: "var(--success)",
    "in-progress": "var(--info)",
    queued: "var(--warning)",
    blocked: "var(--error)",
  };

  const priorityColors: Record<string, string> = {
    critical: "var(--error)",
    high: "var(--warning)",
    normal: "var(--info)",
    low: "var(--text-secondary)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "12px",
        backgroundColor: "var(--surface)",
        borderRadius: "6px",
        border: "1px solid var(--border)",
      }}
    >
      {/* Status controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {!isReadOnly && (
          <>
            <button
              onClick={() => onStatusChange?.("queued")}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                borderRadius: "4px",
                border: "none",
                backgroundColor:
                  currentStatus === "queued" ? statusColors.queued : "transparent",
                color:
                  currentStatus === "queued"
                    ? statusTextColors.queued
                    : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: currentStatus === "queued" ? 600 : 400,
              }}
            >
              Queued
            </button>
            <button
              onClick={() => onStatusChange?.("in-progress")}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                borderRadius: "4px",
                border: "none",
                backgroundColor:
                  currentStatus === "in-progress" ? statusColors["in-progress"] : "transparent",
                color:
                  currentStatus === "in-progress"
                    ? statusTextColors["in-progress"]
                    : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: currentStatus === "in-progress" ? 600 : 400,
              }}
            >
              In Progress
            </button>
            <button
              onClick={() => onStatusChange?.("done")}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: currentStatus === "done" ? statusColors.done : "transparent",
                color:
                  currentStatus === "done" ? statusTextColors.done : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: currentStatus === "done" ? 600 : 400,
              }}
            >
              Done
            </button>
            <button
              onClick={() => {
                setIsBlocked(!isBlocked);
                onStatusChange?.(isBlocked ? "queued" : "blocked");
              }}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                borderRadius: "4px",
                border: "1px solid var(--error)",
                backgroundColor: isBlocked ? "rgba(239, 68, 68, 0.1)" : "transparent",
                color: "var(--error)",
                cursor: "pointer",
                fontWeight: isBlocked ? 600 : 400,
              }}
            >
              🚫 {isBlocked ? "Blocked" : "Block"}
            </button>
          </>
        )}
      </div>

      {/* Score slider */}
      {!isReadOnly && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", minWidth: "40px" }}>
            Score:
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={currentScore}
            onChange={(e) => onScoreChange?.(parseInt(e.target.value, 10))}
            style={{ flex: 1, cursor: "pointer" }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-primary)",
              minWidth: "35px",
            }}
          >
            {currentScore}
          </span>
        </div>
      )}

      {/* Priority selector */}
      {!isReadOnly && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", minWidth: "60px" }}>
            Priority:
          </span>
          <select
            value={currentPriority}
            onChange={(e) =>
              onPriorityChange?.(
                e.target.value as "critical" | "high" | "normal" | "low"
              )
            }
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              color: priorityColors[currentPriority],
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="normal">🟡 Normal</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      )}

      {/* Blockers display */}
      {currentBlockers && currentBlockers.length > 0 && (
        <div style={{ fontSize: "12px", color: "var(--error)" }}>
          <strong>Blockers:</strong>{" "}
          {currentBlockers.map((blocker, i) => (
            <span key={i}>
              {i > 0 && ", "}
              <span style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "2px 6px", borderRadius: "3px" }}>
                {blocker}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Notes section */}
      <div>
        {showNoteInput && !isReadOnly ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add progress note..."
              style={{
                flex: 1,
                padding: "6px 8px",
                fontSize: "12px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--text-primary)",
                fontFamily: "inherit",
                resize: "vertical",
                minHeight: "50px",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <button
                onClick={() => {
                  onNotesChange?.(noteText);
                  setShowNoteInput(false);
                }}
                style={{
                  padding: "6px 10px",
                  fontSize: "11px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "var(--success)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowNoteInput(false)}
                style={{
                  padding: "6px 10px",
                  fontSize: "11px",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNoteInput(true)}
            disabled={isReadOnly}
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              borderRadius: "4px",
              border: "1px dashed var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              cursor: isReadOnly ? "not-allowed" : "pointer",
              opacity: isReadOnly ? 0.5 : 1,
            }}
          >
            {currentNotes ? `📝 Note: "${currentNotes.substring(0, 40)}..."` : "+ Add note"}
          </button>
        )}
      </div>
    </div>
  );
}
