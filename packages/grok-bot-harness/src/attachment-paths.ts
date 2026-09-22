/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/attachment-paths.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path36 = require("node:path");
var ATTACHMENTS_DIRNAME = "attachments";
var ASSETS_DIRNAME = "assets";
function getAgentAttachmentsDir(agentDir) {
  return (0, import_node_path36.join)(agentDir, ATTACHMENTS_DIRNAME);
}
function getAgentAssetsDir(agentDir) {
  return (0, import_node_path36.join)(agentDir, ASSETS_DIRNAME);
}
function getAgentMediaStoreRoots(agentDir) {
  return [getAgentAttachmentsDir(agentDir), getAgentAssetsDir(agentDir)];
}

