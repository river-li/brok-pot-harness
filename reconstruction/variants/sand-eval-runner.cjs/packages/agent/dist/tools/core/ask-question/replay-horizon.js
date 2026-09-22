/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/ask-question/replay-horizon.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function readAsyncOriginalToolCallId(args) {
  let parsedArgs;
  try {
    parsedArgs = JSON.parse(args.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
  } catch {
    return void 0;
  }
  if (typeof parsedArgs !== "object" || parsedArgs === null || Array.isArray(parsedArgs) || !("async_original_tool_call_id" in parsedArgs)) {
    return void 0;
  }
  const originalToolCallId = parsedArgs.async_original_tool_call_id;
  return typeof originalToolCallId === "string" && originalToolCallId.length > 0 ? originalToolCallId : void 0;
}
function isAskQuestionToolName(toolName) {
  const normalized = toolName.toLowerCase().replace(/_/g, "");
  return normalized === "askquestion" || normalized === "multiplechoice";
}
function collectLiveAskQuestionOriginalIds(messages) {
  const liveOriginalIds = /* @__PURE__ */ new Set();
  for (const message of messages) {
    if (message.role !== "assistant" || !Array.isArray(message.content)) {
      continue;
    }
    for (const part of message.content) {
      if (part.type !== "tool-call" || !isAskQuestionToolName(part.toolName)) {
        continue;
      }
      const originalToolCallId = readAsyncOriginalToolCallId(part.args) ?? part.toolCallId;
      if (originalToolCallId.length > 0) {
        liveOriginalIds.add(originalToolCallId);
      }
    }
  }
  return liveOriginalIds;
}

