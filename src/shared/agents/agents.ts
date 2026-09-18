var SAND_REQUESTED_AGENT_HARNESS_BOX = "box";
var SAND_REQUESTED_AGENT_HARNESS_TEMPORAL = "temporal";
var SAND_AGENT_RENAME_REFUSED = "agent-rename/refused";
var SAND_AGENT_ORIGINS = ["user", "dev"];
function isSandAgentOrigin(value) {
  return typeof value === "string" && SAND_AGENT_ORIGINS.some((member) => member === value);
}
var SAND_AGENT_PURPOSES = ["disk-saver", "plugin-auth"];
function isSandAgentPurpose(value) {
  return typeof value === "string" && SAND_AGENT_PURPOSES.some((member) => member === value);
}
var SAND_PROFILE_NAMED_BY = ["user", "app"];
function isSandProfileNamedBy(value) {
  return typeof value === "string" && SAND_PROFILE_NAMED_BY.some((member) => member === value);
}
var TEMPLATE_ID_PATTERN = /^[a-z0-9-]{1,64}$/;
function sanitizeTemplateId(value) {
  return typeof value === "string" && TEMPLATE_ID_PATTERN.test(value) ? value : void 0;
}
var SAND_TURN_SETTLEMENT_OUTCOMES = SAND_TURN_CLIENT_OUTCOMES;
function areAgentActivitiesEqual(left, right) {
  if (left === right) return true;
  if (left == null || right == null) return false;
  return left.kind === right.kind && left.tool === right.tool && left.detail === right.detail && left.target === right.target && left.callId === right.callId;
}
var SAND_DEFAULT_AGENT_NAME = "New Bot";
var LEGACY_SAND_DEFAULT_AGENT_NAME = "New Agent";
function isSandDefaultAgentName(name17) {
  const trimmed = name17.trim();
  return trimmed === SAND_DEFAULT_AGENT_NAME || trimmed === LEGACY_SAND_DEFAULT_AGENT_NAME;
}
var SAND_GROK_BOT_AGENT_NAME_MAX_LENGTH = 255;
var SAND_GROK_BOT_AGENT_TITLE_MAX_LENGTH = 255;
var SAND_GROK_BOT_AGENT_DESCRIPTION_MAX_LENGTH = 2e4;
var GROUP_MAX_MEMBERS = 6;
var GROUP_CHAT_MAX_PEOPLE = 20;
var GROUP_CHAT_MAX_PICKED_PEOPLE = GROUP_CHAT_MAX_PEOPLE - 1;
function isLocalBotAgent(agent) {
  return !agent.isGroup;
}
function isLocalGroup(agent) {
  return agent.isGroup;
}
function isBoxHostedRoom(agent) {
  return agent.isGroup && agent.harness !== "temporal";
}
function classifyBoxRoomSeats(agents, isServerBound) {
  const knownIds = new Set(agents.map((agent) => agent.id));
  const rooms = [];
  for (const room of agents) {
    if (!isBoxHostedRoom(room)) continue;
    const memberIds = room.memberIds.filter((id) => knownIds.has(id));
    const membersServerBound = memberIds.length > 0 && memberIds.every(isServerBound);
    rooms.push({ room, memberIds, membersServerBound });
  }
  return rooms;
}
var SandAgentStoreUnreadableError = class extends SandDomainError {
  name = "SandAgentStoreUnreadableError";
  isSandAgentStoreUnreadable = true;
  constructor(agentId, options2) {
    super(`Bot ${agentId} store is unreadable`, options2);
  }
};
var SAND_TEMPORAL_HARNESS_UNAVAILABLE_MESSAGE = "The Temporal harness is not enabled for this account";
var SAND_AGENT_ID_TAKEN_MESSAGE = "This agent id is already taken";
