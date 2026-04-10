/**
 * Cockpit Navigation Tabs
 */

interface CockpitNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CockpitNavigation({
  activeTab,
  onTabChange,
}: CockpitNavigationProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "kanban", label: "Kanban", icon: "📋" },
    { id: "topics", label: "Topics & Scores", icon: "🎯" },
    { id: "artifacts", label: "Artifacts", icon: "📦" },
    { id: "agents", label: "Agents", icon: "🤖" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        borderBottom: "1px solid var(--border)",
        overflowX: "auto",
        paddingBottom: "0",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            border: "none",
            backgroundColor: "transparent",
            color:
              activeTab === tab.id ? "var(--accent)" : "var(--text-secondary)",
            borderBottom: activeTab === tab.id ? "2px solid var(--accent)" : "none",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ marginRight: "6px" }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
