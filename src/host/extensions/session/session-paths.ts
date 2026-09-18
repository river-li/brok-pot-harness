var import_promises62 = require("node:fs/promises");
var import_node_os26 = require("node:os");
var import_node_path131 = require("node:path");
init_errors();
var STORE_FILENAME2 = "store.db";
var CONVERSATION_BLOBS_FILENAME = "conversation-blobs.db";
var SAND_CONVERSATION_ROOT_SLOT_ID = new TextEncoder().encode(
  "sand-live-conversation-root-v1__"
);
var STALE_ROOT_CLEANUP_VERSION = 1;
var ACTIVE_AGENT_FILENAME = "active-agent.json";
var HIDDEN_ENTRY_REPAIR_VERSION = 1;
var LEGACY_GROUP_MEMBERS_DIRNAME = "members";
function getSandTranscriptsDir(homeDir = (0, import_node_os26.homedir)()) {
  return (0, import_node_path131.join)(getSandRootDir(homeDir), "agent-transcripts");
}
function getAgentDbPath(rootDir, agentId) {
  assertValidSandAgentId(agentId);
  return (0, import_node_path131.join)(rootDir, agentId, STORE_FILENAME2);
}
var CONNECTOR_SECRETS_DIRNAME = "connector-secrets";
function getConnectorSecretsRoot(agentsRootDir = getSandAgentsRootDir()) {
  return (0, import_node_path131.join)((0, import_node_path131.dirname)(agentsRootDir), CONNECTOR_SECRETS_DIRNAME);
}
async function statIfExists(path31) {
  try {
    return await (0, import_promises62.stat)(path31);
  } catch (error41) {
    if (error41?.code !== "ENOENT") {
      reportSessionDiagnostic({
        family: "store_db",
        kind: "path_stat_failed",
        agentId: (0, import_node_path131.basename)((0, import_node_path131.dirname)(path31)),
        errorClass: errorLogTag(error41)
      });
    }
    return void 0;
  }
}
