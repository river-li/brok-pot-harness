/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/automations/platform-communication-tools.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var AUTOMATIONS_PLATFORM_COMMUNICATION_TOOL_NAMES = [
  "SendSlackMessage",
  "SendMicrosoftTeamsMessage",
  "PostReviewCommentOnPr"
];
var automationsPlatformCommunicationToolNameSet = new Set(AUTOMATIONS_PLATFORM_COMMUNICATION_TOOL_NAMES);
function isAutomationsPlatformCommunicationToolName(toolName) {
  return automationsPlatformCommunicationToolNameSet.has(toolName);
}
var SUBAGENT_EXCLUDED_AUTOMATION_TOOL_NAMES = [
  ...AUTOMATIONS_PLATFORM_COMMUNICATION_TOOL_NAMES,
  "PostToPrComment"
];
var subagentExcludedPlatformCommunicationToolNameSet = /* @__PURE__ */ new Set([
  ...SUBAGENT_EXCLUDED_AUTOMATION_TOOL_NAMES,
  SEND_SLACK_MESSAGE_V2_TOOL_NAME,
  OFFER_REPOSITORY_SWITCH_TOOL_NAME,
  START_SLACK_STREAMING_TOOL_NAME
]);
function isSubagentExcludedPlatformCommunicationToolName(toolName) {
  return subagentExcludedPlatformCommunicationToolNameSet.has(toolName);
}
var subagentExcludedCommunicationMcpToolNamesByServer = /* @__PURE__ */ new Map([
  [
    SLACK_AGENT_TOOLS_MCP_SERVER_ID.toLowerCase(),
    /* @__PURE__ */ new Set([
      SLACK_OFFER_REPOSITORY_SWITCH_MCP_TOOL_NAME,
      SLACK_SEND_MESSAGE_MCP_TOOL_NAME,
      SLACK_SET_STATUS_MCP_TOOL_NAME,
      SLACK_START_STREAMING_MCP_TOOL_NAME
    ])
  ],
  [
    AUTOMATION_TOOLS_MCP_SERVER_ID.toLowerCase(),
    new Set(SUBAGENT_EXCLUDED_AUTOMATION_TOOL_NAMES.map(automationToolNameToSnakeCase))
  ]
]);

