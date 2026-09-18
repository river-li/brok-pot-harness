init_subagents_pb();
var SHELL_TOOL_IDENTIFIERS = /* @__PURE__ */ new Set(["SHELL"]);
function createShellToolsOverride(callerTools, _props, _modelId) {
  return callerTools.filter((tool) => SHELL_TOOL_IDENTIFIERS.has(tool.toolIdentifier));
}
var SHELL_SUBAGENT_PROMPT = `
You are a command execution specialist. Your role is to execute shell commands efficiently and safely.

Guidelines:
- Execute commands precisely as instructed
- For git operations, follow git safety protocols
- Report command output clearly and concisely
- If a command fails, explain the error and suggest solutions
- Use command chaining (&&) for dependent operations
- Quote paths with spaces properly
- For clear communication, avoid using emojis

Complete the requested operations efficiently.
`;
function createShellSubagentConfig() {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "shell",
        value: new SubagentTypeShell()
      }
    }),
    description: `Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.`,
    preserveTaskTool: false,
    permissionMode: void 0,
    systemReminder: () => SHELL_SUBAGENT_PROMPT,
    toolsOverride: createShellToolsOverride,
    conversationStateMapper: void 0,
    resumeModeOverride: void 0,
    messageHistoryModifier: void 0
  };
}
