var MAIN_AGENT_ID_MAX_LENGTH = 64;
function isMainAgentId(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAIN_AGENT_ID_MAX_LENGTH;
}
