/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/exclude-tools.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var TOOL_CALL_TOOL_FIELDS = ToolCall.fields.list().filter((field) => field.oneof?.localName === "tool");
var AGENT_PROTO_TOOL_NAMES = TOOL_CALL_TOOL_FIELDS.map((field) => field.name);
var BASE_STATIC_NATIVE_TOOL_IDENTIFIERS = /* @__PURE__ */ new Set([
  "ANTHROPIC_COMPUTER_USE",
  "APPLY_PATCH",
  "COMMUNICATE_UPDATE",
  "CREATE_PLAN",
  "CREATE_PLAN_V2",
  "GEMINI_COMPUTER_USE",
  "GLOB",
  "GREP",
  "OPENAI_COMPUTER_USE",
  "PR_MANAGEMENT",
  "READ",
  "RECORD_SCREEN",
  "SEND_MESSAGE",
  "SETUP_VM_ENVIRONMENT",
  "SHELL",
  "STR_REPLACE",
  "WRITE"
]);
var NORMALIZED_PROTO_TOOL_NAMES = /* @__PURE__ */ new Map();
for (const field of TOOL_CALL_TOOL_FIELDS) {
  NORMALIZED_PROTO_TOOL_NAMES.set(field.name, field.name);
  NORMALIZED_PROTO_TOOL_NAMES.set(field.name.toUpperCase(), field.name);
  NORMALIZED_PROTO_TOOL_NAMES.set(field.localName, field.name);
}
function shouldOffloadTool(profile, toolIdentifier) {
  switch (profile) {
    case "all-static":
      return false;
    case "minimal":
      return ["CREATE_GOAL", "GENERATE_IMAGE", "UPDATE_GOAL"].includes(toolIdentifier);
    case "final":
      return toolIdentifier !== "ASK_QUESTION" && !BASE_STATIC_NATIVE_TOOL_IDENTIFIERS.has(toolIdentifier);
    default: {
      const _exhaustive = profile;
      return _exhaustive;
    }
  }
}
function partitionDynamicTools(tools, profile) {
  const staticTools = [];
  const dynamicTools = [];
  for (const tool of tools) {
    if (tool.dynamicToolMetaRole !== void 0 || "customToolFormat" in tool && tool.customToolFormat !== void 0 || isForcedStaticContext(tool.contextType) || tool.toolIdentifier === "PLATFORM_ACTION" && isSubagentExcludedPlatformCommunicationToolName(tool.name)) {
      staticTools.push(tool);
      continue;
    }
    if (shouldOffloadTool(profile, tool.toolIdentifier)) {
      dynamicTools.push(tool);
    } else {
      staticTools.push(tool);
    }
  }
  return { staticTools, dynamicTools };
}

