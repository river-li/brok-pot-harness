init_dist4();
var sandLocalToolScopeKey = createKey(/* @__PURE__ */ Symbol("sand.local-tool.scope"), void 0);
var sandTurnDirectionEpochKey = createKey(/* @__PURE__ */ Symbol("sand.local-tool.direction-epoch"), void 0);
var SAND_LOCAL_TOOLS_DISABLED_MESSAGE = 'Local tools are turned off. The user has set local tool access to "Never", so Shell, Read, and AwaitShell with machineId, plus CopyToBox and CopyFromBox, cannot run on their computer. Do not retry them while this setting remains "Never". Use your own computer instead by omitting machineId, or ask the user to change the setting in Settings \u2192 Bot \u2192 Execution on Local Computer. If they change it away from "Never", you may try again.';
var SAND_LOCAL_TOOLS_DENIED_MESSAGE = "The user declined this action on their computer. Do not retry it. Do something else, use your own computer instead (Shell, Read, AwaitShell), or ask them what they would prefer.";
var SAND_MESSAGES_DISABLED_MESSAGE = "Messages is turned off in the user's settings, so their Messages cannot be read or sent from here. Do not retry while it stays off. If the user wants this, ask them to turn Messages back on in Settings.";
var SAND_LOCAL_TOOLS_ASK_EXPIRED_MESSAGE = "The request to run this on the user's computer went unanswered, so nothing ran. Use your own computer instead (Shell, Read, AwaitShell), or tell the user you are waiting on their approval.";
var SAND_LOCAL_TOOLS_ASK_CANCELLED_MESSAGE = "The request to use the user's computer was cancelled before the user answered.";
var SAND_LOCAL_TOOLS_ASK_UNAVAILABLE_MESSAGE = "Using the user's computer needs their permission, and this conversation has nowhere to ask for it. Use your own computer instead (Shell, Read, AwaitShell), or do this from a direct chat with the user.";
var SAND_LOCAL_TOOLS_UNDESCRIBABLE_MESSAGE = "Grok Bot could not describe that request to the user's computer, so it could not ask permission for it and did not run it. Use your own computer instead (Shell, Read, AwaitShell).";
var SAND_LOCAL_TOOLS_UNAPPROVED_MESSAGE = `That action was not approved on the user's computer, so nothing ran. Ask the user to approve it (or to set Settings \u2192 Bot \u2192 Execution on Local Computer to "Always allow"), and use your own computer (Shell, Read, AwaitShell) in the meantime.`;
var SAND_LOCAL_TOOLS_ABANDONED_MESSAGE = "The user was already asked about this exact action on their computer and did not approve it, so it will not run and will not be asked again for this task \u2014 a later permission change does not authorize it. Do not retry it. If it still needs to happen, say so in chat and let the user ask for it, and use your own computer in the meantime (Shell, Read, AwaitShell).";
var SAND_LOCAL_TOOLS_STALE_TASK_MESSAGE = "This task's earlier requests to use the user's computer were not approved and the user has since moved on, so nothing from this task will run there. Do not retry. If it still needs to happen, say so in chat and let the user ask for it, and use your own computer in the meantime (Shell, Read, AwaitShell).";
var SAND_LOCAL_TOOLS_PREPARATORY_MESSAGE = "That preparatory access to the user's computer was skipped: the user is asked about the action itself, not the work leading up to it. Continue without it.";
var SAND_LOCAL_TOOLS_TARGET_TOO_LARGE_MESSAGE = "That action is too long to show the user for approval, so it was not run. Split it into smaller steps, or use your own computer instead (Shell, Read, AwaitShell).";
function normalizeResourcePath(path31) {
  if (path31 === void 0 || path31.length === 0) return void 0;
  return path31.replace(/\\/g, "/");
}
function sandTerminalFilePath(terminalsFolder, shellId) {
  if (shellId.length === 0) return void 0;
  return `${normalizeSeparators(terminalsFolder)}/${shellId}.txt`;
}
function normalizeSeparators(path31) {
  return path31.replace(/\\/g, "/").replace(/\/+$/, "");
}
function isTerminalFile(path31, terminalsFolder) {
  const folder = normalizeSeparators(terminalsFolder);
  if (folder.length === 0) return false;
  const normalized = normalizeSeparators(path31);
  if (!normalized.startsWith(`${folder}/`)) return false;
  const rest = normalized.slice(folder.length + 1);
  return rest.length > 0 && !rest.includes("/") && rest.endsWith(".txt");
}
var SandLocalToolPermissionDeniedError = class extends Error {
  constructor(reason, code) {
    super(reason);
    this.code = code;
    this.name = "SandLocalToolPermissionDeniedError";
  }
  code;
  toolCallAuditOutcome = "denied";
};
async function authorizeLocalToolAction(gate, scope, request5) {
  const decision = await gate.authorize(scope, request5);
  if (!decision.allowed) {
    throw new SandLocalToolPermissionDeniedError(decision.reason);
  }
  return decision.approvalId;
}
function describeLocalExec(serverMessage, terminalsFolder) {
  const message = serverMessage.message;
  switch (message.case) {
    case "shellStreamArgs":
    case "backgroundShellSpawnArgs":
      return {
        action: "run-command",
        target: message.value.command,
        resourcePath: terminalsFolder,
        ...message.case === "backgroundShellSpawnArgs" || message.value.isBackground ? { outlivesScope: true } : {}
      };
    case "forceBackgroundShellArgs":
      return {
        action: "run-command",
        target: "a command already running",
        targetKind: "command_already_running",
        attachToResourcePath: terminalsFolder,
        outlivesScope: true
      };
    case "writeShellStdinArgs":
      return { action: "send-input", target: message.value.chars };
    case "readArgs":
    case "redactedReadArgs": {
      const path31 = message.value.path;
      return {
        action: "read-file",
        target: path31,
        ...isTerminalFile(path31, terminalsFolder) ? { attachToResourcePath: terminalsFolder } : {}
      };
    }
    case "lsArgs":
      return { action: "list-directory", target: message.value.path };
    default:
      return void 0;
  }
}
function localToolApprovalCovers(approval, request5) {
  if (approval.machineId !== request5.machineId) return false;
  if (approval.action === request5.action && approval.target === request5.target) {
    return true;
  }
  const owned = normalizeResourcePath(approval.resourcePath);
  const wanted = normalizeResourcePath(request5.attachToResourcePath);
  return owned !== void 0 && owned === wanted;
}
