/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/src/tools/core/edit/unified-diff-worker.ts
 * Bundle: sand-host/unified-diff-worker.js
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var unified_diff_worker_exports = {};
__export(unified_diff_worker_exports, {
  default: () => calculateUnifiedDiff
});
module.exports = __toCommonJS(unified_diff_worker_exports);

// @recovered-fragment 2/2
function calculateUnifiedDiff(params) {
  const withGitPrefix = (path, prefix) => path === "/dev/null" ? path : `${prefix}/${path}`;
  const trimmedFilePath = params.filePath.trim();
  const normalizedFilePath = trimmedFilePath.length > 0 ? trimmedFilePath : "file";
  const fileChangeType = params.fileChangeType ?? "modified";
  const originalFilePath = fileChangeType === "added" ? "/dev/null" : normalizedFilePath;
  const newFilePath = fileChangeType === "deleted" ? "/dev/null" : normalizedFilePath;
  const originalFileName = withGitPrefix(originalFilePath, "a");
  const newFileName = withGitPrefix(newFilePath, "b");
  const unifiedDiff = createTwoFilesPatch(
    originalFileName,
    newFileName,
    params.original,
    params.new,
    "",
    "",
    { context: 3 }
  );
  return {
    unifiedDiff
  };
}
