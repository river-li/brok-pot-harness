function stripHiddenMarker(text2) {
  const withoutHidden = text2.startsWith(SAND_HIDDEN_PROMPT_MARKER) ? text2.slice(SAND_HIDDEN_PROMPT_MARKER.length) : text2;
  return withoutHidden.startsWith(SAND_TRUSTED_AUTOMATION_PROMPT_MARKER) ? withoutHidden.slice(SAND_TRUSTED_AUTOMATION_PROMPT_MARKER.length) : withoutHidden;
}
var SEND_MESSAGE_TOOL_CALL_OUTLINE_NAME = "sendMessageToolCall";
var MCP_TOOL_CALL_OUTLINE_NAME = "mcpToolCall";
function getOutlineToolCallName(toolCall) {
  if (toolCall.tool.case === "communicateUpdateToolCall") {
    return decodeSandToolActivity(toolCall.tool.value.args?.currentStep)?.tool ?? "communicateUpdateToolCall";
  }
  if (toolCall.tool.case === "taskToolCall") return "Task";
  if (toolCall.tool.case === "computerUseToolCall") {
    const actions = toolCall.tool.value.args?.actions;
    if (actions?.length === 1 && actions[0]?.action.case === "screenshot") {
      return "Screenshot";
    }
  }
  return toolCall.tool.case ?? "Tool";
}
function getTaskSummary(taskToolCall) {
  const result = taskToolCall.result;
  if (result?.result.case === "error") {
    return result.result.value.error;
  }
  const description9 = taskToolCall.args?.description?.trim();
  if (description9 != null && description9.length > 0) return description9;
  const prompt = taskToolCall.args?.prompt?.trim();
  return prompt != null && prompt.length > 0 ? prompt : void 0;
}
function getOutlineToolCallSummary(toolCall) {
  if (toolCall.tool.case === "taskToolCall") {
    return getTaskSummary(toolCall.tool.value);
  }
  return void 0;
}
var MAX_TOOL_ACTIVITY_ARGS_CHARS = 2e4;
function getToolCallActivityArgs(toolCall) {
  const tool = toolCall.tool.value;
  if (tool == null || !("args" in tool) || tool.args == null) return void 0;
  let text2;
  try {
    text2 = JSON.stringify(tool.args.toJson());
  } catch {
    return void 0;
  }
  if (text2 === "{}" || text2 === '""' || text2 === "[]" || text2 === "null") {
    return void 0;
  }
  if (text2.length <= MAX_TOOL_ACTIVITY_ARGS_CHARS) return text2;
  const copiedPrefix = Buffer.from(text2.slice(0, MAX_TOOL_ACTIVITY_ARGS_CHARS), "utf8").toString(
    "utf8"
  );
  return `${copiedPrefix}
\u2026 (truncated)`;
}
function isFailedTaskToolCall(toolCall) {
  return toolCall.tool.case === "taskToolCall" && toolCall.tool.value.result?.result.case === "error";
}
function getOutlineToolCallStatus(event, toolCall) {
  if (event !== "toolCallCompleted") return "pending";
  if (toolCall.tool.case === "communicateUpdateToolCall" && toolCall.tool.value.result?.result.case === "error" && decodeSandToolActivity(toolCall.tool.value.args?.currentStep)?.tool !== void 0) {
    return "failed";
  }
  return isFailedTaskToolCall(toolCall) ? "failed" : "done";
}
function sendMessageFromToolCall(toolCall) {
  if (toolCall.result?.result.case === "error") return null;
  const message = toolCall.args?.message;
  if (message == null) return null;
  if (message.case === "text") {
    return { type: "text", content: message.value.content };
  }
  if (message.case === "attachment") {
    return {
      type: "attachment",
      url: message.value.url,
      ...message.value.alt != null && message.value.alt.length > 0 ? { alt: message.value.alt } : {}
    };
  }
  return null;
}
function stepToOutlineItem(step, id) {
  switch (step.message.case) {
    case "assistantMessage": {
      const text2 = step.message.value.text;
      if (text2.length === 0) return null;
      return { kind: "assistant-text", id, text: text2 };
    }
    case "thinkingMessage": {
      const { text: text2, durationMs } = step.message.value;
      if (text2.length === 0) return null;
      return {
        kind: "thinking",
        id,
        text: text2,
        durationMs: durationMs > 0 ? durationMs : void 0
      };
    }
    case "toolCall": {
      const toolCall = step.message.value;
      if (toolCall.tool.case === "sendMessageToolCall") {
        const message = sendMessageFromToolCall(toolCall.tool.value);
        return message == null ? null : { kind: "send-message", id, message };
      }
      return {
        kind: "tool-call",
        id,
        name: getOutlineToolCallName(toolCall),
        status: getOutlineToolCallStatus("toolCallCompleted", toolCall),
        summary: getOutlineToolCallSummary(toolCall)
      };
    }
    default:
      return null;
  }
}
function deriveOutlineTurnsFromConversationState(state) {
  const turns = [];
  state.turns.forEach((turn, turnIndex) => {
    if (turn.turn.case === "agentConversationTurn") {
      const agentTurn = turn.turn.value;
      const rawUserText = agentTurn.userMessage?.text ?? "";
      const userMessageId = agentTurn.userMessage?.messageId ?? "";
      const hidden = rawUserText.startsWith(SAND_HIDDEN_PROMPT_MARKER);
      const steer = agentTurn.userMessage?.turnSteer === true;
      const userText = stripHiddenMarker(rawUserText);
      const items = [];
      if (userText.trim().length > 0) {
        items.push({
          kind: "user",
          id: `outline-user-${turnIndex}`,
          text: userText,
          ...hidden ? { hidden: true } : {},
          ...steer ? { steer: true } : {}
        });
      }
      agentTurn.steps.forEach((step, stepIndex) => {
        const item = stepToOutlineItem(step, `outline-${turnIndex}-${stepIndex}`);
        if (item != null) items.push(item);
      });
      turns.push({ rawUserText, userMessageId, items });
    } else if (turn.turn.case === "shellConversationTurn") {
      const command = turn.turn.value.shellCommand?.command ?? "";
      turns.push({
        rawUserText: "",
        userMessageId: "",
        items: [
          {
            kind: "tool-call",
            id: `outline-shell-${turnIndex}`,
            name: "shellToolCall",
            status: "done",
            summary: command.length > 0 ? command : void 0
          }
        ]
      });
    }
  });
  return turns;
}
function deriveOutlineFromConversationState(state) {
  return deriveOutlineTurnsFromConversationState(state).flatMap((turn) => turn.items);
}
