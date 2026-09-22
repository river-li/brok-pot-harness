/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/edit/diff-worker.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function withGitDiffPrefix(path31, prefix) {
  if (path31 === "/dev/null") {
    return path31;
  }
  return `${prefix}/${path31}`;
}
function calculateDiff(params) {
  const ensureNL = (s3) => s3 === "" || s3.endsWith("\n") ? s3 : `${s3}
`;
  const { hunks } = structuredPatch("a", "b", ensureNL(params.original), ensureNL(params.new), "", "", { context: 3 });
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

