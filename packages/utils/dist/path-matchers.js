/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/path-matchers.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isAbsolutePath(filePath) {
  if (filePath.startsWith("/")) {
    return true;
  }
  if (/^[a-zA-Z]:[\\/]/.test(filePath)) {
    return true;
  }
  if (filePath.startsWith("\\\\")) {
    return true;
  }
  return false;
}
function splitPath(path31) {
  return path31.split(/[/\\]/).filter((c) => c);
}
function matchProjectSubdir(path31, targetDir) {
  const parts = splitPath(path31);
  for (let i = 0; i < parts.length - 2; i++) {
    if (parts[i] === ".cursor" && parts[i + 1] === "projects" && parts[i + 3] === targetDir) {
      return {
        workspaceId: parts[i + 2],
        remainingPath: parts.slice(i + 4)
      };
    }
  }
  return null;
}
function isAgentTranscriptPath(path31) {
  const match2 = matchProjectSubdir(path31, "agent-transcripts");
  return match2 !== null;
}
function extractTerminalId(filePath) {
  const match2 = matchProjectSubdir(filePath, "terminals");
  if (!match2 || match2.remainingPath.length !== 1) {
    return null;
  }
  const fileName = match2.remainingPath[0];
  const fileMatch = /^(\d+)\.txt$/.exec(fileName);
  if (!fileMatch)
    return null;
  const id = Number.parseInt(fileMatch[1], 10);
  if (Number.isNaN(id))
    return null;
  return { id };
}
function sanitizeFilename(name17) {
  return name17.replace(/[^a-zA-Z0-9._-]/g, "_");
}
var init_path_matchers = __esm({
  "../packages/utils/dist/path-matchers.js"() {
    "use strict";
  }
});

