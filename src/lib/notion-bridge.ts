/**
 * Notion Bridge — Read real Notion database state
 *
 * Connects to the official Nanico OS Notion workspace using the Notion API.
 * Reads minimal but useful operational data about databases and their records.
 *
 * Requires: NOTION_API_TOKEN environment variable
 */

export interface NotionDatabaseInfo {
  id: string;
  name: string;
  recordCount: number;
  lastQueried: string;
}

export interface NotionBridgeStatus {
  connected: boolean;
  lastSuccessfulRead: string;
  bases: {
    projects: NotionDatabaseInfo;
    tasks: NotionDatabaseInfo;
    decisions: NotionDatabaseInfo;
    areas: NotionDatabaseInfo;
  };
  totalRecords: number;
  error?: string;
}

/**
 * Notion database IDs for Nanico OS workspace
 * These are the stable IDs from the official Notion base
 */
const NOTION_DB_IDS = {
  projects: "f2d83af0-d5fb-434c-8425-9f0988ddb93e",
  tasks: "d1865063-f3c2-442d-9b33-08c7c0ada099",
  decisions: "d0488d80-1e52-46e8-a097-4e0d8cb31baa",
  areas: "7db66d89-f05e-4791-b85c-ddf7f827259a",
};

/**
 * Query Notion database for record count
 * Uses database query endpoint to get record count
 */
async function queryNotionDatabase(
  databaseId: string,
  token: string,
  name: string
): Promise<NotionDatabaseInfo> {
  try {
    const response = await fetch("https://api.notion.com/v1/databases/" + databaseId + "/query", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      return {
        id: databaseId,
        name,
        recordCount: 0,
        lastQueried: new Date().toISOString(),
      };
    }

    const data = await response.json() as any;
    const recordCount = data.results?.length || 0;

    return {
      id: databaseId,
      name,
      recordCount,
      lastQueried: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to query Notion database ${name}:`, error);
    return {
      id: databaseId,
      name,
      recordCount: 0,
      lastQueried: new Date().toISOString(),
    };
  }
}

/**
 * Fetch status of all Notion databases
 * Returns aggregated record counts and connection status
 */
export async function fetchNotionStatus(): Promise<NotionBridgeStatus> {
  const token = process.env.NOTION_API_TOKEN;

  if (!token) {
    return {
      connected: false,
      lastSuccessfulRead: new Date().toISOString(),
      bases: {
        projects: { id: NOTION_DB_IDS.projects, name: "Projects", recordCount: 0, lastQueried: new Date().toISOString() },
        tasks: { id: NOTION_DB_IDS.tasks, name: "Tasks", recordCount: 0, lastQueried: new Date().toISOString() },
        decisions: { id: NOTION_DB_IDS.decisions, name: "Decisions", recordCount: 0, lastQueried: new Date().toISOString() },
        areas: { id: NOTION_DB_IDS.areas, name: "Areas", recordCount: 0, lastQueried: new Date().toISOString() },
      },
      totalRecords: 0,
      error: "NOTION_API_TOKEN not configured",
    };
  }

  try {
    // Query all databases in parallel
    const [projects, tasks, decisions, areas] = await Promise.all([
      queryNotionDatabase(NOTION_DB_IDS.projects, token, "Projects"),
      queryNotionDatabase(NOTION_DB_IDS.tasks, token, "Tasks"),
      queryNotionDatabase(NOTION_DB_IDS.decisions, token, "Decisions"),
      queryNotionDatabase(NOTION_DB_IDS.areas, token, "Areas"),
    ]);

    const totalRecords = projects.recordCount + tasks.recordCount + decisions.recordCount + areas.recordCount;

    return {
      connected: true,
      lastSuccessfulRead: new Date().toISOString(),
      bases: {
        projects,
        tasks,
        decisions,
        areas,
      },
      totalRecords,
    };
  } catch (error) {
    console.error("Failed to fetch Notion status:", error);
    return {
      connected: false,
      lastSuccessfulRead: new Date().toISOString(),
      bases: {
        projects: { id: NOTION_DB_IDS.projects, name: "Projects", recordCount: 0, lastQueried: new Date().toISOString() },
        tasks: { id: NOTION_DB_IDS.tasks, name: "Tasks", recordCount: 0, lastQueried: new Date().toISOString() },
        decisions: { id: NOTION_DB_IDS.decisions, name: "Decisions", recordCount: 0, lastQueried: new Date().toISOString() },
        areas: { id: NOTION_DB_IDS.areas, name: "Areas", recordCount: 0, lastQueried: new Date().toISOString() },
      },
      totalRecords: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
