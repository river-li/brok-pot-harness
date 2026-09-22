/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/path-matchers.js
 * Bundle: sand-host/sand-eval-runner.cjs
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
function splitPath(path30) {
  return path30.split(/[/\\]/).filter((c) => c);
}
function matchProjectSubdir(path30, targetDir) {
  const parts = splitPath(path30);
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
function isCursorTerminalsDirectory(path30) {
  const match2 = matchProjectSubdir(path30, "terminals");
  return match2 !== null && match2.remainingPath.length === 0;
}
function isAgentTranscriptPath(path30) {
  const match2 = matchProjectSubdir(path30, "agent-transcripts");
  return match2 !== null;
}
function isAgentToolOutputFile(filePath) {
  const match2 = matchProjectSubdir(filePath, "agent-tools");
  return match2 !== null && match2.remainingPath.length === 1 && match2.remainingPath[0].endsWith(".txt");
}
function isTerminalFilePath(filePath) {
  return extractTerminalId(filePath) !== null;
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

