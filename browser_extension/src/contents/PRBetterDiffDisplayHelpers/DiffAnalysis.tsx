import { DiffMethod, type DiffRequestResponse } from "src/core/types/getBetterDiffTypes";
import type { Nullable } from "src/core/types/types";

export interface DiffMessage {
  magnitude: "minor" | "major";
  message: string;
}

const MAX_FILE_SIZE = "512kb";

// Should we be doing this on the backend...?
export const generateDiffMessages = (
  diffMethod: DiffMethod,
  diffResponse: Nullable<DiffRequestResponse>,
): Array<DiffMessage> => {
  const issues: Array<DiffMessage> = [];

  if (diffResponse?.status === "too-large") {
    issues.push({
      message: `File too large (max size is ${MAX_FILE_SIZE}). Showing original instead!`,
      magnitude: "major",
    });
  }

  if (diffResponse?.status === "no-permissions") {
    issues.push({
      message: "Invalid permissions to fetch diff. Showing original instead!",
      magnitude: "major",
    });
  }

  if (diffResponse?.status === "error") {
    issues.push({
      message: "Failed to get custom diff. Showing original instead!",
      magnitude: "major",
    });
  }

  if (diffResponse?.status === "invalid-format") {
    issues.push({
      message:
        "Unsupported file format (or change type) for custom diffs. Showing original instead!",
      magnitude: "major",
    });
  }

  if (diffMethod === DiffMethod.DIFFTASTIC) {
    if (diffResponse?.diff?.includes("(exceeded DFT_GRAPH_LIMIT)"))
      issues.push({
        message: "File too complex for difftastic - showing default diff instead.",
        magnitude: "major",
      });
  }

  return issues;
};
