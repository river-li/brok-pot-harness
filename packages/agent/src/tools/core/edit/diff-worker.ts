/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/src/tools/core/edit/diff-worker.ts
 * Bundle: sand-host/diff-worker.js
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var diff_worker_exports = {};
__export(diff_worker_exports, {
  default: () => calculateDiff
});
module.exports = __toCommonJS(diff_worker_exports);

// @recovered-fragment 2/2
function withGitDiffPrefix(path, prefix) {
  if (path === "/dev/null") {
    return path;
  }
  return `${prefix}/${path}`;
}
function calculateDiff(params) {
  const ensureNL = (s) => s === "" || s.endsWith("\n") ? s : `${s}
`;
  const { hunks } = structuredPatch(
    "a",
    "b",
    ensureNL(params.original),
    ensureNL(params.new),
    "",
    "",
    { context: 3 }
  );
  const formatRange = (start, lineCount) => {
    if (lineCount === 0) {
      return `${start},0`;
    }
    if (lineCount === 1) {
      return `${start}`;
    }
    return `${start},${lineCount}`;
  };
  const trimmedFilePath = params.filePath?.trim();
  const normalizedFilePath = trimmedFilePath && trimmedFilePath.length > 0 ? trimmedFilePath : "file";
  const fileChangeType = params.fileChangeType ?? "modified";
  const oldPath = fileChangeType === "added" ? "/dev/null" : normalizedFilePath;
  const newPath = fileChangeType === "deleted" ? "/dev/null" : normalizedFilePath;
  const diffString = hunks.length === 0 ? "" : [
    `--- ${withGitDiffPrefix(oldPath, "a")}`,
    `+++ ${withGitDiffPrefix(newPath, "b")}`,
    ...hunks.flatMap((h) => [
      `@@ -${formatRange(h.oldStart, h.oldLines)} +${formatRange(h.newStart, h.newLines)} @@`,
      ...h.lines
    ])
  ].join("\n");
  return {
    diffString,
    linesAdded: hunks.reduce((sum, h) => sum + h.lines.filter((l) => l.startsWith("+")).length, 0),
    linesRemoved: hunks.reduce((sum, h) => sum + h.lines.filter((l) => l.startsWith("-")).length, 0)
  };
}
