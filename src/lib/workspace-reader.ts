/**
 * Workspace Reader — Safe file reading for workspace integration
 *
 * This utility handles reading workspace files with proper error handling
 * and fallback patterns. All file paths are resolved relative to the user's home directory.
 */

import { promises as fs } from "fs";
import { resolve } from "path";
import { homedir } from "os";

export interface FileReadResult {
  success: boolean;
  content?: string;
  error?: string;
  path: string;
}

/**
 * Read a workspace file safely
 * Resolves paths relative to ~/.openclaw/workspace
 */
export async function readWorkspaceFile(relativePath: string): Promise<FileReadResult> {
  try {
    const workspaceRoot = resolve(homedir(), ".openclaw", "workspace");
    const fullPath = resolve(workspaceRoot, relativePath);

    // Security: ensure the resolved path is within workspace root
    if (!fullPath.startsWith(workspaceRoot)) {
      return {
        success: false,
        error: "Path traversal attempt detected",
        path: fullPath,
      };
    }

    const content = await fs.readFile(fullPath, "utf-8");
    return {
      success: true,
      content,
      path: fullPath,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage,
      path: relativePath,
    };
  }
}

/**
 * Read NOTION_STATUS file (latest available)
 */
export async function readNotionStatus(): Promise<FileReadResult> {
  // Try to read the specific file from the handoff
  return readWorkspaceFile("integrations/NOTION_STATUS_2026-04-10.md");
}

/**
 * Read TOPO_1 (Notion v1 minimal operational)
 */
export async function readTopoNotionV1(): Promise<FileReadResult> {
  return readWorkspaceFile("architecture/TOPO_1_NOTION_V1_MINIMA.md");
}

/**
 * Read multiple workspace files with fallback
 * Returns results for all attempted files
 */
export async function readWorkspaceFiles(
  paths: string[]
): Promise<FileReadResult[]> {
  return Promise.all(paths.map((path) => readWorkspaceFile(path)));
}
