function isTerminalCloudAgentRunStatus(status) {
  return status === "finished" || status === "error" || status === "expired";
}
var SAND_CLOUD_AGENT_ARTIFACTS_BOX_ROOT = "/workspace/cloud-agent-artifacts";
