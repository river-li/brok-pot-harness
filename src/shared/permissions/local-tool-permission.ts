var SAND_LOCAL_TOOL_PERMISSIONS = ["always", "ask", "never"];
var SAND_DEFAULT_LOCAL_TOOL_PERMISSION = "ask";
var SAND_LOCAL_TOOL_ASK_TTL_MS = 10 * 60 * 1e3;
function isSandLocalToolPermission(value) {
  return typeof value === "string" && SAND_LOCAL_TOOL_PERMISSIONS.includes(value);
}
function normalizeSandLocalToolPermission(value) {
  return isSandLocalToolPermission(value) ? value : SAND_DEFAULT_LOCAL_TOOL_PERMISSION;
}
var SAND_LOCAL_TOOL_ACTIONS = [
  "run-command",
  "send-input",
  "read-file",
  "list-directory",
  "write-file",
  "read-messages",
  "send-imessage"
];
var SAND_LOCAL_TOOL_STANDING = {
  "run-command": "global",
  "send-input": "global",
  "read-file": "global",
  "list-directory": "global",
  "write-file": "global",
  "read-messages": "setting",
  "send-imessage": "subject"
};
function localToolActionStanding(action) {
  return isSandLocalToolAction(action) ? SAND_LOCAL_TOOL_STANDING[action] : "subject";
}
var SAND_MESSAGES_LOCAL_TOOL_ACTIONS = [
  "read-messages",
  "send-imessage"
];
function isSandLocalToolAction(value) {
  return typeof value === "string" && SAND_LOCAL_TOOL_ACTIONS.includes(value);
}
var SAND_LOCAL_TOOL_PERMISSION_RESOLUTIONS = [
  "allow-once",
  "deny",
  "always",
  "never"
];
function isSandLocalToolPermissionResolution(value) {
  return typeof value === "string" && SAND_LOCAL_TOOL_PERMISSION_RESOLUTIONS.includes(value);
}
var SAND_LOCAL_TOOL_PERMISSION_RANK = {
  never: 0,
  ask: 1,
  always: 2
};
function resolveSandLocalToolPermission(choice, adminCeiling) {
  if (adminCeiling === void 0) return choice;
  return SAND_LOCAL_TOOL_PERMISSION_RANK[choice] <= SAND_LOCAL_TOOL_PERMISSION_RANK[adminCeiling] ? choice : adminCeiling;
}
