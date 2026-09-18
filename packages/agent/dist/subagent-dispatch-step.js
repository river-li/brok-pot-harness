init_agent_pb();
function subagentDispatchStepFromToolCall(toolCall, stepIndex) {
  const toolCallId = toolCall.toolCallId;
  if (toolCallId === void 0 || toolCallId.length === 0) {
    return void 0;
  }
  const tool = toolCall.tool;
  switch (tool.case) {
    case "taskToolCall": {
      const result = tool.value.result?.result;
      return new SubagentDispatchStep({
        stepIndex,
        toolCallId,
        tool: SubagentDispatchTool.TASK,
        backgrounded: result?.case === "success" && result.value.isBackground === true
      });
    }
    case "createAgentToolCall":
      return new SubagentDispatchStep({
        stepIndex,
        toolCallId,
        tool: SubagentDispatchTool.CREATE_AGENT,
        backgrounded: tool.value.result?.result.case === "success"
      });
    case "sendToAgentToolCall":
      return new SubagentDispatchStep({
        stepIndex,
        toolCallId,
        tool: SubagentDispatchTool.SEND_TO_AGENT,
        backgrounded: tool.value.result?.result.case === "success"
      });
    default:
      return void 0;
  }
}
