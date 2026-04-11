/**
 * External Bridges — Read-only integration with Notion, Obsidian, and future backends
 *
 * This module provides safe, read-only access to external backends with:
 * - Minimal data exposure (status, counts, structure)
 * - Graceful degradation when services are unavailable
 * - No mutation or bidirectional sync yet
 */

import { promises as fs } from "fs";
import { resolve } from "path";
import { homedir } from "os";

export interface ExternalBackendStatus {
  available: boolean;
  lastChecked: string;
  error?: string;
}

export interface NotionBridgeData extends ExternalBackendStatus {
  databases?: {
    count: number;
    types: string[];
  };
  status?: string;
  lastSync?: string;
}

export interface ObsidianBridgeData extends ExternalBackendStatus {
  vaultName?: string;
  noteCount?: number;
  mainIndexes?: string[];
  lastModified?: string;
}

export interface SupabaseBridgeData extends ExternalBackendStatus {
  status: "planned" | "reserved" | "connecting" | "active";
  message: string;
}

/**
 * Check Notion bridge status
 * Reads from workspace integration files if available
 */
export async function checkNotionBridge(): Promise<NotionBridgeData> {
  try {
    const notionStatusPath = resolve(
      homedir(),
      ".openclaw",
      "workspace",
      "integrations",
      "NOTION_STATUS_2026-04-10.md"
    );

    const content = await fs.readFile(notionStatusPath, "utf-8");

    // Parse minimal useful data from Notion status
    // Looking for database mentions and sync status
    const databases: string[] = [];

    if (content.includes("Projects")) databases.push("Projects");
    if (content.includes("Tasks")) databases.push("Tasks");
    if (content.includes("Decisions")) databases.push("Decisions");
    if (content.includes("Areas")) databases.push("Areas");
    if (content.includes("Database")) databases.push("Database");

    return {
      available: true,
      lastChecked: new Date().toISOString(),
      databases: {
        count: databases.length,
        types: databases,
      },
      status: "operational",
      lastSync: new Date().toISOString(),
    };
  } catch (error) {
    // Graceful fallback
    return {
      available: false,
      lastChecked: new Date().toISOString(),
      error: `Unable to read Notion status: ${error instanceof Error ? error.message : "Unknown error"}`,
      databases: {
        count: 0,
        types: [],
      },
    };
  }
}

/**
 * Check Obsidian bridge status
 * Inspects vault structure if available
 */
export async function checkObsidianBridge(): Promise<ObsidianBridgeData> {
  try {
    // Check if Obsidian vault exists
    const obsidianVaultPath = resolve(
      homedir(),
      "Library",
      "Mobile Documents",
      "com~apple~CloudDocs",
      "Documentos"
    );

    // Fallback to common Obsidian locations
    let vaultRoot = obsidianVaultPath;

    try {
      await fs.access(obsidianVaultPath);
    } catch {
      // Try alternative locations
      const altPaths = [
        resolve(homedir(), "Obsidian", "main"),
        resolve(homedir(), "Documents", "Obsidian"),
        resolve(homedir(), ".local", "share", "obsidian"),
      ];

      for (const altPath of altPaths) {
        try {
          await fs.access(altPath);
          vaultRoot = altPath;
          break;
        } catch {
          // Continue to next alternative
        }
      }
    }

    // Count notes in vault (minimal traversal)
    let noteCount = 0;
    const mainIndexes: string[] = [];

    try {
      const files = await fs.readdir(vaultRoot);

      // Look for main index files
      const indexFiles = [
        "Index.md",
        "index.md",
        "README.md",
        "_INDEX.md",
        "00_Index.md",
      ];

      for (const indexFile of indexFiles) {
        if (files.includes(indexFile)) {
          mainIndexes.push(indexFile);
        }
      }

      // Count .md files in root (not recursive for performance)
      noteCount = files.filter((f) => f.endsWith(".md")).length;
    } catch {
      // Vault exists but can't read details
    }

    return {
      available: true,
      lastChecked: new Date().toISOString(),
      vaultName: "Obsidian Vault",
      noteCount,
      mainIndexes: mainIndexes.length > 0 ? mainIndexes : ["_not_found"],
      lastModified: new Date().toISOString(),
    };
  } catch (error) {
    return {
      available: false,
      lastChecked: new Date().toISOString(),
      error: `Unable to access Obsidian vault: ${error instanceof Error ? error.message : "Unknown error"}`,
      noteCount: 0,
      mainIndexes: [],
    };
  }
}

/**
 * Reserved space for Supabase bridge
 * Supabase integration is planned but not yet implemented
 */
export async function checkSupabaseBridge(): Promise<SupabaseBridgeData> {
  return {
    available: false,
    lastChecked: new Date().toISOString(),
    status: "planned",
    message:
      "Supabase integration reserved for Phase 6 — Database backend provisioning",
  };
}

/**
 * Get all external backend status
 * Returns aggregated view of all external connections
 */
export async function getAllExternalBridges() {
  const [notion, obsidian, supabase] = await Promise.all([
    checkNotionBridge(),
    checkObsidianBridge(),
    checkSupabaseBridge(),
  ]);

  return {
    notion,
    obsidian,
    supabase,
    timestamp: new Date().toISOString(),
    summary: {
      realBackendsActive: [
        notion.available ? "notion" : null,
        obsidian.available ? "obsidian" : null,
      ].filter(Boolean),
      totalAvailable: (notion.available ? 1 : 0) + (obsidian.available ? 1 : 0),
    },
  };
}
