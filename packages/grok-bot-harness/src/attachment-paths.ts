var import_node_path88 = require("node:path");
var ATTACHMENTS_DIRNAME = "attachments";
var ASSETS_DIRNAME = "assets";
function getAgentAttachmentsDir(agentDir) {
  return (0, import_node_path88.join)(agentDir, ATTACHMENTS_DIRNAME);
}
function getAgentAssetsDir(agentDir) {
  return (0, import_node_path88.join)(agentDir, ASSETS_DIRNAME);
}
function getAgentMediaStoreRoots(agentDir) {
  return [getAgentAttachmentsDir(agentDir), getAgentAssetsDir(agentDir)];
}
