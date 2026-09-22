/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/git-pr-processing.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MAX_DESCRIPTION_LENGTH = 500;
function buildGitPullRequestsUserContent(pullRequests) {
  if (pullRequests.length === 0) {
    return {
      type: "text",
      text: ""
    };
  }
  const formattedPRs = pullRequests.map((pr2) => formatSinglePullRequest(pr2)).join("\n\n");
  const headerText = pullRequests.length === 1 ? "Attached Pull Request:" : "Attached Pull Requests:";
  const text2 = [
    "<attached_pull_requests>",
    headerText,
    "",
    formattedPRs,
    "</attached_pull_requests>"
  ].join("\n");
  return {
    type: "text",
    text: text2
  };
}
function formatSinglePullRequest(pr2) {
  const number5 = pr2.number;
  const title = pr2.title ?? "";
  const url2 = pr2.url;
  const folderPath = pr2.folderPath;
  const summaryJson = pr2.summaryJson;
  const parts = [];
  parts.push(`PR #${number5}${title ? `: ${title}` : ""}`);
  if (url2) {
    parts.push(`- URL: ${url2}`);
  }
  if (summaryJson) {
    try {
      const summary = JSON.parse(summaryJson);
      if (summary.headRef?.trim()) {
        parts.push(`- Branch: ${summary.headRef}${summary.baseRef?.trim() ? ` \u2192 ${summary.baseRef}` : ""}`);
      }
      if (summary.description?.trim()) {
        const desc = summary.description;
        if (desc.length > MAX_DESCRIPTION_LENGTH) {
          const truncated = desc.slice(0, MAX_DESCRIPTION_LENGTH);
          parts.push(`- Description: ${truncated}... (truncated, full description in summary.json)`);
        } else {
          parts.push(`- Description: ${desc}`);
        }
      }
      if (folderPath) {
        parts.push(`- Some additional details about the PR are available in the folder ${folderPath}`);
        parts.push(`  - Contents:`);
        parts.push(`    - all.diff: Complete diff of all files in one file`);
        parts.push(`    - diffs/: Individual diff files if you need to read specific files`);
        parts.push(`    - summary.json: Metadata about the PR and changed files`);
      }
      const totalDiffChars = summary.totalDiffSizeChars ?? summary.totalDiffSizeBytes;
      parts.push(`- Summary: ${summary.totalFiles} files, ${summary.totalDiffLines} lines, ${totalDiffChars} chars`);
      if (summary.files && summary.files.length > 0) {
        parts.push(`- Files changed:`);
        for (const file of summary.files) {
          const diffFileName = file.diffFileName || `${file.path.replace(/\//g, "__")}.diff`;
          const diffChars = file.diffSizeChars ?? file.diffSizeBytes;
          const originalChars = file.originalSizeChars ?? file.originalSizeBytes;
          parts.push(`  - ${file.path} (diff: diffs/${diffFileName})`);
          let fileLine = `    ${file.status}, ${file.diffLines} diff lines, ${diffChars} diff chars`;
          if (originalChars !== void 0) {
            fileLine += `, ${originalChars} original chars`;
          }
          parts.push(fileLine);
        }
      }
    } catch {
      if (folderPath) {
        parts.push(`- PR details are available in the folder ${folderPath}`);
        parts.push(`  - Read summary.json for file list and diff sizes.`);
      }
    }
  } else if (folderPath) {
    parts.push(`- PR details are available in the folder ${folderPath}`);
    parts.push(`  - Contents:`);
    parts.push(`    - all.diff: Complete diff of all files in one file`);
    parts.push(`    - diffs/: Individual diff files if you need to read specific files`);
    parts.push(`    - summary.json: Metadata about the PR and changed files`);
  }
  return parts.join("\n");
}

