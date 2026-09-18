var MAX_ACTIVITY_DETAIL_CHARS = 80;
var THINKING_ACTIVITY = { kind: "thinking" };
var SURFACE_UNRESOLVED_TOOL_CASES = /* @__PURE__ */ new Set([
  "shellToolCall",
  "readToolCall",
  "awaitToolCall"
]);
function deriveActivityFromUpdate(update) {
  switch (update.type) {
    case "thinking-delta":
    case "text-delta":
      return { type: "set", activity: THINKING_ACTIVITY };
    case "tool-call": {
      if (update.name === SEND_MESSAGE_TOOL_CALL_OUTLINE_NAME) {
        return { type: "keep" };
      }
      if (update.status !== "pending") return { type: "keep" };
      if (SURFACE_UNRESOLVED_TOOL_CASES.has(update.name)) {
        return { type: "keep" };
      }
      return { type: "set", activity: deriveToolCallActivity(update) };
    }
    case "send-message":
    case "turn-ended":
      return { type: "clear" };
    default:
      return { type: "keep" };
  }
}
var NAMED_ACTIVITY_MAX_HOLD_MS = 2500;
var INITIAL_NAMED_ACTIVITY_HOLD_STATE = {
  heldActivity: void 0,
  heldSinceMs: 0
};
function resolveNamedActivityHold(update, state, nowMs2, maxHoldMs) {
  const base = deriveActivityFromUpdate(update);
  if (update.type === "thinking-delta" || update.type === "text-delta") {
    const isWithinHold = state.heldActivity != null && nowMs2 - state.heldSinceMs < maxHoldMs;
    return { transition: isWithinHold ? { type: "keep" } : base, state };
  }
  if (update.type === "tool-call") {
    if (base.type === "set") {
      return {
        transition: base,
        state: { heldActivity: base.activity, heldSinceMs: nowMs2 }
      };
    }
    return {
      transition: base,
      state: state.heldActivity != null ? { ...state, heldSinceMs: nowMs2 } : state
    };
  }
  if (base.type === "clear") {
    return { transition: base, state: INITIAL_NAMED_ACTIVITY_HOLD_STATE };
  }
  return { transition: base, state };
}
function createGroupMemberActivityTracker() {
  let isReplyStreaming = false;
  return (update) => {
    switch (update.type) {
      case "text-delta":
        if (update.text.length === 0) return { type: "keep" };
        isReplyStreaming = true;
        return { type: "clear" };
      case "thinking-delta":
        return isReplyStreaming ? { type: "keep" } : { type: "set", activity: THINKING_ACTIVITY };
      case "tool-call":
        if (update.status === "pending") {
          isReplyStreaming = false;
          if (update.name === SEND_MESSAGE_TOOL_CALL_OUTLINE_NAME) {
            return { type: "clear" };
          }
        }
        return deriveActivityFromUpdate(update);
      case "send-message":
      case "turn-ended":
        isReplyStreaming = false;
        return { type: "clear" };
      default:
        return deriveActivityFromUpdate(update);
    }
  };
}
var COMMUNICATE_ENVELOPE_TOOL_NAME = "communicateUpdateToolCall";
function deriveToolCallActivity(input) {
  const args = parseArgsJson(input.args);
  const { tool, detail, target } = resolveToolCall(input, args);
  return {
    kind: "tool",
    tool,
    ...detail != null && detail.length > 0 ? { detail: clampLine(detail, MAX_ACTIVITY_DETAIL_CHARS) } : {},
    ...target != null && target.length > 0 ? { target } : {},
    callId: input.id
  };
}
function resolveShellCall(surface, args) {
  const command = readString(args, "command");
  const editTarget = command != null ? extractShellEditTarget(command) : void 0;
  return { tool: surface, detail: editTarget };
}
function resolveToolCall(input, args) {
  const stamped = decodeSandToolActivity(readString(args, "currentStep"));
  if (stamped !== void 0 && (input.name === COMMUNICATE_ENVELOPE_TOOL_NAME || input.name === stamped.tool)) {
    return { ...stamped, tool: stamped.tool ?? input.name };
  }
  switch (input.name) {
    case SAND_BOX_SHELL_TOOL_NAME:
      return resolveShellCall(
        readString(args, "machineId") == null ? SAND_BOX_SHELL_TOOL_NAME : SAND_MACHINE_SHELL_ACTIVITY_NAME,
        args
      );
    case "shellToolCall":
      return resolveShellCall(SAND_BOX_SHELL_TOOL_NAME, args);
    case SAND_BOX_READ_TOOL_NAME:
      return {
        tool: SAND_BOX_READ_TOOL_NAME,
        detail: fileBasename(readString(args, "path"))
      };
    case "readToolCall":
      return {
        tool: SAND_BOX_READ_TOOL_NAME,
        detail: fileBasename(readString(args, "path"))
      };
    case "webSearchToolCall":
      return { tool: "WebSearch", detail: readString(args, "searchTerm") };
    case "webFetchToolCall":
      return { tool: "WebFetch", detail: urlHostname(readString(args, "url")) };
    case "generateImageToolCall":
      return { tool: "GenerateImage", detail: readString(args, "description") };
    case "mcpToolCall":
      return {
        tool: "CallMcpTool",
        detail: readString(args, "providerIdentifier") ?? readString(args, "serverIdentifier")
      };
    case "getMcpToolsToolCall":
      return { tool: "GetMcpTools", detail: readString(args, "server") };
    case "mcpAuthToolCall":
      return { tool: "McpAuth", detail: readString(args, "serverIdentifier") };
    case SAND_BOX_AWAIT_SHELL_TOOL_NAME:
      return { tool: SAND_BOX_AWAIT_SHELL_TOOL_NAME };
    case "awaitToolCall":
      return { tool: SAND_BOX_AWAIT_SHELL_TOOL_NAME };
    case "computerUseToolCall":
      return { tool: "Computer" };
    case "Task":
      return { tool: "Task", detail: input.summary };
    case "Screenshot":
      return { tool: "Screenshot" };
    default:
      return { tool: input.name };
  }
}
function parseArgsJson(raw) {
  if (raw == null || raw.length === 0) return null;
  try {
    const parsed2 = JSON.parse(raw);
    if (typeof parsed2 !== "object" || parsed2 == null || Array.isArray(parsed2)) {
      return null;
    }
    return parsed2;
  } catch {
    return null;
  }
}
function readString(args, key) {
  const value = args?.[key];
  if (typeof value !== "string") return void 0;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function hasMachineTargetArgument(rawArgs) {
  return readString(parseArgsJson(rawArgs), "machineId") != null;
}
function fileBasename(path31) {
  if (path31 == null) return void 0;
  const segments = path31.split(/[\\/]/).filter((segment) => segment.length > 0);
  return segments.at(-1);
}
function urlHostname(raw) {
  if (raw == null) return void 0;
  try {
    const hostname3 = new URL(raw).hostname;
    return hostname3.length > 0 ? hostname3 : void 0;
  } catch {
    return void 0;
  }
}
var DISCARD_REDIRECT_TARGETS = /* @__PURE__ */ new Set(["/dev/null", "/dev/stdout", "/dev/stderr"]);
var OUTPUT_REDIRECT_PATTERN = /(?<![\d>&])>{1,2}\s*([^&\s;|<>]+)/;
var TEE_PATTERN = /\btee\s+(?:-[a-zA-Z]+\s+)*([^\s;|&<>-][^\s;|&<>]*)/;
var SED_IN_PLACE_PATTERN = /\bsed\b[^;|&]*\s-i\b/;
function stripQuotes(token) {
  return token.replace(/^['"]|['"]$/g, "");
}
function looksLikeFilePath(token) {
  return /[\\/]/.test(token) || /\.[A-Za-z0-9]+$/.test(token);
}
function extractShellEditTarget(command) {
  const redirect = OUTPUT_REDIRECT_PATTERN.exec(command);
  if (redirect?.[1] != null) {
    const target = stripQuotes(redirect[1]);
    if (!DISCARD_REDIRECT_TARGETS.has(target)) {
      return fileBasename(target);
    }
  }
  const tee = TEE_PATTERN.exec(command);
  if (tee?.[1] != null) {
    const target = stripQuotes(tee[1]);
    if (!DISCARD_REDIRECT_TARGETS.has(target)) {
      return fileBasename(target);
    }
  }
  if (SED_IN_PLACE_PATTERN.test(command)) {
    const tokens = command.trim().split(/\s+/).map(stripQuotes);
    const lastFileToken = tokens.slice().reverse().find((token) => looksLikeFilePath(token));
    if (lastFileToken != null) return fileBasename(lastFileToken);
  }
  return void 0;
}
