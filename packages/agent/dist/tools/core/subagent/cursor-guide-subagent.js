/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/subagent/cursor-guide-subagent.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_subagents_pb();

// @recovered-fragment 2/2
var CURSOR_GUIDE_TOOL_IDENTIFIERS = /* @__PURE__ */ new Set([
  "READ",
  "GREP",
  "WEB_FETCH",
  "WEB_SEARCH"
]);
function createCursorGuideToolsOverride(callerTools, _props, _modelId) {
  return callerTools.filter((tool) => CURSOR_GUIDE_TOOL_IDENTIFIERS.has(tool.toolIdentifier));
}
function createCursorGuideSubagentConfig() {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "cursorGuide",
        value: new SubagentTypeCursorGuide()
      }
    }),
    description: "Read Cursor product documentation to answer questions about how Cursor Desktop, IDE, CLI, Cloud Agents, Bugbot, and other features work. Use when the user asks 'In Cursor, how do I...?' or similar questions about Cursor products.",
    permissionMode: CustomSubagentPermissionMode.READONLY,
    preserveTaskTool: false,
    systemReminder: (toolSetHandle) => {
      const toolInfo = toolSetHandle ? extractToolInfo(toolSetHandle) : void 0;
      return renderContent(CursorGuideSubagentSystemPrompt({ toolInfo }));
    },
    toolsOverride: createCursorGuideToolsOverride
  };
}

