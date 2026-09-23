var BROWSER_USE_PROVIDER_IDS = /* @__PURE__ */ new Set([CURSOR_IDE_BROWSER_PROVIDER_ID]);
var BROWSER_USE_LOCAL_CONTEXT_TOOL_IDENTIFIERS = /* @__PURE__ */ new Set([
  "READ",
  "GLOB",
  "GREP",
  "TODO_WRITE",
  "SEMANTIC_SEARCH"
]);
var BROWSER_USE_SUBAGENT_PROMPT = `Enter BROWSER USE mode. Use the provided cursor-ide-browser tools to interact with web pages.

Important: Every browser tool call automatically returns a screenshot of the current page state. You do NOT need to use the browser_take_screenshot tool explicitly - it would be redundant since you already receive screenshots after each action.
`;
async function* singleStringIterable(str4) {
  yield str4;
}
function createWrappedBrowserTool(resourceAccessor, mcpToolDefinition, subagentInstanceId, convertTupleSchemaToDraft2020_122) {
  const baseTool = createMcpTool(resourceAccessor, mcpToolDefinition, {
    convertTupleSchemaToDraft2020_12: convertTupleSchemaToDraft2020_122
  });
  return {
    ...baseTool,
    execute: async (ctx, interactionHandler, argsStream, meta) => {
      let argsJson = "";
      for await (const chunk of argsStream) {
        argsJson += chunk;
      }
      let modifiedArgs;
      try {
        const parsedArgs = JSON.parse(argsJson);
        modifiedArgs = parsedArgs !== null && typeof parsedArgs === "object" ? {
          ...parsedArgs,
          viewId: subagentInstanceId,
          take_screenshot_afterwards: true,
          headless: true
        } : {
          viewId: subagentInstanceId,
          take_screenshot_afterwards: true,
          headless: true
        };
      } catch {
        modifiedArgs = {
          viewId: subagentInstanceId,
          take_screenshot_afterwards: true,
          headless: true
        };
      }
      const modifiedArgsStream = singleStringIterable(JSON.stringify(modifiedArgs));
      return baseTool.execute(ctx, interactionHandler, modifiedArgsStream, meta);
    }
  };
}
function createBrowserUseToolsOverride(callerTools, props, modelId) {
  const { subagentInstanceId } = props;
  if (!subagentInstanceId) {
    throw new Error("browser-use subagent requires subagentInstanceId; ensure it is created via the Task tool");
  }
  const browserMcpTools = props.mcpTools.filter((tool) => BROWSER_USE_PROVIDER_IDS.has(tool.providerIdentifier));
  const convertTupleSchemas = shouldConvertMcpTupleSchemas(props, modelId);
  const tools = callerTools.filter((tool) => BROWSER_USE_LOCAL_CONTEXT_TOOL_IDENTIFIERS.has(tool.toolIdentifier));
  for (const browserTool of browserMcpTools) {
    tools.push(createWrappedBrowserTool(props.resourceAccessor, browserTool, subagentInstanceId, convertTupleSchemas));
  }
  return tools;
}
var BROWSER_USE_SUBAGENT_TYPE = new SubagentType({
  type: {
    case: "browserUse",
    value: new SubagentTypeBrowserUse()
  }
});
var BROWSER_USE_SUBAGENT_CONFIG = {
  subagent_type: BROWSER_USE_SUBAGENT_TYPE,
  permissionMode: CustomSubagentPermissionMode.AGENT_ONLY,
  description: "Perform browser-based testing and web automation. This subagent can navigate web pages, interact with elements, fill forms, and take screenshots. Use this for testing web applications, verifying UI changes, or any browser-based tasks. Use this browser subagent when you need to either: (1) parallelize browser tasks alongside other work, or (2) execute a longer sequence of browser actions that benefit from dedicated context. For simple, single browser actions, you may use the browser tools directly. This subagent requires agent mode because browser MCP access is unavailable in readonly mode. This subagent_type is stateful; if a browserUse subagent already exists, the previously created subagent will be resumed if you reuse the Task tool with subagent_type set to browserUse.",
  preserveTaskTool: false,
  toolsOverride: createBrowserUseToolsOverride,
  // subagentType is injected in task.ts; caller's system prompt is used unchanged.
  defaultModelIds: ["claude-4.5-sonnet"],
  systemReminder: () => BROWSER_USE_SUBAGENT_PROMPT,
  resumeModeOverride: SubagentResumeMode.LAST_AGENT_SAME_TYPE
};
