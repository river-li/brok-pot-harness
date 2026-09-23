init_chat_pb();
var HistoryVisibilityMode;
(function(HistoryVisibilityMode2) {
  HistoryVisibilityMode2["INTERNAL"] = "INTERNAL";
  HistoryVisibilityMode2["EXTERNAL"] = "EXTERNAL";
  HistoryVisibilityMode2["NO_PREAMBLE"] = "NO_PREAMBLE";
})(HistoryVisibilityMode || (HistoryVisibilityMode = {}));
function tryParseJson(str4) {
  if (!str4)
    return void 0;
  try {
    return JSON.parse(str4);
  } catch (_a19) {
    return str4;
  }
}
function applyToolCallTimestamps(target, toolResult) {
  const startedAtMs = toolResult.startedAtMs !== void 0 ? Number(toolResult.startedAtMs) : void 0;
  const completedAtMs = toolResult.completedAtMs !== void 0 ? Number(toolResult.completedAtMs) : void 0;
  if (startedAtMs !== void 0) {
    target.started_at_ms = startedAtMs;
  }
  if (completedAtMs !== void 0) {
    target.completed_at_ms = completedAtMs;
  }
  if (startedAtMs !== void 0 && completedAtMs !== void 0) {
    target.duration_ms = completedAtMs - startedAtMs;
  }
}
function extractToolResultContent(toolResult) {
  var _a19;
  if (toolResult.content) {
    return tryParseJson(toolResult.content);
  }
  if ((_a19 = toolResult.result) === null || _a19 === void 0 ? void 0 : _a19.result) {
    const result = toolResult.result.result;
    if (result.case && result.value !== void 0) {
      return { resultType: result.case, value: result.value };
    }
  }
  return void 0;
}
function convertConversationMessagesToTrace(messages2, visibilityMode) {
  var _a19;
  const result = [];
  const startIndex = visibilityMode === HistoryVisibilityMode.EXTERNAL ? 2 : 0;
  for (let i = startIndex; i < messages2.length; i++) {
    const message = messages2[i];
    let role;
    if (i === 0 && visibilityMode === HistoryVisibilityMode.INTERNAL && message.type === ConversationMessage_MessageType.HUMAN) {
      role = "system";
    } else {
      switch (message.type) {
        case ConversationMessage_MessageType.HUMAN:
          role = "user";
          break;
        case ConversationMessage_MessageType.AI:
          role = "assistant";
          break;
        default:
          role = "unknown";
      }
    }
    const traceMessage = { role };
    if (message.text && message.text.trim().length > 0) {
      traceMessage.text = message.text;
    }
    if (((_a19 = message.thinking) === null || _a19 === void 0 ? void 0 : _a19.text) && message.thinking.text.trim().length > 0) {
      traceMessage.thinking = message.thinking.text;
    }
    if (message.type === ConversationMessage_MessageType.AI && message.toolResults.length > 0) {
      const toolCalls3 = [];
      for (const toolResult of message.toolResults) {
        const toolCall = {};
        if (toolResult.toolCallId) {
          toolCall.tool_call_id = toolResult.toolCallId;
        }
        if (toolResult.toolName) {
          toolCall.tool_name = toolResult.toolName;
        }
        const argsStr = toolResult.rawArgs || toolResult.args;
        if (argsStr) {
          toolCall.tool_args = tryParseJson(argsStr);
        }
        applyToolCallTimestamps(toolCall, toolResult);
        toolCalls3.push(toolCall);
      }
      if (toolCalls3.length > 0) {
        traceMessage.tool_calls = toolCalls3;
      }
    }
    result.push(traceMessage);
    if (message.type === ConversationMessage_MessageType.AI && message.toolResults.length > 0) {
      for (const toolResult of message.toolResults) {
        const toolMessage = { role: "tool" };
        if (toolResult.toolCallId) {
          toolMessage.tool_call_id = toolResult.toolCallId;
        }
        if (toolResult.toolName) {
          toolMessage.tool_name = toolResult.toolName;
        }
        const argsStr = toolResult.rawArgs || toolResult.args;
        if (argsStr) {
          toolMessage.tool_args = tryParseJson(argsStr);
        }
        const resultContent = extractToolResultContent(toolResult);
        if (resultContent !== void 0) {
          toolMessage.tool_result = resultContent;
        }
        applyToolCallTimestamps(toolMessage, toolResult);
        result.push(toolMessage);
      }
    }
  }
  return result;
}
