/**
 * Obsidian Bridge — Read real Obsidian vault state
 *
 * Scans the local Obsidian vault to check:
 * - Vault presence and accessibility
 * - Key structure files and indexes
 * - Approximate note count
 * - Status of main organizational documents
 *
 * This is read-only filesystem inspection, no API required.
 */

import { promises as fs } from "fs";
import { resolve } from "path";
import { homedir } from "os";

export interface ObsidianVaultStatus {
  present: boolean;
  accessible: boolean;
  lastChecked: string;
  vaultPath: string;
  noteCount: number;
  hasMainIndex: boolean;
  hasContextMap: boolean;
  hasDecisionLog: boolean;
  mainIndexPath?: string;
  error?: string;
}

/**
 * Expected vault structure for Nanico OS
 */
const EXPECTED_VAULT_ROOT = resolve(homedir(), "Developer/Projects/NOTEBOOK/.obsidian");
const EXPECTED_KEY_FILES = {
  index: "INDEX.md",
  contextMap: "CONTEXT_MAP.md",
  decisionLog: "DECISIONS.md",
};

/**
 * Check if Obsidian vault exists and is accessible
 */
export async function fetchObsidianStatus(): Promise<ObsidianVaultStatus> {
  const baseStatus: ObsidianVaultStatus = {
    present: false,
    accessible: false,
    lastChecked: new Date().toISOString(),
    vaultPath: EXPECTED_VAULT_ROOT,
    noteCount: 0,
    hasMainIndex: false,
    hasContextMap: false,
    hasDecisionLog: false,
  };

  try {
    // Check if vault directory exists
    try {
      await fs.access(EXPECTED_VAULT_ROOT);
      baseStatus.present = true;
    } catch {
      return {
        ...baseStatus,
        error: "Obsidian vault directory not found",
      };
    }

    // Check for key index files
    const vaultDir = resolve(EXPECTED_VAULT_ROOT, "..");
    try {
      const indexPath = resolve(vaultDir, EXPECTED_KEY_FILES.index);
      await fs.access(indexPath);
      baseStatus.hasMainIndex = true;
      baseStatus.mainIndexPath = indexPath;
    } catch {
      // Index might not exist, that's okay
    }

    try {
      await fs.access(resolve(vaultDir, EXPECTED_KEY_FILES.contextMap));
      baseStatus.hasContextMap = true;
    } catch {
      // Context map might not exist
    }

    try {
      await fs.access(resolve(vaultDir, EXPECTED_KEY_FILES.decisionLog));
      baseStatus.hasDecisionLog = true;
    } catch {
      // Decision log might not exist
    }

    // Count markdown files approximately
    try {
      const files = await fs.readdir(vaultDir, { recursive: true });
      const mdCount = files.filter(
        (f) => typeof f === "string" && f.endsWith(".md")
      ).length;
      baseStatus.noteCount = mdCount;
    } catch (err) {
      console.warn("Could not count markdown files:", err);
    }

    baseStatus.accessible = true;
    return baseStatus;
  } catch (error) {
    console.error("Error checking Obsidian vault:", error);
    return {
      ...baseStatus,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if Obsidian vault is operational
 * Based on presence of key files and note count
 */
export function isVaultOperational(status: ObsidianVaultStatus): boolean {
  return status.present && status.accessible && status.noteCount > 0;
}
