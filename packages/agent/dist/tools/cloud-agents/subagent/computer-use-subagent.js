var DEFAULT_COMPUTER_USE_MODEL_IDS = [
  "claude-sonnet-5-thinking-high",
  "claude-4.5-sonnet"
];
var COMPUTER_USE_SUBAGENT_PROMPT = `Enter COMPUTER USE mode. Follow the provided instruction above.`;
var COMPUTER_USE_SUBAGENT_TOOL_IDENTIFIERS = /* @__PURE__ */ new Set([
  "SHELL",
  "READ",
  "GREP",
  "GLOB"
]);
function resolveDefaultModelIds(cuaModel) {
  if (typeof cuaModel !== "string" || cuaModel.length === 0) {
    return [...DEFAULT_COMPUTER_USE_MODEL_IDS];
  }
  return [cuaModel, ...DEFAULT_COMPUTER_USE_MODEL_IDS.filter((modelId) => modelId !== cuaModel)];
}
function createComputerUseTools({ callerTools, props, modelId, apiCanvas }) {
  const tools = callerTools.filter((tool) => COMPUTER_USE_SUBAGENT_TOOL_IDENTIFIERS.has(tool.toolIdentifier));
  tools.push(createAnthropicComputerTool({
    displayWidthPx: apiCanvas.width,
    displayHeightPx: apiCanvas.height,
    resourceAccessor: props.resourceAccessor,
    modelId
  }));
  return tools;
}
function createComputerUseSubagentConfig(overrides = {}) {
  const apiCanvas = overrides.apiCanvas ?? { width: 1280, height: 800 };
  return {
    subagent_type: new SubagentType({
      type: {
        case: "computerUse",
        value: new SubagentTypeComputerUse()
      }
    }),
    description: "Perform manual testing of built applications and code. This subagent has access to the computer and browser to test the application. This subagent_type is stateful; if a computerUse subagent already exists, the previously created subagent will be resumed if you reuse the Task tool with subagent_type set to computerUse.",
    preserveTaskTool: false,
    toolsOverride: (callerTools, props, modelId) => createComputerUseTools({
      callerTools,
      props,
      modelId,
      apiCanvas
    }),
    conversationStateMapper: void 0,
    defaultModelIds: resolveDefaultModelIds(overrides.cuaModel),
    forceDefaultModel: true,
    systemReminder: () => COMPUTER_USE_SUBAGENT_PROMPT,
    resumeModeOverride: SubagentResumeMode.LAST_AGENT_SAME_TYPE,
    messageHistoryModifier: void 0
  };
}
var COMPUTER_USE_SUBAGENT_CONFIG = createComputerUseSubagentConfig();
