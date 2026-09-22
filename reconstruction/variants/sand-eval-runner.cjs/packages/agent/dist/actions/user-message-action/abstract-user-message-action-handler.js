/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/user-message-action/abstract-user-message-action-handler.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto21 = require("node:crypto");
init_dist();

// @recovered-fragment 2/2
var __addDisposableResource37 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources37 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var logger65 = createLogger("@anysphere/agent");
var DEFAULT_CLI_REFLECT_GENERAL_REMINDER_INTERVAL = 10;
var DEFAULT_CLI_REFLECT_GENERAL_MAX_FOLLOW_UPS_PER_TURN = -1;
var DEFAULT_CLI_REFLECT_GENERAL_REMINDER_TEXT = "<system_reminder>You MUST now use the Reflect tool to reflect on your current progress</system_reminder>";
var IMAGE_SUMMARIZATION_TRIGGER_COUNT = 85;
var AGENT_RESPONSE_COMPARISON_TIMEOUT_MS = 6e4;
var MAX_RESPONSE_COMPARISON_WARMUPS_PER_TURN = 5;
function getSignificantOverageThreshold(maxTokens) {
  return Math.min(0.25 * maxTokens, 5e4);
}
function isSignificantlyOverTokenLimit({ usedTokens, maxTokens }) {
  return maxTokens > 0 && usedTokens > maxTokens + getSignificantOverageThreshold(maxTokens);
}
function alternateModelIdForAnalytics(selection) {
  return selection.alternate === "parent" ? "same_as_parent" : selection.alternate.modelId;
}
function countAssistantMessages(responseMessages) {
  return responseMessages.filter((message) => message.role === "assistant").length;
}
function extractAssistantText(message) {
  if (message.role !== "assistant") {
    return void 0;
  }
  if (typeof message.content === "string") {
    return message.content;
  }
  if (!Array.isArray(message.content)) {
    return "";
  }
  return message.content.map((part) => {
    if (typeof part === "object" && part !== null && "type" in part && part.type === "text" && "text" in part && typeof part.text === "string") {
      return part.text;
    }
    return "";
  }).join("");
}
function containsToolCall(responseMessages) {
  return responseMessages.some((message) => message.role === "tool" || message.role === "assistant" && Array.isArray(message.content) && message.content.some((part) => part.type === "tool-call"));
}
var FINAL_ASSISTANT_MESSAGE_UX_STAT_NAMES = [
  "character_count",
  "word_count",
  "line_count",
  "paragraph_count",
  "sentence_count",
  "heading_count",
  "list_item_count",
  "code_block_count",
  "inline_code_count",
  "link_count"
];
function countRegexMatches(text2, pattern) {
  const matcher = pattern.matcher(text2);
  let count = 0;
  while (matcher.find()) {
    count += 1;
  }
  return count;
}
function compileFinalAssistantMessageUxStatsPatterns() {
  return {
    word: RE2JS.compile("[\\p{L}\\p{N}]+(?:['-][\\p{L}\\p{N}]+)*"),
    sentenceTerminator: RE2JS.compile("[.!?](?:\\s|$)"),
    heading: RE2JS.compile("^\\s{0,3}#{1,6}\\s+\\S", RE2JS.MULTILINE),
    listItem: RE2JS.compile("^\\s*(?:[-*+]\\s+|\\d+[.)]\\s+)", RE2JS.MULTILINE),
    inlineCode: RE2JS.compile("`[^`\\n]+`"),
    markdownLink: RE2JS.compile("\\[[^\\]\\n]+\\]\\([^)]+\\)")
  };
}
function countWords2(text2, patterns) {
  return countRegexMatches(text2, patterns.word);
}
function countLines2(text2) {
  if (text2.length === 0) {
    return 0;
  }
  let lineCount = 1;
  for (let index = 0; index < text2.length; index += 1) {
    const char = text2[index];
    if (char === "\n") {
      lineCount += 1;
    } else if (char === "\r") {
      lineCount += 1;
      if (text2[index + 1] === "\n") {
        index += 1;
      }
    }
  }
  return lineCount;
}
function countParagraphs(text2) {
  const trimmedText = text2.trim();
  if (trimmedText.length === 0) {
    return 0;
  }
  let paragraphCount = 1;
  let newlineCountInWhitespaceRun = 0;
  let countedCurrentWhitespaceRun = false;
  for (let index = 0; index < trimmedText.length; index += 1) {
    const char = trimmedText[index];
    const isNewline = char === "\n" || char === "\r";
    if (isNewline) {
      newlineCountInWhitespaceRun += 1;
      if (newlineCountInWhitespaceRun >= 2 && !countedCurrentWhitespaceRun) {
        paragraphCount += 1;
        countedCurrentWhitespaceRun = true;
      }
      if (char === "\r" && trimmedText[index + 1] === "\n") {
        index += 1;
      }
      continue;
    }
    if (!isWhitespace(char)) {
      newlineCountInWhitespaceRun = 0;
      countedCurrentWhitespaceRun = false;
    }
  }
  return paragraphCount;
}
function countSentences(text2, patterns) {
  const trimmedText = text2.trim();
  if (trimmedText.length === 0) {
    return 0;
  }
  const terminalPunctuationCount = countRegexMatches(trimmedText, patterns.sentenceTerminator);
  return terminalPunctuationCount === 0 ? 1 : terminalPunctuationCount;
}
function isWhitespace(char) {
  return char.trim().length === 0;
}
function getFenceMarker(line) {
  const trimmedStart = line.trimStart();
  if (trimmedStart.startsWith("```")) {
    return "```";
  }
  if (trimmedStart.startsWith("~~~")) {
    return "~~~";
  }
  return void 0;
}
function getNextLineWithEnding(text2, startIndex) {
  let lineEndIndex = startIndex;
  while (lineEndIndex < text2.length && text2[lineEndIndex] !== "\n" && text2[lineEndIndex] !== "\r") {
    lineEndIndex += 1;
  }
  let nextIndex = lineEndIndex;
  if (nextIndex < text2.length) {
    if (text2[nextIndex] === "\r" && text2[nextIndex + 1] === "\n") {
      nextIndex += 2;
    } else {
      nextIndex += 1;
    }
  }
  return {
    line: text2.slice(startIndex, lineEndIndex),
    lineWithEnding: text2.slice(startIndex, nextIndex),
    nextIndex
  };
}
function extractFencedCodeBlockStats(text2) {
  let count = 0;
  let textWithoutFencedCodeBlocks = "";
  let pendingFenceMarker;
  let pendingFenceText = "";
  for (let index = 0; index < text2.length; ) {
    const { line, lineWithEnding, nextIndex } = getNextLineWithEnding(text2, index);
    index = nextIndex;
    const marker17 = getFenceMarker(line);
    if (pendingFenceMarker === void 0) {
      if (marker17 === void 0) {
        textWithoutFencedCodeBlocks += lineWithEnding;
      } else {
        pendingFenceMarker = marker17;
        pendingFenceText = lineWithEnding;
      }
      continue;
    }
    pendingFenceText += lineWithEnding;
    if (marker17 === pendingFenceMarker) {
      count += 1;
      textWithoutFencedCodeBlocks += "\n";
      pendingFenceMarker = void 0;
      pendingFenceText = "";
    }
  }
  if (pendingFenceMarker !== void 0) {
    textWithoutFencedCodeBlocks += pendingFenceText;
  }
  return { count, textWithoutFencedCodeBlocks };
}
function analyzeAssistantMessageUxStats(text2) {
  const patterns = compileFinalAssistantMessageUxStatsPatterns();
  const { count: codeBlockCount, textWithoutFencedCodeBlocks } = extractFencedCodeBlockStats(text2);
  return {
    character_count: text2.length,
    word_count: countWords2(text2, patterns),
    line_count: countLines2(text2),
    paragraph_count: countParagraphs(text2),
    sentence_count: countSentences(text2, patterns),
    heading_count: countRegexMatches(textWithoutFencedCodeBlocks, patterns.heading),
    list_item_count: countRegexMatches(textWithoutFencedCodeBlocks, patterns.listItem),
    code_block_count: codeBlockCount,
    inline_code_count: countRegexMatches(textWithoutFencedCodeBlocks, patterns.inlineCode),
    link_count: countRegexMatches(textWithoutFencedCodeBlocks, patterns.markdownLink)
  };
}
function getFinalAssistantMessageUxStats(responseMessages) {
  const finalMessage = responseMessages.at(-1);
  if (finalMessage === void 0) {
    return void 0;
  }
  const assistantText = extractAssistantText(finalMessage);
  if (assistantText === void 0) {
    return void 0;
  }
  return analyzeAssistantMessageUxStats(assistantText);
}
function getFinalAssistantMessageCharacterCount(responseMessages) {
  const finalMessage = responseMessages.at(-1);
  if (finalMessage === void 0) {
    return void 0;
  }
  return extractAssistantText(finalMessage)?.length;
}
function hasReflectGeneralToolCall(responseMessages, toolCallIdentityResolver) {
  for (const message of responseMessages) {
    if (!Array.isArray(message.content)) {
      continue;
    }
    for (const part of message.content) {
      if ((part.type === "tool-call" || part.type === "tool-result") && part.toolName === "Reflect") {
        return true;
      }
      if (part.type === "tool-call" && toolCallIdentityResolver.resolveToolCallIdentity({
        toolName: part.toolName,
        args: part.args
      })?.toolIdentifier === "REFLECT_GENERAL") {
        return true;
      }
    }
  }
  return false;
}
function trailingToolBatchHasFailure(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "tool") {
      break;
    }
    const highLevelResult = message.providerOptions?.cursor?.highLevelToolCallResult;
    if (highLevelResult?.isError !== false) {
      return true;
    }
  }
  return false;
}
function isTrailingTaskToolCallMessage(messages, taskToolName, toolCallIdentityResolver) {
  if (taskToolName === void 0) {
    return false;
  }
  const lastMessage = messages.at(-1);
  if (lastMessage?.role !== "assistant" || !Array.isArray(lastMessage.content)) {
    return false;
  }
  for (const part of lastMessage.content) {
    if (part?.type !== "tool-call") {
      continue;
    }
    if (part.toolName === taskToolName) {
      return true;
    }
    if (toolCallIdentityResolver?.resolveToolCallIdentity({
      toolName: part.toolName,
      args: part.args
    })?.toolIdentifier === "TASK") {
      return true;
    }
  }
  return false;
}
function createSplitStepStateHandler(stateHandler, turn) {
  const stateOps = [];
  const splitStateHandler = new Proxy(stateHandler, {
    get(target, property, receiver) {
      if (property === "setActiveBranchName") {
        return (branchName) => {
          stateOps.push({
            type: "setActiveBranchName",
            branchName
          });
          return target.setActiveBranchName(branchName);
        };
      }
      if (property === "persistSubagentState") {
        return (ctx, subagentId, subagentType, state) => {
          stateOps.push({
            type: "persistSubagentState",
            subagentId,
            subagentType,
            state
          });
          return target.persistSubagentState(ctx, subagentId, subagentType, state);
        };
      }
      if (property === "setPlan") {
        return (plan) => {
          stateOps.push({
            type: "setPlan",
            plan: plan === void 0 ? void 0 : fromRedactedConversationPlan(plan, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)
          });
          return target.setPlan(plan);
        };
      }
      if (property === "setMode") {
        return (mode) => {
          stateOps.push({
            type: "setMode",
            mode
          });
          return target.setMode(mode);
        };
      }
      if (property === "setTodos") {
        return (todos) => {
          stateOps.push({
            type: "setTodos",
            todos: todos.map((todo) => fromRedactedTodoItem(todo, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED))
          });
          return target.setTodos(todos);
        };
      }
      if (property === "upsertPlanEntry") {
        return (entry) => {
          stateOps.push({
            type: "upsertPlanEntry",
            entry
          });
          return target.upsertPlanEntry(entry);
        };
      }
      if (property === "setGoalState") {
        return (goalState) => {
          stateOps.push({
            type: "setGoalState",
            goalState
          });
          return target.setGoalState(goalState);
        };
      }
      if (property === "appendCommunicateUpdateHistoryEntry") {
        return (entry) => {
          stateOps.push({
            type: "appendCommunicateUpdateHistoryEntry",
            entry
          });
          return target.appendCommunicateUpdateHistoryEntry(entry);
        };
      }
      if (property === "recordReadPath") {
        return (path30) => {
          stateOps.push({
            type: "recordReadPath",
            path: path30.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)
          });
          return target.recordReadPath(path30);
        };
      }
      if (property === "markAskQuestionCompleted") {
        return (originalToolCallId) => {
          stateOps.push({
            type: "markAskQuestionCompleted",
            originalToolCallId
          });
          return target.markAskQuestionCompleted(originalToolCallId);
        };
      }
      const value = Reflect.get(target, property, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    }
  });
  const splitToolCallRecorder = {
    recordToolCall(toolCall, toolCallId) {
      stateOps.push({
        type: "recordToolCall",
        toolCall: fromRedactedToolCall(toolCall, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
        toolCallId
      });
    },
    async recordPendingToolCall(ctx, toolCall, toolCallId) {
      await turn.upsertToolCall(ctx, toolCall, toolCallId);
    },
    async upsertToolCall(_ctx, toolCall, toolCallId) {
      stateOps.push({
        type: "recordToolCall",
        toolCall: fromRedactedToolCall(toolCall, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
        toolCallId
      });
    }
  };
  return {
    stateHandler: splitStateHandler,
    toolCallRecorder: splitToolCallRecorder,
    stateOps
  };
}
async function applyConversationStateOp(ctx, stateHandler, toolCallRecorder, stateOp) {
  switch (stateOp.type) {
    case "setActiveBranchName":
      stateHandler.setActiveBranchName(stateOp.branchName);
      break;
    case "persistSubagentState":
      stateHandler.persistSubagentState(ctx, stateOp.subagentId, stateOp.subagentType, stateOp.state);
      break;
    case "setPlan":
      stateHandler.setPlan(stateOp.plan === void 0 ? void 0 : toRedactedConversationPlan(stateOp.plan, stateHandler.getPrivacyMode()));
      break;
    case "setMode":
      stateHandler.setMode(stateOp.mode);
      break;
    case "setTodos":
      stateHandler.setTodos(stateOp.todos.map((todo) => toRedactedTodoItem(todo, stateHandler.getPrivacyMode())));
      break;
    case "upsertPlanEntry":
      stateHandler.upsertPlanEntry(stateOp.entry);
      break;
    case "setGoalState":
      stateHandler.setGoalState(stateOp.goalState);
      break;
    case "appendCommunicateUpdateHistoryEntry":
      stateHandler.appendCommunicateUpdateHistoryEntry(stateOp.entry);
      break;
    case "recordToolCall":
      if ((stateOp.toolCall.tool.case === "askQuestionToolCall" || stateOp.toolCall.tool.case === "mcpAuthToolCall") && stateOp.toolCallId !== void 0 && toolCallRecorder.upsertToolCall !== void 0) {
        await toolCallRecorder.upsertToolCall(ctx, toRedactedToolCall(stateOp.toolCall, stateHandler.getPrivacyMode()), stateOp.toolCallId);
      } else {
        toolCallRecorder.recordToolCall(toRedactedToolCall(stateOp.toolCall, stateHandler.getPrivacyMode()), stateOp.toolCallId);
      }
      break;
    case "recordReadPath":
      stateHandler.recordReadPath(safeString(stateOp.path));
      break;
    case "markAskQuestionCompleted":
      if (typeof stateHandler.markAskQuestionCompleted === "function") {
        stateHandler.markAskQuestionCompleted(stateOp.originalToolCallId);
      }
      break;
    default: {
      const exhaustiveCheck = stateOp;
      throw new Error(`Unhandled conversation state op: ${exhaustiveCheck}`);
    }
  }
}
var agentStepCount = createCounter("agent.step.count", {
  description: "The number of steps taken by the agent"
});
var agentStoreConflictBarrier = createCounter("agent.store.conflict_barrier", {
  description: "Local-sync conflict turn-end barrier outcomes",
  labelNames: ["outcome", "timed_out"]
});
var steerIdleSamplePreempted = createCounter("agent.context_injection.idle_sample_preempted", {
  description: "Model samples abandoned for a pending steer before any tool call or visible text",
  labelNames: ["phase"]
});
var steerIdleSamplePreemptedAfterMs = createHistogram("agent.context_injection.idle_sample_preempted_after_ms", {
  description: "Sample age (ms since the model request was sent) when a steer preempted it"
});
var firstStepSetupDuration = createHistogram("agent.ttft.firstStepSetupMs", {
  description: "Time from runStep entry to executeToolStream call (tool generation, message preparation) on the first step only"
});
var agentTurnDuration = createHistogram("agent.turn.duration_ms", {
  description: "Duration of agent turn execution in milliseconds"
});
var agentTurnResult = createCounter("agent.turn.result", {
  description: "Result status of agent turn execution",
  labelNames: [
    "outcome",
    "newConversation",
    "isauto",
    "ispremium",
    "isanysphereteam",
    "isuserapikey",
    "issubagent",
    "autoroutingreason"
  ]
});
var agentToolCallsPerTurn = createHistogram("agent.turn.tool_calls", {
  description: "Total number of tool calls executed in a turn",
  labelNames: ["outcome", "clientversion", "clienttype", "sdkflavor", "user.is_dev"]
});
var finalAssistantMessageCharacters = createHistogram("agent.turn.final_assistant_message_chars", {
  description: "Character count of the final assistant message when a turn completes"
});
var finalAssistantMessageUxStatsMetric = createHistogram("agent.turn.final_assistant_message_ux_stats", {
  description: "UX stats for the final assistant message when a turn completes",
  labelNames: ["stat"]
});
var unifiedHandlerNumberOfToolCalls = createHistogram("agent.unified_handler_number_of_tool_calls", {
  description: "Number of tool calls in unified handler",
  labelNames: [
    "model",
    "hasFailedToolCalls",
    "hasUnexpectedToolCallErrors",
    "success",
    "errorName"
  ]
});
var unfinishedTodosMetric = createCounter("agent.turn.unfinished_todos", {
  description: "Number of unfinished todos at the end of a turn"
});
var emptyResponseRetryClassification = createCounter("nal.empty_response.retry_classification", {
  description: "Retry classification for empty model responses",
  labelNames: ["retryAction", "didRetry"]
});
var loopRetryOutcome = createCounter("nal.loop.retry_outcome", {
  description: "Outcome of the NAL single-message loop in-step retry (observe only)",
  labelNames: ["outcome", "loop_kind"]
});
function incrementLoopRetryOutcome(ctx, outcome, loopKind) {
  loopRetryOutcome.increment(ctx, 1, {
    outcome,
    loop_kind: loopKind ?? "unknown"
  });
}
var EMPTY_RESPONSE_CONTINUATION_MESSAGE = "<system_reminder>Please continue. Respond to the user or make tool calls.</system_reminder>";
var EmptyResponseRetryError = class extends Error {
  constructor(retryAction, needsContinuationMessage2) {
    super(`Empty model response, retry action: ${retryAction}`);
    this.name = "EmptyResponseRetryError";
    this.retryAction = retryAction;
    this.needsContinuationMessage = needsContinuationMessage2;
  }
};
var StepRetriesExhaustedError = class extends Error {
  constructor(reason, options2) {
    super("Failed to run step, exceeded max retries", options2);
    this.reason = reason;
    this.isStepRetriesExhausted = true;
    this.name = "StepRetriesExhaustedError";
  }
};
var MAX_RETRY_ITERATIONS = 5;
var MAX_EMPTY_RESPONSE_RETRIES_PER_TURN = 3;
function hasEmptyAssistantText(messages) {
  for (const msg of messages) {
    if (msg.role !== "assistant")
      continue;
    if (typeof msg.content === "string") {
      if (msg.content.trim().length > 0)
        return false;
    } else {
      for (const part of msg.content) {
        if (part.type === "text" && (part.text?.trim().length ?? 0) > 0) {
          return false;
        }
      }
    }
  }
  return true;
}
function countImagePartsInMessages(messages) {
  const countImagesInValue = (value) => {
    if (Array.isArray(value)) {
      let total2 = 0;
      for (const item of value) {
        total2 += countImagesInValue(item);
      }
      return total2;
    }
    if (typeof value !== "object" || value === null) {
      return 0;
    }
    let total = 0;
    if ("type" in value && typeof value.type === "string" && (value.type === "image" || value.type === "image_url" || value.type === "input_image")) {
      total += 1;
    }
    if ("content" in value) {
      total += countImagesInValue(value.content);
    }
    if ("experimental_content" in value) {
      total += countImagesInValue(value.experimental_content);
    }
    return total;
  };
  let imageCount = 0;
  for (const msg of messages) {
    imageCount += countImagesInValue(msg.content);
  }
  return imageCount;
}
var toolCallArgsOutputTokens = createHistogram("tool_call.args.output_tokens", {
  description: "Output tokens for tool call arguments",
  labelNames: ["toolCallName"]
});
var toolCallArgsCacheWriteTokens = createHistogram("tool_call.args.cache_write_tokens", {
  description: "Cache write tokens for tool call arguments",
  labelNames: ["toolCallName"]
});
var toolCallResultInputTokens = createHistogram("tool_call.result.input_tokens", {
  description: "Input tokens for tool call result",
  labelNames: ["toolCallName"]
});
var toolCallResultCachedReadTokens = createHistogram("tool_call.result.cached_read_tokens", {
  description: "Cached read tokens for tool call result",
  labelNames: ["toolCallName"]
});
var numberOfParallelToolCalls = createHistogram("agent.unified_handler.model_invocation.number_of_parallel_tool_calls", {
  description: "Number of parallel tool calls in a model invocation",
  labelNames: [
    "hasFailedToolCalls",
    "hasUnexpectedToolCallErrors",
    "success",
    "errorName"
  ]
});
var numberOfParallelToolCallsWithAtLeastOneCall = createHistogram("agent.unified_handler.model_invocation.number_of_parallel_tool_calls_with_at_least_one_call", {
  description: "Number of parallel tool calls in a model invocation when there is at least one call",
  labelNames: [
    "hasFailedToolCalls",
    "hasUnexpectedToolCallErrors",
    "success",
    "errorName",
    "clientversion",
    "clienttype",
    "user.is_dev"
  ]
});
var AbstractUserMessageActionHandler = class {
  constructor(config2, resourceAccessor, interactionListener, summarizationHandler, conversationActionReceiver, orchestrator) {
    this.config = config2;
    this.resourceAccessor = resourceAccessor;
    this.interactionListener = interactionListener;
    this.summarizationHandler = summarizationHandler;
    this.conversationActionReceiver = conversationActionReceiver;
    this.orchestrator = orchestrator;
    this.cachedAutomationTriggerContext = null;
    this.responseComparisonSequence = 0;
    this.responseComparisonPendingUiAttempted = false;
    this.responseComparisonModelStepStarted = false;
    this.responseComparisonWarmupsInTurn = 0;
  }
  resolveWriteBarrierTimeoutMs() {
    return resolveWriteBarrierTimeoutMs(this.config);
  }
  getAutomationTriggerContext(messages) {
    if (this.config.automationInstructions === void 0) {
      return void 0;
    }
    if (this.cachedAutomationTriggerContext !== null) {
      return this.cachedAutomationTriggerContext;
    }
    const result = extractAutomationTriggerContext(messages);
    this.cachedAutomationTriggerContext = result;
    return result;
  }
  getUserPermissionsFileAutoRunInstructions(ctx, requestContext) {
    return getUserPermissionsFileAutoRunInstructions(ctx, this.config, requestContext);
  }
  getProjectPermissionsFileAutoRunInstructions(requestContext) {
    return getProjectPermissionsFileAutoRunInstructions(requestContext);
  }
  /**
   * Wraps a model stream so the first text delta of a step triggers a
   * prefix-cache warmup for the pending response comparison alternate. Text
   * (rather than a tool call) opening the step is the cheapest signal that
   * the model is likely writing its final answer, which is the only step the
   * comparison replays — warming here overlaps the alternate's prompt
   * processing with the parent's decode. Narration before a tool call wastes
   * at most one warm, and provider prefix caching makes the next step's warm
   * incremental.
   */
  tapAgentResponseComparisonWarmup(ctx, fullStream, messages, tools) {
    const capability = this.config.agentResponseComparison;
    if (capability?.warm === void 0 || messages === void 0 || tools === void 0 || this.pendingResponseComparison === void 0) {
      return fullStream;
    }
    const maybeWarm = () => this.maybeWarmAgentResponseComparison(ctx, capability, messages, tools);
    return (async function* () {
      let warmTriggered = false;
      for await (const part of fullStream) {
        if (!warmTriggered && part.type === "text-delta") {
          warmTriggered = true;
          maybeWarm();
        }
        yield part;
      }
    })();
  }
  maybeWarmAgentResponseComparison(ctx, capability, messages, tools) {
    const pending = this.pendingResponseComparison;
    if (pending === void 0 || capability.warm === void 0 || this.responseComparisonWarmupsInTurn >= MAX_RESPONSE_COMPARISON_WARMUPS_PER_TURN) {
      return;
    }
    this.responseComparisonWarmupsInTurn += 1;
    void capability.warm({
      ctx,
      selection: pending.preparedAttempt.selection,
      messages,
      tools
    }).catch((error3) => {
      logger65.warn(ctx, "Agent response comparison warmup failed open", {
        error: error3
      });
    });
  }
  async preparePendingAgentResponseComparison(args) {
    const capability = this.config.agentResponseComparison;
    if (this.responseComparisonPendingUiAttempted || capability?.supportsPendingUi !== true || capability.preselect === void 0 || this.interactionListener.enqueuePostTurnEndedWork === void 0 || args.privacyMode !== PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED) {
      return;
    }
    this.responseComparisonPendingUiAttempted = true;
    let preparedAttempt;
    try {
      preparedAttempt = await capability.preselect({
        isByok: getIsUserApiKeyFromContext(args.ctx),
        isSubagent: getIsSubagentFromContext(args.ctx)
      });
    } catch (error3) {
      logger65.warn(args.ctx, "Agent response comparison preselection failed open", { error: error3 });
      return;
    }
    if (preparedAttempt === void 0) {
      return;
    }
    const pending = {
      kind: "awaiting-parent",
      ...args,
      preparedAttempt,
      comparisonId: (0, import_node_crypto21.randomUUID)(),
      alternateInvocationId: getInvocationId(args.ctx)
    };
    this.pendingResponseComparison = pending;
    try {
      await this.sendAgentResponseComparisonEvent({
        ctx: args.ctx,
        privacyMode: args.privacyMode,
        comparisonId: pending.comparisonId,
        event: {
          case: "started",
          value: new ResponseComparisonStarted({
            displayOrder: preparedAttempt.selection.displayOrder === "parent-first" ? ResponseComparisonDisplayOrder.PARENT_FIRST : ResponseComparisonDisplayOrder.ALTERNATE_FIRST,
            parentInvocationId: args.parentInvocationId,
            alternateInvocationId: pending.alternateInvocationId,
            parentResponse: "",
            comparisonConfigId: preparedAttempt.selection.comparisonConfigId,
            alternateModelId: alternateModelIdForAnalytics(preparedAttempt.selection)
          })
        }
      });
    } catch (error3) {
      this.pendingResponseComparison = void 0;
      logger65.warn(args.ctx, "Agent response comparison pending update failed open", { error: error3 });
    }
  }
  async finalizePendingAgentResponseComparison(shouldCompare) {
    const pending = this.pendingResponseComparison;
    if (pending === void 0) {
      return;
    }
    if (!shouldCompare || pending.kind !== "parent-ready") {
      await this.cancelPendingAgentResponseComparison();
      return;
    }
    this.pendingResponseComparison = void 0;
    this.interactionListener.enqueuePostTurnEndedWork?.(() => this.runAgentResponseComparison({
      ctx: pending.ctx,
      parentInvocationId: pending.parentInvocationId,
      parentResponse: pending.parentResponse,
      messages: pending.messages,
      tools: pending.tools,
      privacyMode: pending.privacyMode,
      selection: pending.preparedAttempt.selection,
      preparedAttempt: pending.preparedAttempt,
      pendingUi: true,
      comparisonId: pending.comparisonId,
      alternateInvocationId: pending.alternateInvocationId
    }));
  }
  async cancelPendingAgentResponseComparison(reason = ResponseComparisonSkipReason.CANCELLED) {
    const pending = this.pendingResponseComparison;
    if (pending === void 0) {
      return;
    }
    this.pendingResponseComparison = void 0;
    try {
      await this.sendAgentResponseComparisonEvent({
        ctx: pending.ctx,
        privacyMode: pending.privacyMode,
        comparisonId: pending.comparisonId,
        event: {
          case: "skipped",
          value: new ResponseComparisonSkipped({ reason })
        }
      });
    } catch (error3) {
      logger65.warn(pending.ctx, "Agent response comparison skip update failed open", { error: error3 });
    }
  }
  async checkpointToolResultsCompletedBeforeDeferral({ ctx, stateHandler, pendingToolCalls, completedToolResults, onStateUpdate }) {
    if (completedToolResults.length === 0 || onStateUpdate === void 0) {
      return;
    }
    try {
      const current = await stateHandler.computeNewStructure(ctx);
      current.pendingToolCalls = [
        ...pendingToolCalls,
        ...completedToolResults.map((message) => JSON.stringify(message))
      ].map((p2) => createRedactedString(p2, DataClassification.CODE, "pendingToolCalls", PrivacyMode.UNSPECIFIED));
      await onStateUpdate(ctx, current);
    } catch (error3) {
      logger65.error(ctx, "Failed to checkpoint tool results completed before the deferred interaction", { error: error3 });
    }
  }
  async enqueueAgentResponseComparisonIfEligible(args) {
    const capability = this.config.agentResponseComparison;
    if (capability === void 0 || this.interactionListener.enqueuePostTurnEndedWork === void 0) {
      return;
    }
    if (capability.supportsPendingUi && this.responseComparisonPendingUiAttempted) {
      const pending = this.pendingResponseComparison;
      if (pending === void 0) {
        return;
      }
      if (args.privacyMode !== PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED || containsToolCall(args.responseMessages)) {
        await this.cancelPendingAgentResponseComparison();
        return;
      }
      let finalAssistantMessage2;
      for (let index = args.responseMessages.length - 1; index >= 0; index--) {
        const message = args.responseMessages[index];
        if (message?.role === "assistant") {
          finalAssistantMessage2 = message;
          break;
        }
      }
      const responseText2 = finalAssistantMessage2 === void 0 ? void 0 : extractAssistantText(finalAssistantMessage2);
      if (responseText2 === void 0 || !pending.preparedAttempt.isParentLengthEligible(responseText2)) {
        await this.cancelPendingAgentResponseComparison();
        return;
      }
      this.pendingResponseComparison = {
        ...pending,
        kind: "parent-ready",
        parentInvocationId: args.parentInvocationId,
        parentResponse: responseText2,
        // The final step's captured prompt, which includes any tool calls and
        // results from earlier steps; the alternate replays this so it
        // answers with the same evidence as the parent.
        messages: args.messages,
        tools: args.tools
      };
      return;
    }
    if (args.privacyMode !== PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED) {
      this.responseComparisonCandidate = void 0;
      return;
    }
    if (containsToolCall(args.responseMessages)) {
      this.responseComparisonCandidate = void 0;
      return;
    }
    let finalAssistantMessage;
    for (let index = args.responseMessages.length - 1; index >= 0; index--) {
      const message = args.responseMessages[index];
      if (message?.role === "assistant") {
        finalAssistantMessage = message;
        break;
      }
    }
    const responseText = finalAssistantMessage === void 0 ? void 0 : extractAssistantText(finalAssistantMessage);
    if (responseText === void 0 || responseText.length === 0) {
      this.responseComparisonCandidate = void 0;
      return;
    }
    const sequence = ++this.responseComparisonSequence;
    this.responseComparisonCandidate = {
      ctx: args.ctx,
      parentInvocationId: args.parentInvocationId,
      responseText,
      messages: args.messages,
      tools: args.tools,
      privacyMode: args.privacyMode,
      sequence
    };
    this.interactionListener.enqueuePostTurnEndedWork(() => this.runPendingAgentResponseComparison(capability, sequence));
  }
  async runPendingAgentResponseComparison(capability, sequence) {
    const candidate = this.responseComparisonCandidate;
    if (candidate === void 0 || candidate.sequence !== sequence) {
      return;
    }
    this.responseComparisonCandidate = void 0;
    if (candidate.privacyMode !== PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED) {
      return;
    }
    let preparedAttempt;
    try {
      preparedAttempt = await capability.resolve({
        responseText: candidate.responseText,
        isByok: getIsUserApiKeyFromContext(candidate.ctx),
        isSubagent: getIsSubagentFromContext(candidate.ctx)
      });
    } catch (error3) {
      logger65.warn(candidate.ctx, "Agent response comparison selection failed open", { error: error3 });
      return;
    }
    if (preparedAttempt === void 0) {
      return;
    }
    await this.runAgentResponseComparison({
      ctx: candidate.ctx,
      parentInvocationId: candidate.parentInvocationId,
      parentResponse: candidate.responseText,
      messages: candidate.messages,
      tools: candidate.tools,
      privacyMode: candidate.privacyMode,
      selection: preparedAttempt.selection,
      preparedAttempt,
      pendingUi: false
    });
  }
  async runAgentResponseComparison(args) {
    const capability = this.config.agentResponseComparison;
    if (capability === void 0) {
      return;
    }
    if (args.privacyMode !== PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED) {
      return;
    }
    const comparisonId = args.comparisonId ?? (0, import_node_crypto21.randomUUID)();
    const alternateInvocationId = args.alternateInvocationId ?? getInvocationId(args.ctx);
    const comparisonCtx = args.ctx.withTimeout(AGENT_RESPONSE_COMPARISON_TIMEOUT_MS);
    const sendEvent = async (event, eventCtx = comparisonCtx) => {
      await this.sendAgentResponseComparisonEvent({
        ctx: eventCtx,
        privacyMode: args.privacyMode,
        comparisonId,
        event
      });
    };
    let result;
    try {
      let selection = args.selection;
      if (capability.refineSelection !== void 0) {
        try {
          const refined = await capability.refineSelection({
            ctx: comparisonCtx,
            parentResponse: args.parentResponse,
            messages: args.messages,
            selection
          });
          if (refined === void 0) {
            await sendEvent({
              case: "skipped",
              value: new ResponseComparisonSkipped({
                reason: ResponseComparisonSkipReason.CANCELLED
              })
            });
            return;
          }
          selection = refined;
        } catch (error3) {
          logger65.warn(args.ctx, "Agent response comparison selection refinement failed open", {
            error: error3
          });
        }
      }
      if (!args.pendingUi) {
        await sendEvent({
          case: "started",
          value: new ResponseComparisonStarted({
            displayOrder: selection.displayOrder === "parent-first" ? ResponseComparisonDisplayOrder.PARENT_FIRST : ResponseComparisonDisplayOrder.ALTERNATE_FIRST,
            parentInvocationId: args.parentInvocationId,
            alternateInvocationId,
            parentResponse: args.parentResponse,
            comparisonConfigId: selection.comparisonConfigId,
            alternateModelId: alternateModelIdForAnalytics(selection)
          })
        });
      }
      result = capability.execute({
        ctx: comparisonCtx,
        selection,
        messages: args.messages,
        tools: args.tools,
        invocationId: alternateInvocationId
      });
      let sawToolCall = false;
      let exceededMaxResponseChars = false;
      let bufferedTextLength = 0;
      const bufferedTextDeltas = [];
      for await (const part of result.fullStream) {
        if (part.type === "tool-call-streaming-start" || part.type === "tool-call-delta" || part.type === "tool-call") {
          sawToolCall = true;
          continue;
        }
        if (!sawToolCall && !exceededMaxResponseChars && part.type === "text-delta") {
          bufferedTextLength += part.textDelta.length;
          if (bufferedTextLength > args.preparedAttempt.maxResponseChars) {
            exceededMaxResponseChars = true;
            bufferedTextDeltas.length = 0;
            continue;
          }
          bufferedTextDeltas.push(part.textDelta);
        }
      }
      const response = await result.response;
      if (sawToolCall || containsToolCall(response.messages)) {
        await sendEvent({
          case: "skipped",
          value: new ResponseComparisonSkipped({
            reason: ResponseComparisonSkipReason.ALTERNATE_TOOL_CALL
          })
        });
        return;
      }
      if (response.error !== void 0) {
        throw response.error;
      }
      if (exceededMaxResponseChars) {
        await sendEvent({
          case: "skipped",
          value: new ResponseComparisonSkipped({
            reason: ResponseComparisonSkipReason.CANCELLED
          })
        });
        return;
      }
      const alternateResponse = bufferedTextDeltas.join("");
      if (alternateResponse.trim().length === 0) {
        throw new Error("Alternate response completed without text");
      }
      if (!args.preparedAttempt.hasSufficientCharacterDiff(args.parentResponse, alternateResponse)) {
        await sendEvent({
          case: "skipped",
          value: new ResponseComparisonSkipped({
            reason: ResponseComparisonSkipReason.CANCELLED
          })
        });
        return;
      }
      if (!args.pendingUi && !await args.preparedAttempt.commitCooldown()) {
        await sendEvent({
          case: "skipped",
          value: new ResponseComparisonSkipped({
            reason: ResponseComparisonSkipReason.CANCELLED
          })
        });
        return;
      }
      if (args.pendingUi) {
        await sendEvent({
          case: "started",
          value: new ResponseComparisonStarted({
            displayOrder: selection.displayOrder === "parent-first" ? ResponseComparisonDisplayOrder.PARENT_FIRST : ResponseComparisonDisplayOrder.ALTERNATE_FIRST,
            parentInvocationId: args.parentInvocationId,
            alternateInvocationId,
            parentResponse: args.parentResponse,
            comparisonConfigId: selection.comparisonConfigId,
            alternateModelId: alternateModelIdForAnalytics(selection)
          })
        });
      }
      await sendEvent({
        case: "textDelta",
        value: new ResponseComparisonTextDelta({ text: alternateResponse })
      });
      if (args.pendingUi) {
        if (!await args.preparedAttempt.commitCooldown()) {
          await sendEvent({
            case: "skipped",
            value: new ResponseComparisonSkipped({
              reason: ResponseComparisonSkipReason.CANCELLED
            })
          });
          return;
        }
      }
      await sendEvent({
        case: "completed",
        value: new ResponseComparisonCompleted()
      });
    } catch (error3) {
      const reason = args.ctx.signal.aborted ? ResponseComparisonSkipReason.CANCELLED : comparisonCtx.signal.aborted ? ResponseComparisonSkipReason.TIMEOUT : ResponseComparisonSkipReason.INFERENCE_ERROR;
      try {
        await sendEvent({
          case: "skipped",
          value: new ResponseComparisonSkipped({ reason })
        }, args.ctx);
      } catch (sendError) {
        logger65.warn(args.ctx, "Agent response comparison failed open", {
          error: error3,
          sendError
        });
      }
    } finally {
      if (result !== void 0) {
        void Promise.allSettled([
          result.response,
          result.usage,
          result.extendedUsage,
          result.providerMetadata,
          result.invocationId
        ]);
      }
    }
  }
  async sendAgentResponseComparisonEvent(args) {
    await this.interactionListener.sendUpdate(args.ctx, toRedactedInteractionUpdate(new InteractionUpdate({
      message: {
        case: "responseComparison",
        value: new ResponseComparisonUpdate({
          comparisonId: args.comparisonId,
          event: args.event
        })
      }
    }), args.privacyMode));
  }
  createAfterAgentThoughtCallback(invocationId, requestContext) {
    return async (hookCtx, params) => {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource37(env_1, createSpan(hookCtx.withName("agent.lifecycleHook.afterAgentThought")), false);
        await executeRemoteAfterAgentThoughtHook({
          ctx: span.ctx,
          text: params.text,
          durationMs: params.durationMs,
          requestContext: {
            toolCallId: `after-agent-thought:${this.config.conversationId ?? invocationId}:${invocationId}:v1`,
            conversationId: this.config.conversationId,
            generationId: invocationId,
            model: this.config.modelId,
            modelId: this.config.model?.mcid,
            modelParams: this.config.model?.parameters !== void 0 ? [...this.config.model.parameters] : void 0
          },
          options: {
            resourceAccessor: this.resourceAccessor,
            enableExecuteHookExec: this.config.enableExecuteHookExec,
            configuredSteps: requestContext.hooksConfig?.configuredSteps,
            model: this.config.modelId,
            modelId: this.config.model?.mcid,
            modelParams: this.config.model?.parameters !== void 0 ? [...this.config.model.parameters] : void 0
          }
        });
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources37(env_1);
      }
    };
  }
  async maybeRetryProjectCoordinatorWithoutSendMessage(args) {
    if (args.hasToolCall || !args.hasSendMessageCapability || this.config.featureFlags?.sandSendMessageDeliveryOwed === false || args.isSimulatedUserMessage || args.turn.hasSendMessageCall() || args.visibilityReminderAlreadyInjected) {
      return;
    }
    const alreadyRetried = args.maxOutputTokenRetryDebug?.didRetryAfterEmptyResponse === true;
    const isLastRetryLoopIteration = (args.maxOutputTokenRetryDebug?.retryLoopIteration ?? 0) >= MAX_RETRY_ITERATIONS - 1;
    const shouldRetry = this.config.featureFlags?.enableEmptyResponseRetry === true && args.mode !== AgentMode.MULTITASK && !alreadyRetried && !isLastRetryLoopIteration;
    const retryInfo = {
      alreadyRetried,
      isLastRetryLoopIteration,
      shouldRetry
    };
    logger65.warn(args.ctx, "nal.project_send_message_missing", retryInfo);
    emptyResponseRetryClassification.increment(args.ctx, 1, {
      retryAction: "retry_missing_send_message",
      didRetry: shouldRetry ? "true" : "false"
    });
    if (!shouldRetry) {
      return;
    }
    await this.cancelPendingAgentResponseComparison();
    throw new EmptyResponseRetryError("retry_missing_send_message", true);
  }
  async runStep(parentCtx, turn, rootPromptExecutor, stateHandler, toolsGenerator, mcpTools, repositoryInfos, requestContext, fileOperationLockManager, onStateUpdate, previousQueuedMessageSource, maxOutputTokenRetryDebug) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource37(env_2, createSpan(parentCtx.withName("runStep")), false);
      const ctx = spanCtxt.ctx;
      const invocationId = getInvocationId(ctx);
      stateHandler.lastStepInvocationId = invocationId;
      spanCtxt.span.setAttribute("invocationId", invocationId);
      logger65.info(ctx, "Running step");
      const stepSetupStart = performance.now();
      const isFirstStep = turn.steps.length === 0;
      const isResponseComparisonFirstModelStep = !this.responseComparisonModelStepStarted;
      this.responseComparisonModelStepStarted = true;
      const interactionHandler = new InteractionHandler(
        toUnredactedInteractionListener(this.interactionListener, stateHandler.getPrivacyMode()),
        turn,
        invocationId,
        void 0,
        // overrideSignal
        this.config.thinkingStyle,
        resolveAgentSingleMessageLoopDetection(this.config),
        this.createAfterAgentThoughtCallback(invocationId, requestContext)
      );
      const userMessage = await turn.userMessage.get(ctx);
      const mode = stateHandler.resolveStepMode(userMessage);
      const toolsBuildStartMs = performance.now();
      const toolSetHandle = toolsGenerator({
        resourceAccessor: this.resourceAccessor,
        stateHandler,
        agentSessionId: this.config.agentSessionId,
        mcpTools,
        repositoryInfos,
        blobStore: stateHandler.getBlobStore(),
        mode,
        loggingContext: ctx,
        requestContext,
        fileOperationLockManager,
        smartModeClassifierMode: this.config.smartModeClassifierMode,
        smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
        autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
      });
      ctx.get(cloudAgentTurnPrepGlueMsRecorderKey)?.("toolsBuildMs", performance.now() - toolsBuildStartMs);
      const initialMessages = fromRedactedCoreMessages(rootPromptExecutor.getMessages(), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      if (isFirstStep) {
        warnIfLongTrailingUserMessageRun(ctx, initialMessages, invocationId);
        firstStepSetupDuration.histogram(ctx, performance.now() - stepSetupStart);
      }
      trackPromptTokenUsage({
        ctx,
        mcpTools,
        requestContext,
        messages: initialMessages,
        selectedContext: userMessage.selectedContext,
        userInfoDisplayOptions: this.config.userInfoDisplayOptions,
        agentTokenLimit: this.config.agentTokenLimit,
        readToolName: toolSetHandle.getTool("READ")?.name,
        invocationId,
        modelInfo: this.config.modelInfo,
        featureFlags: this.config.featureFlags,
        stateHandler,
        mcpMetaToolServerCount: getToolSetMcpMetaToolServerCount(toolSetHandle)
      });
      const userAutoRunInstructions = await this.getUserPermissionsFileAutoRunInstructions(ctx, requestContext);
      const projectAutoRunInstructions = this.getProjectPermissionsFileAutoRunInstructions(requestContext);
      let responseComparisonMessages = this.config.agentResponseComparison === void 0 ? void 0 : [...initialMessages];
      let responseComparisonTools = this.config.agentResponseComparison === void 0 ? void 0 : Object.freeze(toAgentTools(toolSetHandle.getStaticTools(), toolSetHandle.getDescriptionProps()));
      if (isResponseComparisonFirstModelStep && responseComparisonMessages !== void 0 && responseComparisonTools !== void 0) {
        await this.preparePendingAgentResponseComparison({
          ctx,
          parentInvocationId: invocationId,
          messages: responseComparisonMessages,
          tools: responseComparisonTools,
          privacyMode: stateHandler.getPrivacyMode()
        });
      }
      let result;
      let checkpointedPendingToolCalls;
      let pendingToolCallsCheckpointWrite;
      try {
        result = rootPromptExecutor.executeToolStream(
          ctx,
          stateHandler,
          interactionHandler,
          toolSetHandle.getToolExecutionSet(),
          {
            repositoryInfos,
            shouldQueryProd: requestContext.repositoryInfoShouldQueryProd,
            stateHandler,
            strictArgParsing: this.config.strictArgParsing === true,
            modelVendor: this.config.modelInfo?.vendor,
            enableToolArgPreservation: this.config.enableToolArgPreservation === true,
            enableHookAdditionalContext: this.config.featureFlags?.enableHookAdditionalContext === true,
            enableAgentStoreConflictNoticeCollector: this.config.featureFlags?.enableAgentStoreConflictNotices === true,
            enableAgentStoreConflictNotices: this.config.featureFlags?.enableAgentStoreConflictNotices === true,
            writeBarrierTimeoutMs: this.resolveWriteBarrierTimeoutMs(),
            onWriteBarrier: this.config.recordAgentStoreWriteBarrier,
            workspacePaths: requestContext.env?.workspacePaths,
            userAutoRunInstructions,
            projectAutoRunInstructions,
            cursorRules: getAllRules(requestContext, this.config.nonFileRules, this.config.featureFlags),
            agentSkills: requestContext.agentSkills ?? [],
            // Live steer signal for long-running tools (Await early release,
            // Shell/Task durable background handoff). This inline object is the
            // extras the executing tools actually receive; the builder-based
            // sites cover only summarization and the deferred split-step flow.
            contextInjectionSignal: this.conversationActionReceiver.getContextInjectionToolSignal?.()
          },
          interactionHandler.recordToolCallResult.bind(interactionHandler),
          toolSetHandle.getDescriptionProps(),
          // Disable firstToolCallHook for cloud agents (maxSteps === 1) - their workflow loop
          // This checkpoint callback is not needed, and causes consistency issues when it races
          // with tool call completions.
          this.config.maxSteps === 1 ? void 0 : async (pending) => {
            const pendingToolCallStartedAtMs = Date.now();
            const toolExecutionSet = toolSetHandle.getToolExecutionSet();
            const allowedToolNames = toolExecutionSet.modelVisibleTools.map((tool) => tool.name);
            const pendingWithContracts = (pending ?? []).map((p2) => enrichPendingToolCallJson(p2, {
              resolveIdentity: (input) => toolSetHandle.resolveToolCallIdentity(input),
              toolExecutionSet,
              allowedToolNames,
              pendingToolCallStartedAtMs
            }));
            checkpointedPendingToolCalls = pendingWithContracts;
            if (this.config.fireAndForgetCheckpoints) {
              pendingToolCallsCheckpointWrite = stateHandler.computeNewStructure(ctx).then(async (current) => {
                current.pendingToolCalls = pendingWithContracts.map((p2) => createRedactedString(p2, DataClassification.CODE, "pendingToolCalls", PrivacyMode.UNSPECIFIED));
                if (onStateUpdate) {
                  await onStateUpdate(ctx, current);
                }
              }).catch((error3) => {
                logger65.error(ctx, "Failed to persist checkpoint with pending tool calls", {
                  error: error3
                });
              });
            } else {
              const current = await stateHandler.computeNewStructure(ctx);
              current.pendingToolCalls = pendingWithContracts.map((p2) => createRedactedString(p2, DataClassification.CODE, "pendingToolCalls", PrivacyMode.UNSPECIFIED));
              if (onStateUpdate) {
                await onStateUpdate(ctx, current);
              }
            }
          }
        );
      } catch (error3) {
        await this.cancelPendingAgentResponseComparison();
        throw error3;
      }
      const tokenDetails = stateHandler.tokenDetails;
      const isCloudAgentSingleStep = this.config.maxSteps === 1;
      const shouldSuppressSelfSummaryAfterInputLimitFailure = stateHandler.shouldSuppressSelfSummaryAfterInputLimitFailure(tokenDetails.usedTokens);
      const shouldStartBg = !isCloudAgentSingleStep && !stateHandler.tokenDetailsStaleAfterSummarization && !shouldSuppressSelfSummaryAfterInputLimitFailure && this.orchestrator.shouldStartBackgroundSummarization(tokenDetails, rootPromptExecutor.getMessages(), ctx);
      const startBackgroundSummary = async (canStartBackgroundSummary, launchTokenDetails) => {
        const accounting = launchTokenDetails ?? tokenDetails;
        logger65.info(ctx, "[summarization-trigger] Triggering background summarization since we are below free token threshold", {
          usedTokens: accounting.usedTokens,
          maxTokens: accounting.maxTokens,
          backgroundSummarizationConfig: this.config.backgroundSummarizationProps
        });
        await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
          // Don't wait for summarization to complete, but start to prepare for when it's needed
          backgroundSummarizationMode: BackgroundSummarizationMode.Background,
          canStartBackgroundSummary,
          launchTokenDetails,
          // Everything captured before this step's model call is final; the
          // step's own output is still streaming and must stay out of the
          // snapshot.
          settledMessageCount: initialMessages.length,
          triggerReason: "approaching_token_limit",
          currentInvocationId: invocationId,
          resourceAccessor: this.resourceAccessor,
          tools: toolSetHandle.getStaticTools(),
          descriptionProps: toolSetHandle.getDescriptionProps(),
          extraT: {
            repositoryInfos,
            shouldQueryProd: requestContext.repositoryInfoShouldQueryProd,
            stateHandler,
            strictArgParsing: this.config.strictArgParsing === true,
            modelVendor: this.config.modelInfo?.vendor,
            enableToolArgPreservation: this.config.enableToolArgPreservation === true,
            enableHookAdditionalContext: this.config.featureFlags?.enableHookAdditionalContext === true,
            enableAgentStoreConflictNoticeCollector: this.config.featureFlags?.enableAgentStoreConflictNotices === true,
            enableAgentStoreConflictNotices: this.config.featureFlags?.enableAgentStoreConflictNotices === true,
            writeBarrierTimeoutMs: this.resolveWriteBarrierTimeoutMs(),
            onWriteBarrier: this.config.recordAgentStoreWriteBarrier,
            workspacePaths: requestContext.env?.workspacePaths,
            userAutoRunInstructions,
            projectAutoRunInstructions,
            cursorRules: getAllRules(requestContext, this.config.nonFileRules, this.config.featureFlags),
            agentSkills: requestContext.agentSkills ?? []
          },
          automationTriggerContext: this.getAutomationTriggerContext(rootPromptExecutor.getMessages())
        });
      };
      if (shouldStartBg) {
        await startBackgroundSummary();
      }
      let stepClosed = false;
      let responseSummarySetup;
      const reportResponseSummaryFailure = (error3) => {
        logger65.warn(ctx, "Failed to start response-time background summarization", { error: error3 });
      };
      const responseSummaryLaunch = result.extendedUsage.then((currentUsage) => {
        const threshold = this.config.backgroundSummarizationProps.usedTokensThresholdToStartBackgroundSummarization;
        const canStart = () => !stepClosed && !ctx.signal.aborted && !isCloudAgentSingleStep && stateHandler.backgroundSummarizationPromiseInfo === null && (this.config.selfSummaryConfig?.canUseSelfSummary?.() ?? false) && this.config.backgroundSummarizationProps.usedTokensThresholdToStartBackgroundSummarization === threshold && !stateHandler.shouldSuppressSelfSummaryAfterInputLimitFailure(currentUsage.inputTokens + currentUsage.outputTokens) && shouldStartBackgroundSummarization(currentUsage.inputTokens, currentUsage.maxTokens, {
          usedTokensThresholdToStartBackgroundSummarization: threshold
        });
        if (canStart()) {
          responseSummarySetup = startBackgroundSummary(canStart, {
            usedTokens: currentUsage.inputTokens + currentUsage.outputTokens,
            maxTokens: currentUsage.maxTokens
          }).catch(reportResponseSummaryFailure);
          return responseSummarySetup;
        }
      }).catch(reportResponseSummaryFailure);
      let response;
      let extendedUsage;
      let usage;
      let finalInvocationId;
      try {
        [response, extendedUsage, usage, finalInvocationId] = await Promise.all([
          result.response,
          result.extendedUsage,
          result.usage,
          result.invocationId,
          interactionHandler.consumeStream(ctx, this.tapAgentResponseComparisonWarmup(ctx, result.fullStream, responseComparisonMessages, responseComparisonTools), turn),
          responseSummaryLaunch
        ]);
      } catch (error3) {
        stepClosed = true;
        await this.cancelPendingAgentResponseComparison();
        if (error3 instanceof DeferredInteractionResponseError && checkpointedPendingToolCalls !== void 0) {
          await pendingToolCallsCheckpointWrite;
          await this.checkpointToolResultsCompletedBeforeDeferral({
            ctx,
            stateHandler,
            pendingToolCalls: checkpointedPendingToolCalls,
            completedToolResults: getToolResultsCompletedBeforeDeferral(error3),
            onStateUpdate
          });
        }
        throw error3;
      } finally {
        stepClosed = true;
        await responseSummarySetup;
      }
      if (finalInvocationId !== invocationId) {
        logger65.error(ctx, "Invocation ID mismatch. Bug in executeToolStream", void 0, {
          initialInvocationId: invocationId,
          finalInvocationId
        });
      }
      logger65.info(ctx, "Setting token details for client token ring", {
        usedTokens: usage.totalTokens,
        maxTokens: extendedUsage.maxTokens,
        inputTokens: extendedUsage.inputTokens,
        outputTokens: extendedUsage.outputTokens,
        cacheReadTokens: extendedUsage.cacheReadTokens,
        cacheWriteTokens: extendedUsage.cacheWriteTokens
      });
      const promptContextDetails = nextRedactedPromptContextDetails(ctx, this.config, stateHandler, {
        messages: initialMessages,
        tools: toolSetHandle.getStaticTools(),
        descriptionProps: toolSetHandle.getDescriptionProps(),
        totalUsedTokens: usage.totalTokens,
        maxTokens: extendedUsage.maxTokens
      });
      stateHandler.setTokenDetails(createRedactedConversationTokenDetails(stateHandler.getPrivacyMode(), {
        usedTokens: usage.totalTokens,
        maxTokens: extendedUsage.maxTokens,
        breakdown: promptContextDetails.breakdown,
        promptContextUsageTree: promptContextDetails.promptContextUsageTree
      }));
      if (response.error || ctx.signal.aborted) {
        await this.cancelPendingAgentResponseComparison();
        if (this.config.skipErrorStateCheckpoint !== true) {
          turn.appendPromptMessages(toRedactedCoreMessages(response.messages, stateHandler.getPrivacyMode()));
          const currentState = await stateHandler.computeNewStructure(ctx);
          if (onStateUpdate) {
            await onStateUpdate(ctx, currentState);
          }
        }
        throw response.error ?? new ConnectError("User aborted request", Code.Canceled);
      }
      stateHandler.addTurnUsage({
        inputTokens: extendedUsage.inputTokens,
        outputTokens: extendedUsage.outputTokens,
        cacheReadTokens: extendedUsage.cacheReadTokens,
        cacheWriteTokens: extendedUsage.cacheWriteTokens,
        reasoningTokens: extendedUsage.reasoningTokens
      });
      const hasToolCall = containsToolCall(response.messages);
      const hasSendMessageCapability = toolSetHandle.getTool("SEND_MESSAGE") !== void 0;
      const visibilityReminderAlreadyInjected = hasSendMessageCapability && hasProjectSendMessageReminderForCurrentRequest(initialMessages);
      await this.maybeRetryProjectCoordinatorWithoutSendMessage({
        ctx,
        turn,
        hasToolCall,
        hasSendMessageCapability,
        isSimulatedUserMessage: userMessage.isSimulatedMsg === true,
        visibilityReminderAlreadyInjected,
        mode,
        maxOutputTokenRetryDebug
      });
      if (!hasToolCall && responseComparisonMessages !== void 0 && responseComparisonTools !== void 0) {
        try {
          await this.enqueueAgentResponseComparisonIfEligible({
            ctx,
            parentInvocationId: finalInvocationId,
            responseMessages: response.messages,
            messages: responseComparisonMessages,
            tools: responseComparisonTools,
            privacyMode: stateHandler.getPrivacyMode()
          });
        } finally {
          responseComparisonMessages = void 0;
          responseComparisonTools = void 0;
        }
      }
      if (extendedUsage) {
        let currentToolCallName = "userMessage";
        for (const msg of response.messages) {
          if (msg.role === "assistant" && Array.isArray(msg.content)) {
            for (const part of msg.content) {
              if (part.type === "tool-call") {
                currentToolCallName = part.toolName;
                break;
              }
            }
            if (currentToolCallName !== "userMessage")
              break;
          }
        }
        const argsTags = { toolCallName: currentToolCallName };
        toolCallArgsOutputTokens.histogram(ctx, extendedUsage.outputTokens, argsTags);
        toolCallArgsCacheWriteTokens.histogram(ctx, extendedUsage.cacheWriteTokens, argsTags);
        let priorToolCallName = "userMessage";
        if (turn.steps.length > 0) {
          const lastStepRef = turn.steps[turn.steps.length - 1];
          const lastStep = await lastStepRef.get(ctx);
          if (lastStep.message.case === "toolCall") {
            const toolCase = lastStep.message.value.tool.case;
            if (toolCase !== void 0) {
              priorToolCallName = toolCase.replace("ToolCall", "").replace(/_/g, "-");
            }
          }
        }
        const resultTags = { toolCallName: priorToolCallName };
        toolCallResultInputTokens.histogram(ctx, extendedUsage.inputTokens, resultTags);
        toolCallResultCachedReadTokens.histogram(ctx, extendedUsage.cacheReadTokens, resultTags);
      }
      const sendMessageCallRequirementSatisfied = hasSendMessageCapability && this.config.featureFlags?.sandSendMessageDeliveryOwed !== false && (turn.hasSendMessageCall() || visibilityReminderAlreadyInjected || userMessage.isSimulatedMsg === true);
      const turnBudget = maxOutputTokenRetryDebug?.emptyResponseRetryTurnBudget;
      if (!hasToolCall && hasEmptyAssistantText(response.messages)) {
        const executorMessages = rootPromptExecutor.getMessages();
        const taskToolName = toolSetHandle.getTool("TASK")?.name ?? (this.config.modelInfo !== void 0 ? getTaskToolName(this.config.modelInfo) : void 0);
        const unwrappedExecutorMessages = fromRedactedCoreMessages(executorMessages, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
        const isTrailingTaskToolCall = isTrailingTaskToolCallMessage(unwrappedExecutorMessages, taskToolName, toolSetHandle);
        const executorMessageCount = executorMessages.length;
        const lastExecutorMsg = executorMessages.at(-1);
        const lastExecutorMsgRole = lastExecutorMsg?.role ?? "unknown";
        let thinkingChars = 0;
        for (const msg of response.messages) {
          if (msg.role === "assistant" && Array.isArray(msg.content)) {
            for (const part of msg.content) {
              if (part.type === "reasoning" && "text" in part && typeof part.text === "string") {
                thinkingChars += part.text.length;
              }
            }
          }
        }
        const emptyResponseAttrs = {
          outputTokens: extendedUsage.outputTokens,
          inputTokens: extendedUsage.inputTokens,
          invocationId,
          earlyStopDebug: {
            hasThinkingContent: thinkingChars > 0,
            thinkingChars,
            lastExecutorMsgRole,
            executorMessageCount,
            previousQueuedMessageSource: previousQueuedMessageSource ?? "none",
            actionClass: this.constructor.name,
            maxOutputTokenRetry: maxOutputTokenRetryDebug ?? {
              didAddOutputTokenReminder: false,
              outputTokenLimitRetryCount: 0
            }
          }
        };
        if (lastExecutorMsgRole === "assistant") {
          logger65.warn(ctx, "nal.empty_response.sent_assistant_message", emptyResponseAttrs);
        }
        if (lastExecutorMsgRole === "tool") {
          logger65.warn(ctx, "nal.empty_response.sent_tool", emptyResponseAttrs);
        }
        if (thinkingChars > 0) {
          logger65.warn(ctx, "nal.empty_response.received_only_thinking", emptyResponseAttrs);
        }
        if (extendedUsage.outputTokens === 0) {
          logger65.warn(ctx, "nal.empty_response.received_no_output_tokens", emptyResponseAttrs);
        }
        logger65.warn(ctx, "nal.empty_response", emptyResponseAttrs);
        let retryAction;
        if (this.constructor.name === "ResumeActionHandler") {
          retryAction = "ok_resume_action";
        } else if (this.constructor.name === "BackgroundTaskCompletionActionHandler") {
          retryAction = "ok_background_task_completion_action";
        } else if (lastExecutorMsgRole === "tool") {
          retryAction = "retry_tool_result";
        } else if (lastExecutorMsgRole === "user") {
          retryAction = "retry_user_msg";
        } else if (extendedUsage.outputTokens === 0) {
          retryAction = "retry_no_output_tokens";
        } else if (thinkingChars > 0) {
          retryAction = "retry_thinking_only";
        } else {
          retryAction = "fallthrough";
        }
        const trailingUserMsg = lastExecutorMsg === void 0 ? void 0 : fromRedactedCoreMessages([lastExecutorMsg], PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)[0];
        const isTrailingNotificationUserMsg = retryAction === "retry_user_msg" && trailingUserMsg !== void 0 && isNotificationOnlyUserMessage(trailingUserMsg) && !isGoalContinuationNotificationMessage(trailingUserMsg);
        const hasTrailingToolFailure = trailingToolBatchHasFailure(unwrappedExecutorMessages);
        const isRetryEnabled = this.config.featureFlags?.enableEmptyResponseRetry === true;
        const isMetaParentAgent = this.config.featureFlags?.glassMetaParentAgent === true;
        const isMultitaskMode = mode === AgentMode.MULTITASK;
        const alreadyRetried = maxOutputTokenRetryDebug?.didRetryAfterEmptyResponse === true;
        const isLastRetryLoopIteration = (maxOutputTokenRetryDebug?.retryLoopIteration ?? 0) >= MAX_RETRY_ITERATIONS - 1;
        const turnRetriesUsed = turnBudget?.retriesUsed ?? 0;
        const turnBudgetExhausted = turnBudget !== void 0 && turnRetriesUsed >= MAX_EMPTY_RESPONSE_RETRIES_PER_TURN;
        const shouldRetry = isRetryEnabled && !isMetaParentAgent && !isMultitaskMode && !alreadyRetried && !isLastRetryLoopIteration && !turnBudgetExhausted && !isTrailingNotificationUserMsg && !sendMessageCallRequirementSatisfied && retryAction !== "ok_resume_action" && retryAction !== "ok_background_task_completion_action" && retryAction !== "fallthrough";
        const needsContinuationMessage2 = retryAction !== "retry_user_msg" && !isTrailingTaskToolCall;
        const retryInfo = {
          retryAction,
          isRetryEnabled,
          isMetaParentAgent,
          isMultitaskMode,
          isTrailingTaskToolCall,
          isTrailingNotificationUserMsg,
          hasSendMessageCapability,
          hasTrailingToolFailure,
          sendMessageCallRequirementSatisfied,
          alreadyRetried,
          isLastRetryLoopIteration,
          turnRetriesUsed,
          turnBudgetExhausted,
          maxEmptyResponseRetriesPerTurn: MAX_EMPTY_RESPONSE_RETRIES_PER_TURN
        };
        logger65.warn(ctx, "nal.empty_response.retry_dry_run", {
          ...emptyResponseAttrs,
          retryInfo,
          shouldRetry
        });
        emptyResponseRetryClassification.increment(ctx, 1, {
          retryAction,
          didRetry: shouldRetry ? "true" : "false"
        });
        if (shouldRetry) {
          await this.cancelPendingAgentResponseComparison();
          throw new EmptyResponseRetryError(retryAction, needsContinuationMessage2);
        } else {
          if (turnBudgetExhausted) {
            logger65.warn(ctx, "nal.empty_response.turn_budget_exceeded", {
              ...emptyResponseAttrs,
              retryInfo
            });
          }
          logger65.warn(ctx, "nal.empty_response.did_not_retry", {
            ...emptyResponseAttrs,
            retryInfo
          });
        }
      }
      return {
        hasToolCall,
        responseMessages: response.messages
      };
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources37(env_2);
    }
  }
  async runWithMaxTokensRetry(parentCtx, rootPromptExecutor, fn, emptyResponseRetryTurnBudget) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource37(env_3, createSpan(parentCtx.withName("runWithMaxTokensRetry")), false);
      const ctx = spanCtxt.ctx;
      let didAddOutputTokenReminder = false;
      let outputTokenLimitRetryCount = 0;
      let didRetryAfterSingleMessageLoop = false;
      let didRetryAfterEmptyResponse = false;
      let lastSingleMessageLoopKind;
      let lastSingleMessageLoopFingerprint;
      let lastRetryError;
      const singleMessageLoopDetection = resolveAgentSingleMessageLoopDetection(this.config);
      const isSingleMessageLoopRetryEnabled = singleMessageLoopDetection?.responseAction === "retry_once";
      const reportSingleMessageLoopStage = (stage) => {
        if (lastSingleMessageLoopKind === void 0 || lastSingleMessageLoopFingerprint === void 0) {
          return;
        }
        reportLoopMitigationObservation(singleMessageLoopDetection?.reporting, {
          loopKind: lastSingleMessageLoopKind,
          evidenceFingerprint: lastSingleMessageLoopFingerprint,
          mitigation: "single_message_retry",
          stage
        });
      };
      for (let i = 0; i < MAX_RETRY_ITERATIONS; i++) {
        try {
          const result = await fn(ctx, {
            didAddOutputTokenReminder,
            outputTokenLimitRetryCount,
            didRetryAfterEmptyResponse,
            retryLoopIteration: i,
            emptyResponseRetryTurnBudget
          });
          if (didRetryAfterSingleMessageLoop) {
            incrementLoopRetryOutcome(ctx, "recovered", lastSingleMessageLoopKind);
          }
          return result;
        } catch (error3) {
          if (error3 instanceof OutputTokensLimitExceededError) {
            outputTokenLimitRetryCount += 1;
            if (!didAddOutputTokenReminder) {
              didAddOutputTokenReminder = true;
              rootPromptExecutor.appendMessages(toRedactedCoreMessages([
                {
                  role: "user",
                  content: "<system_reminder>Your response was cut off because it exceeded the output token limit. Please break your work into smaller pieces. Continue from where you left off.</system_reminder>"
                }
              ], PrivacyMode.UNSPECIFIED));
              logger65.info(ctx, "Hit max tokens error, added reminder");
            } else {
              logger65.info(ctx, "Hit max tokens error, but already added reminder");
            }
          } else if (error3 instanceof EmptyResponseRetryError && !didRetryAfterEmptyResponse) {
            didRetryAfterEmptyResponse = true;
            if (emptyResponseRetryTurnBudget !== void 0) {
              emptyResponseRetryTurnBudget.retriesUsed += 1;
            }
            if (error3.needsContinuationMessage) {
              const continuationMessage = error3.retryAction === "retry_missing_send_message" ? createProjectSendMessageVisibilityReminder() : {
                role: "user",
                content: EMPTY_RESPONSE_CONTINUATION_MESSAGE
              };
              rootPromptExecutor.appendMessages(toRedactedCoreMessages([continuationMessage], PrivacyMode.UNSPECIFIED));
            }
            logger65.info(ctx, "nal.empty_response.retrying", {
              retryAction: error3.retryAction,
              needsContinuationMessage: error3.needsContinuationMessage,
              turnRetriesUsed: emptyResponseRetryTurnBudget?.retriesUsed,
              maxEmptyResponseRetriesPerTurn: MAX_EMPTY_RESPONSE_RETRIES_PER_TURN
            });
          } else if (isSingleMessageLoopRetryEnabled && error3 instanceof AgentLoopError && error3.loopType === "singleMessage") {
            if (didRetryAfterSingleMessageLoop) {
              incrementLoopRetryOutcome(ctx, "looped_again", error3.singleMessageLoopKind);
              reportSingleMessageLoopStage("looped_again");
              lastSingleMessageLoopKind = error3.singleMessageLoopKind;
              logger65.warn(ctx, "Single-message loop detected again after retry", {
                loopKind: error3.singleMessageLoopKind,
                repetitions: error3.repetitions,
                period: error3.period
              });
              throw error3;
            }
            didRetryAfterSingleMessageLoop = true;
            lastSingleMessageLoopKind = error3.singleMessageLoopKind;
            lastSingleMessageLoopFingerprint = error3.evidenceFingerprint;
            incrementLoopRetryOutcome(ctx, "retried", lastSingleMessageLoopKind);
            reportSingleMessageLoopStage("applied");
            const reminder = createLoopReminderMessage({
              kind: error3.singleMessageLoopKind ?? "single_message_multi_line"
            });
            rootPromptExecutor.appendMessages(toRedactedCoreMessages([reminder], PrivacyMode.UNSPECIFIED));
            logger65.info(ctx, "Single-message loop detected, added reminder and retrying", {
              loopKind: error3.singleMessageLoopKind,
              repetitions: error3.repetitions,
              period: error3.period
            });
          } else {
            if (didRetryAfterSingleMessageLoop) {
              reportSingleMessageLoopStage("failed");
            }
            throw error3;
          }
          lastRetryError = error3;
        }
      }
      if (didRetryAfterSingleMessageLoop) {
        incrementLoopRetryOutcome(ctx, "exhausted", lastSingleMessageLoopKind);
        reportSingleMessageLoopStage("exhausted");
      }
      throw new StepRetriesExhaustedError("step-retries", {
        cause: lastRetryError
      });
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources37(env_3);
    }
  }
  async runWithSummarizationRetry(parentCtx, stateHandler, rootPromptExecutor, requestContext, tools, extraT, descriptionProps, fn) {
    const env_4 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource37(env_4, createSpan(parentCtx.withName("runWithSummarizationRetry")), false);
      const ctx = spanCtxt.ctx;
      const automationTriggerContext = this.getAutomationTriggerContext(rootPromptExecutor.getMessages());
      let lastRetryError;
      for (let i = 0; i < 5; i++) {
        try {
          const evalCompletionMode = EVAL_ENFORCED_WAIT_FOR_SUMMARIZATION_COMPLETION(ctx);
          const forcedSummarizationMode = shouldForceSummarizationForTesting(fromRedactedCoreMessages(rootPromptExecutor.getMessages(), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED), evalCompletionMode);
          if (forcedSummarizationMode !== void 0) {
            logger65.info(ctx, "[summarization-trigger] Force summarization triggered", {
              evalCompletionMode,
              mode: forcedSummarizationMode
            });
            await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
              backgroundSummarizationMode: forcedSummarizationMode,
              fullSummarization: true,
              triggerReason: "force_dev_testing",
              currentInvocationId: stateHandler.lastStepInvocationId,
              resourceAccessor: this.resourceAccessor,
              tools,
              extraT,
              descriptionProps,
              automationTriggerContext
            });
          }
          if (stateHandler.backgroundSummarizationPromiseInfo !== null && stateHandler.backgroundSummarizationHasCompleted && !stateHandler.shouldSuppressSelfSummaryAfterInputLimitFailure(stateHandler.tokenDetails.usedTokens)) {
            const midLoopTokenDetails = stateHandler.tokenDetails;
            const wouldMeetPersistThreshold = shouldPersistBackgroundSummarization(midLoopTokenDetails.usedTokens, midLoopTokenDetails.maxTokens, this.config.backgroundSummarizationProps);
            const wouldMeetTriggerThreshold = shouldStartBackgroundSummarization(midLoopTokenDetails.usedTokens, midLoopTokenDetails.maxTokens, this.config.backgroundSummarizationProps);
            const requireTriggerThreshold = this.config.backgroundSummarizationProps.requireTriggerThresholdForMidLoopPersist === true;
            const imageCountMidLoop = countImagePartsInMessages(fromRedactedCoreMessages(rootPromptExecutor.getMessages(), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
            const shouldPersistForImageThresholdMidLoop = imageCountMidLoop >= IMAGE_SUMMARIZATION_TRIGGER_COUNT;
            const shouldPersistMidLoop = shouldPersistForImageThresholdMidLoop || !requireTriggerThreshold || wouldMeetTriggerThreshold || persistsWithoutThreshold(stateHandler.backgroundSummarizationPromiseInfo);
            logger65.info(ctx, "[summarization-persist] Mid-loop background summarization persistence: checking persist threshold", {
              usedTokens: midLoopTokenDetails.usedTokens,
              maxTokens: midLoopTokenDetails.maxTokens,
              unusedTokens: midLoopTokenDetails.maxTokens - midLoopTokenDetails.usedTokens,
              wouldMeetPersistThreshold,
              wouldMeetTriggerThreshold,
              requireTriggerThreshold,
              imageCountMidLoop,
              imageThreshold: IMAGE_SUMMARIZATION_TRIGGER_COUNT,
              shouldPersistForImageThresholdMidLoop,
              shouldPersistMidLoop,
              triggerThreshold: getBackgroundSummarizationTriggerThreshold(midLoopTokenDetails.maxTokens, this.config.backgroundSummarizationProps),
              persistConfig: {
                unusedTokensThreshold: this.config.backgroundSummarizationProps.unusedTokensThresholdToPersistBackgroundSummarization,
                unusedPercentTokensThreshold: this.config.backgroundSummarizationProps.unusedPercentTokensThresholdToPersistBackgroundSummarization
              }
            });
            if (shouldPersistMidLoop) {
              await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
                backgroundSummarizationMode: BackgroundSummarizationMode.BackgroundAndPersistIfCompleted,
                triggerReason: shouldPersistForImageThresholdMidLoop && !wouldMeetTriggerThreshold ? "approaching_image_limit" : "approaching_token_limit",
                currentInvocationId: stateHandler.lastStepInvocationId,
                resourceAccessor: this.resourceAccessor,
                tools,
                extraT,
                descriptionProps,
                automationTriggerContext
              });
            } else {
              emitSummaryLifecycleDeferred(ctx, stateHandler.backgroundSummarizationPromiseInfo, "persistence_threshold_not_met");
            }
          }
          if (stateHandler.backgroundSummarizationPromiseInfo !== null && !stateHandler.backgroundSummarizationHasCompleted) {
            const currentTokenDetails = stateHandler.tokenDetails;
            if (isSignificantlyOverTokenLimit(currentTokenDetails)) {
              logger65.info(ctx, "[summarization-persist] Blocking on background summarization because token usage significantly exceeds max tokens", {
                usedTokens: currentTokenDetails.usedTokens,
                maxTokens: currentTokenDetails.maxTokens,
                overageThreshold: getSignificantOverageThreshold(currentTokenDetails.maxTokens)
              });
              await withCloudAgentPreAgentTurnPrepPhase(ctx, "preAgentSummarizationMs", () => this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
                backgroundSummarizationMode: BackgroundSummarizationMode.WaitForCompletion,
                triggerReason: "significantly_over_token_limit",
                currentInvocationId: stateHandler.lastStepInvocationId,
                resourceAccessor: this.resourceAccessor,
                tools,
                extraT,
                descriptionProps,
                automationTriggerContext
              }));
            }
          }
          const messagesBeforeImageCompaction = fromRedactedCoreMessages(rootPromptExecutor.getMessages(), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
          const imageCount = countImagePartsInMessages(messagesBeforeImageCompaction);
          if (imageCount >= IMAGE_SUMMARIZATION_TRIGGER_COUNT) {
            logger65.info(ctx, "Image count reached threshold; starting background summarization", {
              imageCount,
              triggerCount: IMAGE_SUMMARIZATION_TRIGGER_COUNT
            });
            await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
              backgroundSummarizationMode: BackgroundSummarizationMode.Background,
              triggerReason: "approaching_image_limit",
              currentInvocationId: stateHandler.lastStepInvocationId,
              resourceAccessor: this.resourceAccessor,
              tools,
              extraT,
              descriptionProps,
              automationTriggerContext
            });
          }
          if (this.config.maxSteps === 1 && this.config.featureFlags?.cloudAgentProactiveTokenLimitError === true && !stateHandler.tokenDetailsStaleAfterSummarization) {
            const td = stateHandler.tokenDetails;
            if (shouldPersistBackgroundSummarization(td.usedTokens, td.maxTokens, this.config.backgroundSummarizationProps) && !await this.shouldDeferProactiveCompaction(ctx, td)) {
              const useProactiveSelfSummarization = this.config.featureFlags?.cloudAgentProactiveSelfSummarization === true;
              logger65.info(ctx, useProactiveSelfSummarization ? "[cloud-summarization] Token usage hit configured threshold, throwing ProactiveSummarizationThresholdError to trigger compaction" : "[cloud-summarization] Token usage hit configured threshold, throwing InputTokenLimitError to trigger external compaction", {
                usedTokens: td.usedTokens,
                maxTokens: td.maxTokens,
                useProactiveSelfSummarization
              });
              throw useProactiveSelfSummarization ? new ProactiveSummarizationThresholdError() : new InputTokenLimitError();
            }
          }
          return await fn(ctx);
        } catch (error3) {
          const isProactiveSummarizationThresholdError = error3 instanceof ProactiveSummarizationThresholdError;
          const isTokenLimitError = SummarizationHandler.isTokenLimitError(error3);
          const isImagePartsLimitError = isTooManyImagesOrDocumentsError(error3);
          if (isProactiveSummarizationThresholdError || isTokenLimitError || isImagePartsLimitError) {
            const wouldUseSelfSummary = this.orchestrator.canUseSelfSummary({
              tools,
              extraT
            });
            logger65.info(ctx, isImagePartsLimitError ? "[summarization-trigger] Hit image limit error, running blocking summarization in order to compress context" : isProactiveSummarizationThresholdError ? "[summarization-trigger] Hit configured summarization threshold, running blocking summarization in order to compress context" : "[summarization-trigger] Hit token limit error, running blocking summarization in order to compress context");
            const forceExternalModel = isTokenLimitError || isImagePartsLimitError ? true : void 0;
            const summarizationOptions = {
              // Block until the summarization has completed since we have no tokens remaining
              backgroundSummarizationMode: BackgroundSummarizationMode.WaitForCompletion,
              currentInvocationId: stateHandler.lastStepInvocationId,
              triggerReason: isImagePartsLimitError ? "approaching_image_limit" : isProactiveSummarizationThresholdError ? "approaching_token_limit" : wouldUseSelfSummary ? "fallback_on_limit_error" : "input_token_limit_error",
              resourceAccessor: this.resourceAccessor,
              forceExternalModel,
              tools,
              extraT,
              descriptionProps,
              automationTriggerContext
            };
            await withCloudAgentPreAgentTurnPrepPhase(ctx, "preAgentSummarizationMs", async () => {
              try {
                await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, summarizationOptions);
              } catch (summarizationError) {
                const shouldFallbackToExternalSummarization = this.config.featureFlags?.cloudAgentProactiveSelfSummarization === true && forceExternalModel !== true && wouldUseSelfSummary && SummarizationHandler.isInputOrOutputTokenLimitError(summarizationError);
                if (!shouldFallbackToExternalSummarization) {
                  throw summarizationError;
                }
                logger65.info(ctx, "[summarization-trigger] Self-summary hit token limit, falling back to external summarization");
                await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
                  ...summarizationOptions,
                  triggerReason: "fallback_on_limit_error",
                  forceExternalModel: true
                });
              }
            });
            lastRetryError = error3;
            continue;
          }
          throw error3;
        }
      }
      throw new StepRetriesExhaustedError("summarization-retries", {
        cause: lastRetryError
      });
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      __disposeResources37(env_4);
    }
  }
  async runTurnLoop(parentCtx, rootPromptExecutor, stateHandler, initialTurn, toolsGenerator, mcpTools, repositoryInfo, requestContext, onStateUpdate) {
    const env_5 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource37(env_5, createSpan(parentCtx.withName("runTurnLoop")), false);
      const ctx = span.ctx;
      await this.cancelPendingAgentResponseComparison();
      this.responseComparisonPendingUiAttempted = false;
      this.responseComparisonModelStepStarted = false;
      this.responseComparisonWarmupsInTurn = 0;
      this.responseComparisonCandidate = void 0;
      const turnStartTime = performance.now();
      let totalToolCallsInTurn = 0;
      const turnToolCountingState = new ToolCountingStateTracker();
      const turnToolCountingMiddleware = createToolCountingMiddleware(turnToolCountingState);
      const wrappedRootPromptExecutor = turnToolCountingMiddleware(rootPromptExecutor);
      const hadPreviousAssistantMessage = wrappedRootPromptExecutor.getMessages().some((message) => message.role === "assistant");
      const initialTodos = await Promise.all(stateHandler.todos.map((todoRef) => todoRef.get(ctx)));
      const initialTodoCount = initialTodos.length;
      const hadUnfinishedTodosAtStart = initialTodos.some((todo) => todo.status === TodoStatus.PENDING || todo.status === TodoStatus.IN_PROGRESS);
      const unfinishedTodosAtStart = initialTodos.filter((todo) => todo.status === TodoStatus.PENDING || todo.status === TodoStatus.IN_PROGRESS).length;
      let turn = initialTurn;
      let currentMcpTools = mcpTools;
      let assistantMessagesSinceLastReflectGeneral = 0;
      const cliReflectGeneralReminderInterval = this.config.featureFlags?.cliReflectGeneralConfig?.stepsUntilForcedFollowUp ?? DEFAULT_CLI_REFLECT_GENERAL_REMINDER_INTERVAL;
      const cliReflectGeneralMaxFollowUpsPerTurn = this.config.featureFlags?.cliReflectGeneralConfig?.maxForcedFollowUpsPerTurn ?? DEFAULT_CLI_REFLECT_GENERAL_MAX_FOLLOW_UPS_PER_TURN;
      const cliReflectGeneralReminderText = this.config.featureFlags?.cliReflectGeneralConfig?.forcedFollowUpMessage ?? DEFAULT_CLI_REFLECT_GENERAL_REMINDER_TEXT;
      let cliReflectGeneralFollowUpsSentInTurn = 0;
      const userMessage = await initialTurn.userMessage.get(ctx);
      stateHandler.setMode(stateHandler.resolveTurnMode(userMessage));
      if (!Number.isFinite(this.config.maxSteps) || this.config.maxSteps <= 0) {
        throw new Error("Max steps must be a finite number greater than 0");
      }
      const fileOperationLockManager = new FileOperationLockManager();
      await this.maybeAdoptPendingSummary(ctx, stateHandler, rootPromptExecutor, requestContext);
      this.markRestoredTokenDetailsStaleAfterCompaction(ctx, stateHandler, rootPromptExecutor);
      try {
        let previousStepCount = turn.steps.length;
        let previousMode = stateHandler.mode;
        let previousQueuedMessageSource = "none";
        let finalAssistantMessageCharacterCount;
        let finalAssistantMessageUxStats;
        const emptyResponseRetryTurnBudget = {
          retriesUsed: 0
        };
        let conflictBarrierInjectionsRemaining = 2;
        for (let step = 0; step < this.config.maxSteps && !ctx.signal.aborted; step++) {
          try {
            const currentMode = stateHandler.mode;
            if (previousMode !== void 0 && currentMode !== void 0 && currentMode !== previousMode) {
              const modeReminder = stateHandler.generateModeChangeContent(this.config, requestContext, previousMode);
              logger65.info(ctx, "Mode changed, adding nudge", {
                previousMode,
                newMode: currentMode
              });
              if (modeReminder) {
                await rootPromptExecutor.appendMessages(toRedactedCoreMessages([{ role: "user", content: modeReminder }], stateHandler.getPrivacyMode()));
              }
              previousMode = currentMode;
            }
            const readPathsBefore = new Set(stateHandler.readPaths);
            const { hasToolCall, responseMessages, toolCallIdentityResolver } = await this.executeStepWithMetrics(ctx, turn, {
              wrappedPromptExecutor: wrappedRootPromptExecutor,
              rootPromptExecutor
            }, stateHandler, toolsGenerator, currentMcpTools, repositoryInfo, requestContext, fileOperationLockManager, onStateUpdate, previousQueuedMessageSource, emptyResponseRetryTurnBudget);
            const toolCallsInStep = responseMessages.filter((message) => message.role === "tool").length;
            totalToolCallsInTurn += toolCallsInStep;
            const assistantMessagesInStep = countAssistantMessages(responseMessages);
            const hasReflectGeneralCall = hasReflectGeneralToolCall(responseMessages, toolCallIdentityResolver);
            if (hasReflectGeneralCall) {
              assistantMessagesSinceLastReflectGeneral = 0;
            } else {
              assistantMessagesSinceLastReflectGeneral += assistantMessagesInStep;
            }
            previousStepCount = turn.steps.length;
            await this.applyPostStepProcessing(ctx, turn, rootPromptExecutor, stateHandler, hasToolCall, responseMessages, onStateUpdate);
            const isLastIteration = step === this.config.maxSteps - 1;
            let updatedTurn = turn;
            let hasQueuedMessages = false;
            let queuedMessageSource = "none";
            let hasQueuedUserTurn = false;
            let updatedMcpTools = currentMcpTools;
            const queuedAction = await this.conversationActionReceiver.peek(ctx);
            if (queuedAction?.action.case === "asyncAskQuestionCompletionAction") {
              logger65.info(ctx, "Found queued AsyncAskQuestionCompletionAction - processing immediately", {
                originalToolCallId: queuedAction.action.value.originalToolCallId
              });
              await this.conversationActionReceiver.pop(ctx);
              const completionAction = queuedAction.action.value;
              const application = await applyAskQuestionCompletion(ctx, {
                action: completionAction,
                stateHandler,
                turn,
                rootPromptExecutor,
                resultFormat: "json-object"
              });
              if (application.outcome === "applied") {
                const syntheticModelCallId = (0, import_node_crypto21.randomUUID)();
                await this.interactionListener.sendUpdate(ctx, RedactedUpdates.toolCallStarted(application.recordedToolCallId, application.toolCall, syntheticModelCallId));
                await this.interactionListener.sendUpdate(ctx, RedactedUpdates.toolCallCompleted(application.recordedToolCallId, application.toolCall, syntheticModelCallId));
                logger65.info(ctx, "Injected async completion into current turn", {
                  originalToolCallId: completionAction.originalToolCallId,
                  resultCase: completionAction.result?.result.case
                });
                totalToolCallsInTurn += 1;
                hasQueuedMessages = true;
                queuedMessageSource = "asyncAskQuestionCompletion";
              } else {
                logger65.info(ctx, "Dropped queued async completion", {
                  originalToolCallId: completionAction.originalToolCallId,
                  outcome: application.outcome
                });
              }
            }
            if (!isLastIteration) {
              const result = await this.consumeQueuedUserMessagesAndMaybeCreateNewTurns(ctx, stateHandler, turn, currentMcpTools, onStateUpdate);
              updatedTurn = result.turn;
              hasQueuedMessages = hasQueuedMessages || result.hasQueuedMessages;
              if (result.hasQueuedMessages) {
                queuedMessageSource = "consumeQueuedUserMessages";
              }
              hasQueuedUserTurn = result.hasQueuedMessages;
              updatedMcpTools = result.mcpTools;
            }
            const crossedReflectReminderThreshold = !hasReflectGeneralCall && assistantMessagesInStep > 0 && Math.floor((assistantMessagesSinceLastReflectGeneral - assistantMessagesInStep) / cliReflectGeneralReminderInterval) < Math.floor(assistantMessagesSinceLastReflectGeneral / cliReflectGeneralReminderInterval);
            const canInjectReflectReminderThisTurn = cliReflectGeneralMaxFollowUpsPerTurn === -1 || cliReflectGeneralFollowUpsSentInTurn < cliReflectGeneralMaxFollowUpsPerTurn;
            if (!isLastIteration && !hasQueuedUserTurn && crossedReflectReminderThreshold && canInjectReflectReminderThisTurn && await this.shouldInjectCliReflectGeneralFollowUp(ctx, stateHandler, turn, toolsGenerator, updatedMcpTools, repositoryInfo, requestContext, fileOperationLockManager)) {
              updatedTurn = await this.createCliReflectGeneralFollowUpTurn(ctx, stateHandler, turn, cliReflectGeneralReminderText, requestContext, onStateUpdate);
              hasQueuedMessages = true;
              queuedMessageSource = "cliReflectGeneralFollowUp";
              cliReflectGeneralFollowUpsSentInTurn += 1;
              logger65.info(ctx, "Injected CLI reflect-general follow-up", {
                assistantMessagesSinceLastReflectGeneral,
                cliReflectGeneralFollowUpsSentInTurn,
                cliReflectGeneralMaxFollowUpsPerTurn
              });
            }
            turn = updatedTurn;
            currentMcpTools = updatedMcpTools;
            const hostRequestedTurnEnd = this.config.isTurnEndRequested?.() === true;
            const hasEnded = !hasToolCall && !hasQueuedMessages || isLastIteration || hostRequestedTurnEnd;
            if (!hasToolCall && !hasQueuedMessages && conflictBarrierInjectionsRemaining > 0 && !isLastIteration && this.config.featureFlags?.enableAgentStoreConflictNotices === true && await this.maybeInjectPreFinalConflictBarrier(ctx, rootPromptExecutor, stateHandler.getPrivacyMode())) {
              conflictBarrierInjectionsRemaining -= 1;
              this.responseComparisonCandidate = void 0;
              continue;
            }
            if (!hasEnded) {
              this.responseComparisonCandidate = void 0;
            } else if (hasToolCall || hasQueuedMessages) {
              this.responseComparisonCandidate = void 0;
              await this.finalizePendingAgentResponseComparison(false);
            }
            if (hasEnded) {
              try {
                finalAssistantMessageCharacterCount = getFinalAssistantMessageCharacterCount(responseMessages);
              } catch (error3) {
                logger65.error(ctx, "Failed to count final assistant message characters", error3);
                finalAssistantMessageCharacterCount = void 0;
              }
              if (this.config.featureFlags?.collectModelUxStats !== false) {
                try {
                  finalAssistantMessageUxStats = getFinalAssistantMessageUxStats(responseMessages);
                } catch (error3) {
                  logger65.error(ctx, "Failed to analyze final assistant message UX stats", error3);
                  finalAssistantMessageUxStats = void 0;
                }
              }
            }
            previousQueuedMessageSource = queuedMessageSource;
            if (hasEnded && stateHandler.backgroundSummarizationPromiseInfo !== null) {
              const backgroundSummarizationPromiseInfo = stateHandler.backgroundSummarizationPromiseInfo;
              const tokenDetails = stateHandler.tokenDetails;
              const isSelfSummary = backgroundSummarizationPromiseInfo.summarizerType === "self";
              const shouldPersistForTokenThreshold = shouldPersistBackgroundSummarization(tokenDetails.usedTokens, tokenDetails.maxTokens, this.config.backgroundSummarizationProps);
              const endOfTurnMessages = fromRedactedCoreMessages(rootPromptExecutor.getMessages(), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
              const imageCountAtTurnEnd = countImagePartsInMessages(endOfTurnMessages);
              const shouldPersistForImageThreshold = imageCountAtTurnEnd >= IMAGE_SUMMARIZATION_TRIGGER_COUNT;
              const shouldPersist = shouldPersistForTokenThreshold || shouldPersistForImageThreshold || persistsWithoutThreshold(backgroundSummarizationPromiseInfo);
              const completedPersistTriggerReason = shouldPersistForImageThreshold ? "approaching_image_limit" : isSelfSummary ? "self_summary_completed" : "threshold_met";
              if (shouldPersist) {
                const persistCompletedSummarization = async () => {
                  if (stateHandler.shouldSuppressSelfSummaryAfterInputLimitFailure(tokenDetails.usedTokens)) {
                    emitSummaryLifecycleDeferred(ctx, backgroundSummarizationPromiseInfo, "self_summary_suppressed_after_input_limit");
                    logger65.info(ctx, "[summarization-discard] At end of turn, suppressing completed self-summary persistence after input-limit failure", {
                      usedTokens: tokenDetails.usedTokens,
                      selfSummaryInputLimitFailureTokenCount: stateHandler.selfSummaryInputLimitFailureTokenCount,
                      imageCountAtTurnEnd,
                      imageThreshold: IMAGE_SUMMARIZATION_TRIGGER_COUNT,
                      shouldPersistForImageThreshold
                    });
                  } else {
                    logger65.info(ctx, "[summarization-persist] At end of turn, background summarization has completed and persistence threshold has been hit. Persisting summarization.", {
                      usedTokens: tokenDetails.usedTokens,
                      maxTokens: tokenDetails.maxTokens,
                      imageCountAtTurnEnd,
                      imageThreshold: IMAGE_SUMMARIZATION_TRIGGER_COUNT,
                      shouldPersistForImageThreshold
                    });
                    await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
                      // Don't wait for the background summarization to complete, but do persist it if it has completed
                      backgroundSummarizationMode: BackgroundSummarizationMode.BackgroundAndPersistIfCompleted,
                      currentInvocationId: stateHandler.lastStepInvocationId,
                      isToolCall: totalToolCallsInTurn > 0,
                      triggerReason: completedPersistTriggerReason,
                      resourceAccessor: this.resourceAccessor
                    });
                  }
                };
                if (stateHandler.backgroundSummarizationHasCompleted) {
                  await persistCompletedSummarization();
                } else {
                  const overageThreshold = getSignificantOverageThreshold(tokenDetails.maxTokens);
                  const shouldBlockForTokenOverage = isSignificantlyOverTokenLimit(tokenDetails);
                  const shouldBlockForImageThreshold = shouldPersistForImageThreshold;
                  if (shouldBlockForTokenOverage || shouldBlockForImageThreshold) {
                    logger65.info(ctx, shouldBlockForImageThreshold ? "[summarization-persist] At end of turn, blocking on background summarization before persistence because image count reached threshold" : "[summarization-persist] At end of turn, blocking on background summarization because token usage significantly exceeds max tokens", {
                      usedTokens: tokenDetails.usedTokens,
                      maxTokens: tokenDetails.maxTokens,
                      overageThreshold,
                      imageCountAtTurnEnd,
                      imageThreshold: IMAGE_SUMMARIZATION_TRIGGER_COUNT,
                      blockedForImageThreshold: shouldBlockForImageThreshold,
                      blockedForTokenOverage: shouldBlockForTokenOverage
                    });
                    await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
                      backgroundSummarizationMode: BackgroundSummarizationMode.WaitForCompletion,
                      currentInvocationId: stateHandler.lastStepInvocationId,
                      isToolCall: totalToolCallsInTurn > 0,
                      triggerReason: shouldBlockForImageThreshold ? "approaching_image_limit" : "significantly_over_token_limit",
                      resourceAccessor: this.resourceAccessor
                    });
                  } else {
                    const holdOutcome = await this.holdForInFlightSummarizationAtTurnEnd(ctx, stateHandler, backgroundSummarizationPromiseInfo);
                    if (holdOutcome === "aborted") {
                      emitSummaryLifecycleAbandoned(ctx, backgroundSummarizationPromiseInfo, "turn_end_hold_aborted");
                      logger65.info(ctx, "[summarization-discard] The turn was cancelled during the turn-end hold; the in-flight background summarization ends with it", {
                        usedTokens: tokenDetails.usedTokens,
                        maxTokens: tokenDetails.maxTokens
                      });
                      throw new ConnectError("User aborted request", Code.Canceled);
                    }
                    if (holdOutcome === "completed") {
                      await persistCompletedSummarization();
                    } else if (holdOutcome === "failed") {
                      logger65.info(ctx, "[summarization-discard] At end of turn, the in-flight background summarization failed during the turn-end hold", {
                        usedTokens: tokenDetails.usedTokens,
                        maxTokens: tokenDetails.maxTokens
                      });
                    } else {
                      if (holdOutcome === "timed_out") {
                        emitSummaryLifecycleAbandoned(ctx, backgroundSummarizationPromiseInfo, "turn_end_hold_timed_out");
                      } else {
                        emitSummaryLifecycleDeferred(ctx, backgroundSummarizationPromiseInfo, "generation_running_at_turn_end");
                      }
                      logger65.info(ctx, "[summarization-discard] At end of turn, persistence threshold is met, but we are discarding background summarization as it has not completed", {
                        usedTokens: tokenDetails.usedTokens,
                        maxTokens: tokenDetails.maxTokens,
                        imageCountAtTurnEnd,
                        imageThreshold: IMAGE_SUMMARIZATION_TRIGGER_COUNT,
                        shouldPersistForImageThreshold,
                        turnEndHoldOutcome: holdOutcome
                      });
                      backgroundSummarizationDiscarded.increment(ctx, 1, {
                        reason: "not_completed",
                        model: backgroundSummarizationPromiseInfo.modelId
                      });
                    }
                  }
                }
              } else {
                if (isSelfSummary) {
                  emitSummaryLifecycleDeferred(ctx, backgroundSummarizationPromiseInfo, "persistence_threshold_not_met");
                  logger65.info(ctx, "[summarization-discard] At end of turn, discarding self-summary as persistence threshold is not met", {
                    usedTokens: tokenDetails.usedTokens,
                    maxTokens: tokenDetails.maxTokens,
                    imageCountAtTurnEnd,
                    imageThreshold: IMAGE_SUMMARIZATION_TRIGGER_COUNT,
                    shouldPersistForImageThreshold,
                    backgroundSummarizationHasCompleted: stateHandler.backgroundSummarizationHasCompleted
                  });
                  backgroundSummarizationDiscarded.increment(ctx, 1, {
                    reason: "self_summary_persist_threshold_not_met",
                    model: backgroundSummarizationPromiseInfo.modelId
                  });
                } else {
                  logger65.info(ctx, "[summarization-discard] At end of turn, we are discarding background summarization as persistence threshold is not met", {
                    usedTokens: tokenDetails.usedTokens,
                    maxTokens: tokenDetails.maxTokens,
                    imageCountAtTurnEnd,
                    imageThreshold: IMAGE_SUMMARIZATION_TRIGGER_COUNT,
                    shouldPersistForImageThreshold,
                    backgroundSummarizationConfig: this.config.backgroundSummarizationProps,
                    backgroundSummarizationHasCompleted: stateHandler.backgroundSummarizationHasCompleted
                  });
                  const completed = stateHandler.backgroundSummarizationHasCompleted;
                  const triggerThreshold = getBackgroundSummarizationTriggerThreshold(tokenDetails.maxTokens, this.config.backgroundSummarizationProps);
                  let reason = completed ? "threshold_not_met_completed" : "threshold_not_met_not_completed";
                  const thresholdSignificantlyGreaterThanUsedTokens = triggerThreshold !== void 0 && tokenDetails.usedTokens < triggerThreshold * 0.6;
                  if (thresholdSignificantlyGreaterThanUsedTokens) {
                    reason = "incorrectly_triggered_summarization";
                  }
                  emitSummaryLifecycleDeferred(ctx, backgroundSummarizationPromiseInfo, thresholdSignificantlyGreaterThanUsedTokens ? "incorrectly_triggered" : "persistence_threshold_not_met");
                  backgroundSummarizationDiscarded.increment(ctx, 1, {
                    reason,
                    model: backgroundSummarizationPromiseInfo.modelId
                  });
                }
              }
            }
            if (hasEnded && stateHandler.backgroundSummarizationPromiseInfo !== null) {
              const backgroundSummarizationPromiseInfo = stateHandler.backgroundSummarizationPromiseInfo;
              const messagesUndergoingSummarization = stateHandler.messagesUndergoingSummarization;
              if (backgroundSummarizationPromiseInfo.kind === "live_generation" && messagesUndergoingSummarization !== null && this.config.conversationId !== void 0) {
                this.config.pendingSummaryStore?.reparkPendingGeneration?.({
                  conversationId: this.config.conversationId,
                  promiseInfo: backgroundSummarizationPromiseInfo,
                  messagesSummarized: messagesUndergoingSummarization
                });
              }
              if (stateHandler.backgroundSummarizationCancellationToken) {
                stateHandler.backgroundSummarizationCancellationToken.cancelled = true;
                stateHandler.backgroundSummarizationCancellationToken.onCancelled?.();
              }
              backgroundSummarizationPromiseInfo.promise.catch((err) => {
                logger65.error(ctx, "Background summarization failed", {
                  error: err,
                  summarizationMode: "unspecified",
                  triggerReason: "unspecified",
                  model: backgroundSummarizationPromiseInfo.modelId
                });
              });
            }
            if (hasEnded && !hasToolCall && !hasQueuedMessages) {
              await this.finalizePendingAgentResponseComparison(true);
            }
            const lastTurn = await stateHandler.turns.at(-1)?.get(ctx);
            if (lastTurn instanceof AgentConversationTurnHandle) {
              const lastStep = await lastTurn.steps.at(-1)?.get(ctx);
              if (lastStep?.message.case === "toolCall" && lastStep.message.value.tool.case === "createPlanToolCall" && lastStep.message.value.tool.value.result?.result?.case === "success") {
                logger65.info(ctx, "Plan created, breaking out of turn loop");
                this.responseComparisonCandidate = void 0;
                await this.cancelPendingAgentResponseComparison();
                break;
              }
            }
            if (hostRequestedTurnEnd) {
              logger65.info(ctx, "Host requested turn end after this step");
              break;
            }
            if (!hasToolCall && !hasQueuedMessages) {
              break;
            }
            if (!this.config.doNotFailOnMaxSteps && isLastIteration) {
              throw new Error("Reached maximum number of steps before turn ended (possible looping?)");
            }
          } finally {
            agentStepCount.increment(ctx, 1, {});
          }
        }
        try {
          const finalTodos = await Promise.all(stateHandler.todos.map((todoRef) => todoRef.get(ctx)));
          const unfinishedTodoCount = finalTodos.filter((todo) => todo.status === TodoStatus.PENDING || todo.status === TodoStatus.IN_PROGRESS).length;
          if (unfinishedTodoCount > 0) {
            unfinishedTodosMetric.increment(ctx, unfinishedTodoCount);
            logger65.info(ctx, "Turn ended with unfinished todos", {
              unfinishedTodoCount
            });
          }
          const eventTracker = getAgentEventTracker(ctx);
          const finalTodoCount = finalTodos.length;
          eventTracker.trackUnfinishedTodos(ctx, {
            unfinishedTodoCount
          });
          if (finalTodoCount > initialTodoCount) {
            const createdTodoCount = finalTodoCount - initialTodoCount;
            eventTracker.trackUnfinishedTodosWhenCreatedTodos(ctx, {
              unfinishedTodoCount,
              createdTodoCount
            });
          }
          if (hadUnfinishedTodosAtStart) {
            eventTracker.trackUnfinishedTodosWhenHadUnfinishedTodosAtStart(ctx, {
              unfinishedTodosAtEnd: unfinishedTodoCount,
              unfinishedTodosAtStart
            });
          }
        } catch (error3) {
          logger65.error(ctx, "Failed to track unfinished todos metric", error3);
        }
        const turnDuration2 = performance.now() - turnStartTime;
        agentTurnDuration.histogram(ctx, turnDuration2);
        agentTurnResult.increment(ctx, 1, {
          outcome: "success",
          newConversation: hadPreviousAssistantMessage ? "false" : "true",
          isauto: getIsAutoFromContext(ctx) ? "true" : "false",
          ispremium: getIsPremiumFromContext(ctx) ? "true" : "false",
          isanysphereteam: getIsAnysphereTeamFromContext(ctx) ? "true" : "false",
          isuserapikey: getIsUserApiKeyFromContext(ctx) ? "true" : "false",
          issubagent: getIsSubagentFromContext(ctx) ? "true" : "false",
          autoroutingreason: getAutoRoutingReasonFromContext(ctx)
        });
        if (finalAssistantMessageCharacterCount !== void 0) {
          try {
            finalAssistantMessageCharacters.histogram(ctx, finalAssistantMessageCharacterCount);
          } catch (error3) {
            logger65.error(ctx, "Failed to record final assistant message character metric", error3);
          }
        }
        if (finalAssistantMessageUxStats !== void 0) {
          try {
            for (const stat9 of FINAL_ASSISTANT_MESSAGE_UX_STAT_NAMES) {
              finalAssistantMessageUxStatsMetric.histogram(ctx, finalAssistantMessageUxStats[stat9], {
                stat: stat9
              });
            }
          } catch (error3) {
            logger65.error(ctx, "Failed to record final assistant message UX stats metric", error3);
          }
        }
        await this.interactionListener.sendUpdate(ctx, RedactedUpdates.stepCompleted(stateHandler.getPrivacyMode(), turn.steps.length, Math.round(turnDuration2)));
        if (this.config.featureFlags?.enablePromptSuggestion) {
          try {
            const userMessageForTools = await turn.userMessage.get(ctx);
            const modeForTools = stateHandler.resolveStepMode(userMessageForTools);
            const toolSetHandleForSuggestion = toolsGenerator({
              resourceAccessor: this.resourceAccessor,
              stateHandler,
              agentSessionId: this.config.agentSessionId,
              mcpTools: currentMcpTools,
              repositoryInfos: repositoryInfo,
              blobStore: stateHandler.getBlobStore(),
              mode: modeForTools,
              loggingContext: ctx,
              requestContext,
              fileOperationLockManager,
              smartModeClassifierMode: this.config.smartModeClassifierMode,
              smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
              autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
            });
            const toolsForSuggestion = toAgentTools(toolSetHandleForSuggestion.getStaticTools(), toolSetHandleForSuggestion.getDescriptionProps());
            const invocationId = getInvocationId(ctx);
            const modelId = this.config.modelId;
            const messagesSnapshot = rootPromptExecutor.getMessages();
            const maxInputTokenCost = this.config.featureFlags?.promptSuggestionMaxInputTokenCost;
            const costChecker = this.config.featureFlags?.getModelInputCostForContext;
            this.interactionListener.enqueuePostTurnEndedWork?.(async () => {
              try {
                await requestPromptSuggestion(ctx, invocationId, modelId, rootPromptExecutor, toUnredactedInteractionListener(this.interactionListener, stateHandler.getPrivacyMode()), toolsForSuggestion, messagesSnapshot, {
                  maxInputTokenCost,
                  getModelInputCostForContext: costChecker
                });
              } catch (err) {
                logger65.error(ctx, "Failed to request prompt suggestion", err);
              }
            });
          } catch (err) {
            logger65.error(ctx, "Failed to setup prompt suggestion", err);
          }
        }
        const getFeedbackRequestDetails = this.config.featureFlags?.getFeedbackRequestDetails;
        if (getFeedbackRequestDetails !== void 0 && !getIsSubagentFromContext(ctx)) {
          const feedbackRequestId = getRequestId(ctx);
          if (feedbackRequestId !== void 0) {
            this.interactionListener.enqueuePostTurnEndedWork?.(async () => {
              try {
                if (!hadPreviousAssistantMessage) {
                  return;
                }
                const feedbackRequestDetails = await getFeedbackRequestDetails({
                  canonicalModelName: this.config.canonicalModelName
                });
                if (feedbackRequestDetails === void 0) {
                  return;
                }
                await this.interactionListener.sendUpdate(ctx, RedactedUpdates.feedbackRequest(feedbackRequestId, this.config.canonicalModelName, stateHandler.getPrivacyMode(), feedbackRequestDetails.categories, feedbackRequestDetails.categoryGroups ?? [], {
                  title: feedbackRequestDetails.title,
                  negativeTitle: feedbackRequestDetails.negativeTitle,
                  commentPlaceholder: feedbackRequestDetails.commentPlaceholder
                }));
              } catch (err) {
                logger65.error(ctx, "Failed to emit feedback request", err);
              }
            });
          }
        }
        agentToolCallsPerTurn.histogram(ctx, totalToolCallsInTurn, {
          outcome: "success",
          ...getClientVersionMetricTagsFromContext(ctx),
          ...getSdkFlavorMetricTagFromContext(ctx),
          "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
        });
        const modelName = this.config.modelId ?? "unknown";
        unifiedHandlerNumberOfToolCalls.histogram(ctx, totalToolCallsInTurn, {
          model: modelName,
          hasFailedToolCalls: turnToolCountingState.hasFailedToolCalls(),
          hasUnexpectedToolCallErrors: turnToolCountingState.hasUnexpectedToolCallErrors(),
          success: "true",
          errorName: "none"
        });
        const eventTrackerForToolCalls = getAgentEventTracker(ctx);
        eventTrackerForToolCalls.trackNumberOfToolCalls(ctx, {
          numberOfToolCalls: totalToolCallsInTurn,
          numberOfFailedToolCalls: turnToolCountingState.getFailedToolCallCount(),
          numberOfUnexpectedToolCallErrors: turnToolCountingState.getUnexpectedToolCallErrorCount(),
          success: true
        });
      } catch (error3) {
        await this.cancelPendingAgentResponseComparison();
        const turnDuration2 = performance.now() - turnStartTime;
        agentTurnDuration.histogram(ctx, turnDuration2);
        let outcome = "error";
        if (ctx.signal.aborted) {
          outcome = "aborted";
        }
        agentTurnResult.increment(ctx, 1, {
          outcome,
          newConversation: hadPreviousAssistantMessage ? "false" : "true",
          isauto: getIsAutoFromContext(ctx) ? "true" : "false",
          ispremium: getIsPremiumFromContext(ctx) ? "true" : "false",
          isanysphereteam: getIsAnysphereTeamFromContext(ctx) ? "true" : "false",
          isuserapikey: getIsUserApiKeyFromContext(ctx) ? "true" : "false",
          issubagent: getIsSubagentFromContext(ctx) ? "true" : "false",
          autoroutingreason: getAutoRoutingReasonFromContext(ctx)
        });
        await this.interactionListener.sendUpdate(ctx, RedactedUpdates.stepCompleted(stateHandler.getPrivacyMode(), turn.steps.length, Math.round(turnDuration2)));
        agentToolCallsPerTurn.histogram(ctx, totalToolCallsInTurn, {
          outcome,
          ...getClientVersionMetricTagsFromContext(ctx),
          ...getSdkFlavorMetricTagFromContext(ctx),
          "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
        });
        const modelName = this.config.modelId ?? "unknown";
        const errorName = error3 instanceof Error ? error3.constructor.name : "unknown";
        unifiedHandlerNumberOfToolCalls.histogram(ctx, totalToolCallsInTurn, {
          model: modelName,
          hasFailedToolCalls: turnToolCountingState.hasFailedToolCalls(),
          hasUnexpectedToolCallErrors: turnToolCountingState.hasUnexpectedToolCallErrors(),
          success: "false",
          errorName
        });
        const eventTrackerForToolCalls = getAgentEventTracker(ctx);
        eventTrackerForToolCalls.trackNumberOfToolCalls(ctx, {
          numberOfToolCalls: totalToolCallsInTurn,
          numberOfFailedToolCalls: turnToolCountingState.getFailedToolCallCount(),
          numberOfUnexpectedToolCallErrors: turnToolCountingState.getUnexpectedToolCallErrorCount(),
          success: false
        });
        throw error3;
      }
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      __disposeResources37(env_5);
    }
  }
  async consumeQueuedUserMessagesAndMaybeCreateNewTurns(ctx, stateHandler, currentTurn, currentMcpTools, onStateUpdate) {
    let turn = currentTurn;
    let hasQueuedMessages = false;
    let mcpTools = currentMcpTools;
    while (true) {
      const queuedAction = await this.conversationActionReceiver.peek(ctx);
      if (queuedAction?.action.case === "asyncAskQuestionCompletionAction") {
        logger65.warn(ctx, "Found AsyncAskQuestionCompletionAction in queue handler - should have been handled by inline handler", {
          originalToolCallId: queuedAction.action.value.originalToolCallId
        });
        break;
      }
      if (queuedAction?.action.case !== "userMessageAction") {
        break;
      }
      const { userMessage: queuedMsg, requestContext: queuedReqContext } = queuedAction.action.value;
      if (!queuedMsg) {
        throw new Error("User message is required");
      }
      let consumedClaimedInjection = false;
      if (this.conversationActionReceiver.peekIsClaimedInjection?.() === true) {
        await this.conversationActionReceiver.pop(ctx);
        consumedClaimedInjection = true;
      }
      const turnMsg = await turn.userMessage.get(ctx);
      const shouldCreateNewTurn = turnMsg.messageId !== queuedMsg.messageId;
      if (!shouldCreateNewTurn || queuedReqContext === void 0) {
        logger65.info(ctx, "Queued user message consumption decision", {
          queuedMessageId: queuedMsg.messageId,
          currentTurnMessageId: turnMsg.messageId,
          decision: shouldCreateNewTurn ? "new_turn_created" : "already_has_turn",
          missingQueuedRequestContext: queuedReqContext === void 0,
          immediatelyUpdateStateOnNewTurn: this.config.immediatelyUpdateStateOnNewTurn,
          fireAndForgetCheckpoints: this.config.fireAndForgetCheckpoints
        });
      }
      if (shouldCreateNewTurn) {
        try {
          ensureUserMessageTiming(queuedMsg);
          const persistedUserMessage = fromRedactedUserMessage2(queuedMsg, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
          if (consumedClaimedInjection) {
            persistedUserMessage.turnSteer = true;
          }
          await this.interactionListener.sendUpdate(ctx, RedactedUpdates.userMessageAppended(consumedClaimedInjection ? toRedactedUserMessage2(persistedUserMessage, stateHandler.getPrivacyMode()) : queuedMsg));
          turn = await stateHandler.createAgentTurn(ctx, persistedUserMessage, queuedReqContext ? fromRedactedRequestContext(queuedReqContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : new RequestContext(), this.config, this.resourceAccessor);
        } catch (error3) {
          if (consumedClaimedInjection) {
            this.conversationActionReceiver.failConsumedInjectionDelivery?.();
          }
          throw error3;
        }
        hasQueuedMessages = true;
        if (this.config.immediatelyUpdateStateOnNewTurn) {
          if (this.config.fireAndForgetCheckpoints) {
            void stateHandler.computeNewStructure(ctx).then(async (newState) => {
              if (onStateUpdate) {
                await onStateUpdate(ctx, newState);
              }
            }).catch((error3) => {
              logger65.error(ctx, "Failed to persist checkpoint after creating queued turn", {
                error: error3
              });
            });
          } else {
            const newState = await stateHandler.computeNewStructure(ctx);
            if (onStateUpdate) {
              await onStateUpdate(ctx, newState);
            }
          }
        }
      }
      if (!consumedClaimedInjection) {
        await this.conversationActionReceiver.pop(ctx);
      }
      const unredactedTools = queuedReqContext?.tools?.map((t) => fromRedactedMcpToolDefinition(t, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)) ?? [];
      mcpTools = this.mergeRequestContextTools(currentMcpTools, unredactedTools);
    }
    return { turn, hasQueuedMessages, mcpTools };
  }
  async shouldInjectCliReflectGeneralFollowUp(ctx, stateHandler, turn, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager) {
    if (this.config.featureFlags?.enableCliReflectGeneralTool !== true) {
      return false;
    }
    const userMessage = await turn.userMessage.get(ctx);
    const mode = stateHandler.resolveStepMode(userMessage);
    return toolsGenerator({
      resourceAccessor: this.resourceAccessor,
      stateHandler,
      agentSessionId: this.config.agentSessionId,
      mcpTools,
      repositoryInfos: repositoryInfo,
      blobStore: stateHandler.getBlobStore(),
      mode,
      loggingContext: ctx,
      requestContext,
      fileOperationLockManager,
      smartModeClassifierMode: this.config.smartModeClassifierMode,
      smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
      autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
    }).hasTool("REFLECT_GENERAL");
  }
  /**
   * Force sync-and-peek at turn-end; on a surviving conflict inject a
   * prompt-only reminder and ack. Returns true when a reminder was injected.
   * Never throws.
   */
  async maybeInjectPreFinalConflictBarrier(ctx, rootPromptExecutor, privacyMode) {
    let executor;
    try {
      executor = this.resourceAccessor.get(agentStoreConflictNoticeExecutorResource);
    } catch {
      executor = void 0;
    }
    if (executor === void 0) {
      return false;
    }
    const isAbortSignalAborted = () => ctx.signal?.aborted === true;
    if (isAbortSignalAborted()) {
      return false;
    }
    const releaseConflictNoticeEvents = async (eventIds) => {
      if (eventIds.length === 0) {
        return;
      }
      try {
        await conflictNoticeRelease(executor, ctx, eventIds, this.config.conversationId !== void 0 ? { conversationId: this.config.conversationId } : void 0);
      } catch (releaseError) {
        logger65.warn(ctx, "Conflict barrier release failed", {
          error: releaseError
        });
      }
    };
    try {
      const result = await conflictNoticeSyncAndPeek(executor, ctx, {
        ...this.config.conversationId !== void 0 ? { conversationId: this.config.conversationId } : {}
      });
      const timedOut = result.kind === "timed-out" ? "true" : "false";
      if (result.kind === "mount-passive") {
        agentStoreConflictBarrier.increment(ctx, 1, {
          outcome: "mount_passive",
          timed_out: timedOut
        });
        return false;
      }
      const reminder = result.kind === "completed" || result.kind === "timed-out" ? result.reminder : void 0;
      const eventIds = result.kind === "completed" || result.kind === "timed-out" ? result.events.map((event) => event.eventId) : [];
      if (isAbortSignalAborted()) {
        await releaseConflictNoticeEvents(eventIds);
        return false;
      }
      if (reminder === void 0 || reminder.length === 0) {
        agentStoreConflictBarrier.increment(ctx, 1, {
          outcome: "checked",
          timed_out: timedOut
        });
        return false;
      }
      const sanitizedReminder = sanitizeSystemReminderContent(reminder);
      try {
        await rootPromptExecutor.appendMessages(toRedactedCoreMessages([
          {
            role: "user",
            content: `<system_reminder>
${sanitizedReminder}
</system_reminder>`
          }
        ], privacyMode));
      } catch (error3) {
        await releaseConflictNoticeEvents(eventIds);
        throw error3;
      }
      try {
        await conflictNoticeAck(executor, ctx, eventIds, this.config.conversationId !== void 0 ? { conversationId: this.config.conversationId } : void 0);
      } catch (error3) {
        logger65.warn(ctx, "Conflict barrier ack failed", { error: error3 });
        await releaseConflictNoticeEvents(eventIds);
      }
      agentStoreConflictBarrier.increment(ctx, 1, {
        outcome: "rescued",
        timed_out: timedOut
      });
      logger65.info(ctx, "Local-sync conflict turn-end barrier injected", {
        eventCount: eventIds.length,
        timedOut: result.kind === "timed-out"
      });
      return true;
    } catch (error3) {
      agentStoreConflictBarrier.increment(ctx, 1, {
        outcome: "error",
        timed_out: "false"
      });
      logger65.warn(ctx, "Conflict turn-end barrier failed", { error: error3 });
      return false;
    }
  }
  async createCliReflectGeneralFollowUpTurn(ctx, stateHandler, _turn, reminderText, requestContext, onStateUpdate) {
    const syntheticUserMessage = new UserMessage({
      text: reminderText,
      messageId: (0, import_node_crypto21.randomUUID)(),
      isSimulatedMsg: true
    });
    ensureUserMessageTiming(syntheticUserMessage);
    await this.interactionListener.sendUpdate(ctx, toRedactedInteractionUpdate(Updates.userMessageAppended(syntheticUserMessage), stateHandler.getPrivacyMode()));
    const newTurn = await stateHandler.createAgentTurn(ctx, syntheticUserMessage, requestContext, this.config, this.resourceAccessor);
    if (this.config.immediatelyUpdateStateOnNewTurn) {
      if (this.config.fireAndForgetCheckpoints) {
        void stateHandler.computeNewStructure(ctx).then(async (newState) => {
          if (onStateUpdate) {
            await onStateUpdate(ctx, newState);
          }
        }).catch((error3) => {
          logger65.error(ctx, "Failed to persist checkpoint after creating CLI reflect-general follow-up turn", { error: error3 });
        });
      } else {
        const newState = await stateHandler.computeNewStructure(ctx);
        if (onStateUpdate) {
          await onStateUpdate(ctx, newState);
        }
      }
    }
    return newTurn;
  }
  async shouldDeferProactiveCompaction(ctx, tokenDetails) {
    const shouldDefer = this.config.shouldDeferProactiveCompaction;
    if (shouldDefer === void 0 || isSignificantlyOverTokenLimit(tokenDetails)) {
      return false;
    }
    try {
      const deferred = await shouldDefer(ctx, tokenDetails);
      if (deferred) {
        logger65.info(ctx, "[cloud-summarization] Deferring proactive compaction while a background summarization is in flight", {
          usedTokens: tokenDetails.usedTokens,
          maxTokens: tokenDetails.maxTokens
        });
      }
      return deferred;
    } catch (error3) {
      logger65.warn(ctx, "[cloud-summarization] Proactive compaction deferral check failed; compacting", { error: error3 });
      return false;
    }
  }
  /**
   * Detect that the tokenDetails restored with this request predate a
   * compaction, and mark them stale
   * ({@link ConversationStateHandle.tokenDetailsStaleAfterSummarization})
   * before the turn-start trigger can act on them.
   *
   * When a compaction persists after the last model call of a turn, nothing
   * refreshes usage before the turn ends, so the next request arrives
   * carrying pre-compaction counts. Trusting them makes the turn-start
   * trigger launch a summarization whose snapshot is the just-compacted,
   * near-empty conversation — a billed generation that summarizes a summary
   * and compacts nothing. Staleness is determined structurally (has any
   * model call run since the recorded compaction boundary? — see
   * {@link computeRestoredTokenStaleness}); the first model response of this
   * turn replaces the counts with real usage and clears the flag.
   */
  markRestoredTokenDetailsStaleAfterCompaction(ctx, stateHandler, rootPromptExecutor) {
    if (this.config.maxSteps === 1) {
      return;
    }
    if (stateHandler.tokenDetailsStaleAfterSummarization) {
      return;
    }
    const tokenDetails = stateHandler.tokenDetails;
    const messages = rootPromptExecutor.getMessages();
    const wouldLaunchForRestoredCounts = this.orchestrator.shouldStartBackgroundSummarization(tokenDetails, messages, ctx);
    if (!wouldLaunchForRestoredCounts) {
      return;
    }
    const stale = computeRestoredTokenStaleness({
      messages,
      messageCountAtLastCompaction: stateHandler.messageCountAtLastCompaction
    });
    if (!stale) {
      return;
    }
    stateHandler.tokenDetailsStaleAfterSummarization = true;
    logger65.info(ctx, "[summarization-trigger] Restored token details predate the last compaction (no model call since); suppressing turn-start trigger until fresh usage arrives", {
      restoredUsedTokens: tokenDetails.usedTokens,
      maxTokens: tokenDetails.maxTokens,
      messageCountAtLastCompaction: stateHandler.messageCountAtLastCompaction,
      messageCount: messages.length
    });
  }
  /**
   * Keeps the turn open for the host-configured bound so an in-flight
   * background summary can land instead of dying with the turn. Presence is
   * flipped to idle first, so the hold is not rendered as the agent working.
   */
  async holdForInFlightSummarizationAtTurnEnd(ctx, stateHandler, promiseInfo) {
    const hold = this.config.turnEndSummaryHold;
    const holdDisabled = hold === void 0 || hold.maxWaitMs <= 0;
    if (holdDisabled) {
      return "skipped";
    }
    if (ctx.signal.aborted) {
      return "aborted";
    }
    const labels = {
      model: promiseInfo.modelId,
      summarizer: promiseInfo.summarizerType
    };
    logger65.info(ctx, "[summarization-persist] At end of turn, holding the turn open for the in-flight background summarization", { maxWaitMs: hold.maxWaitMs, ...labels });
    try {
      hold.onHoldStart?.(ctx);
    } catch (error3) {
      logger65.warn(ctx, "Turn-end summarization hold start hook failed", {
        error: error3
      });
    }
    const startedAt = performance.now();
    const waitEnd = await settledAbortedOrTimedOut(promiseInfo.promise, ctx.signal, hold.maxWaitMs);
    const waitedMs = performance.now() - startedAt;
    const generationFailed = stateHandler.backgroundSummarizationPromiseInfo === null;
    const generationLanded = stateHandler.backgroundSummarizationPromiseInfo === promiseInfo && stateHandler.backgroundSummarizationHasCompleted;
    let outcome;
    if (waitEnd === "aborted") {
      outcome = "aborted";
    } else if (generationFailed) {
      outcome = "failed";
    } else if (generationLanded) {
      outcome = "completed";
    } else {
      outcome = waitEnd === "timed_out" ? "timed_out" : "failed";
    }
    backgroundSummarizationTurnEndHoldMs.histogram(ctx, waitedMs, {
      outcome,
      ...labels
    });
    logger65.info(ctx, "[summarization-persist] Turn-end hold for background summarization ended", {
      outcome,
      waitedMs: Math.round(waitedMs),
      ...labels
    });
    return outcome;
  }
  /**
   * Adopt a completed summary stashed by a previous turn of this
   * conversation.
   *
   * Background generations regularly outlive the turn that launched them:
   * end-of-turn disposal drops the in-memory handle while the stream runs to
   * completion, and the (fully billed) result historically had nowhere to go.
   * The orchestrator stashes such results in the backend-provided
   * pending-summary store; here — before this turn's first model call — we
   * validate the stash against the current conversation and, when it still
   * byte-matches, re-hydrate it as a completed background summarization and
   * persist it through the normal persist path. On any mismatch or error we
   * fall through to today's behavior (the trigger machinery regenerates).
   */
  async maybeAdoptPendingSummary(ctx, stateHandler, rootPromptExecutor, requestContext) {
    const store = this.config.pendingSummaryStore;
    const conversationId = this.config.conversationId;
    if (store === void 0 || conversationId === void 0) {
      return;
    }
    if (this.config.maxSteps === 1) {
      return;
    }
    if (stateHandler.backgroundSummarizationPromiseInfo !== null) {
      return;
    }
    const pendingGeneration = store.claimPendingGeneration?.(conversationId);
    if (pendingGeneration !== void 0) {
      const { promiseInfo, messagesSummarized } = pendingGeneration;
      stateHandler.setBackgroundSummarizationState(promiseInfo, messagesSummarized, {
        cancelled: false
      });
      return;
    }
    let adoptedModelId = "unknown";
    try {
      const currentMessages = rootPromptExecutor.getMessages();
      const adoption = await takePendingSummaryForAdoption({
        ctx,
        store,
        conversationId,
        privacyMode: stateHandler.getPrivacyMode(),
        currentMessages,
        stillWarrantsCompaction: (record3) => {
          if (persistsWithoutThreshold(record3)) {
            return true;
          }
          const tokenDetails = stateHandler.tokenDetails;
          const backgroundSummarizationProps = {
            ...this.config.backgroundSummarizationProps,
            usedTokensThresholdToStartBackgroundSummarization: record3.usedTokensThresholdToStartBackgroundSummarization ?? this.config.backgroundSummarizationProps.usedTokensThresholdToStartBackgroundSummarization,
            usedTokensThresholdToPersistBackgroundSummarization: record3.usedTokensThresholdToPersistBackgroundSummarization ?? this.config.backgroundSummarizationProps.usedTokensThresholdToPersistBackgroundSummarization
          };
          return shouldPersistBackgroundSummarization(tokenDetails.usedTokens, tokenDetails.maxTokens, backgroundSummarizationProps) || shouldStartBackgroundSummarization(record3.startUsedTokens, record3.startMaxTokens, backgroundSummarizationProps) || countImagePartsInMessages(fromRedactedCoreMessages(currentMessages, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)) >= IMAGE_SUMMARIZATION_TRIGGER_COUNT;
        }
      });
      if (adoption === void 0) {
        return;
      }
      const { record: record2, result, prefixMessages } = adoption;
      adoptedModelId = record2.modelId;
      if (record2.summarizerType === "self") {
        result.onPersisted = () => stateHandler.incrementSelfSummaryCount();
      }
      stateHandler.setBackgroundSummarizationState({
        kind: "pending_adoption",
        promise: Promise.resolve(result),
        modelId: record2.modelId,
        summarizerType: record2.summarizerType,
        startInvocationId: record2.startInvocationId,
        startUsedTokens: record2.startUsedTokens,
        startMaxTokens: record2.startMaxTokens,
        triggerReason: record2.triggerReason,
        lifecycle: record2.summaryLifecycleId === void 0 ? void 0 : resumeSummaryLifecycle({
          summaryLifecycleId: record2.summaryLifecycleId,
          summarizationModelId: record2.modelId,
          mainModelId: this.config.modelId,
          summarizerType: record2.summarizerType
        })
      }, prefixMessages, { cancelled: false });
      stateHandler.setBackgroundSummarizationHasCompleted(0);
      const persistedSummary = await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
        backgroundSummarizationMode: BackgroundSummarizationMode.BackgroundAndPersistIfCompleted,
        triggerReason: "pending_summary_adopted",
        currentInvocationId: stateHandler.lastStepInvocationId,
        resourceAccessor: this.resourceAccessor
      });
      const persisted = persistedSummary !== void 0;
      pendingSummaryAdoption.increment(ctx, 1, {
        model: record2.modelId,
        outcome: persisted ? "adopted" : "persist_declined"
      });
      logger65.info(ctx, persisted ? "[summarization-adopt] Adopted pending summary" : "[summarization-adopt] Pending summary passed validation but was not persisted", {
        model: record2.modelId,
        summarizerType: record2.summarizerType,
        messagesSummarizedCount: record2.messagesSummarizedCount,
        stashAgeMs: Date.now() - record2.createdAtMs
      });
    } catch (error3) {
      pendingSummaryAdoption.increment(ctx, 1, {
        model: adoptedModelId,
        outcome: "error"
      });
      logger65.warn(ctx, "[summarization-adopt] Failed to adopt pending summary; falling back to normal behavior", { error: error3 });
      stateHandler.clearBackgroundSummarizationState();
    }
  }
  mergeRequestContextTools(existingTools, requestContextTools) {
    const mergedTools = [...existingTools];
    for (const maybeRedTool of requestContextTools) {
      const tool = "_privacyMode" in maybeRedTool ? fromRedactedMcpToolDefinition(maybeRedTool, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : maybeRedTool;
      const exists = mergedTools.some((t) => t.name === tool.name);
      if (!exists) {
        mergedTools.push({
          name: tool.name,
          providerIdentifier: tool.providerIdentifier,
          toolName: tool.toolName,
          description: tool.description,
          inputSchema: mcpInputSchemaToJson(tool),
          clientKey: tool.providerIdentifier
        });
      }
    }
    return mergedTools;
  }
  async executeStepWithMetrics(ctx, turn, executors, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, onStateUpdate, previousQueuedMessageSource, emptyResponseRetryTurnBudget) {
    const { result, stepToolCountingState, toolCallIdentityResolver } = await this.executeStepWithCommonMetrics(ctx, turn, executors, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, (innerCtx, wrappedPromptExecutor, maxOutputTokenRetryDebug) => this.runStep(innerCtx, turn, wrappedPromptExecutor, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, onStateUpdate, previousQueuedMessageSource, maxOutputTokenRetryDebug), emptyResponseRetryTurnBudget);
    return {
      ...result,
      stepToolCountingState,
      toolCallIdentityResolver
    };
  }
  async buildStepSummarizationContext(ctx, turn, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager) {
    const userMessage = await turn.userMessage.get(ctx);
    const { tools, extraT, descriptionProps, toolSetHandle } = await buildSummarizationToolContext({
      ctx,
      config: this.config,
      toolsGenerator,
      resourceAccessor: this.resourceAccessor,
      stateHandler,
      mode: stateHandler.resolveStepMode(userMessage),
      mcpTools,
      repositoryInfos: repositoryInfo,
      requestContext,
      fileOperationLockManager,
      contextInjectionSignal: this.conversationActionReceiver.getContextInjectionToolSignal?.()
    });
    return {
      tools,
      extraT,
      descriptionProps,
      toolCallIdentityResolver: toolSetHandle
    };
  }
  recordStepToolCallMetrics(ctx, stepToolCountingState) {
    const baseParallelToolCallTags = {
      hasFailedToolCalls: stepToolCountingState.hasFailedToolCalls(),
      hasUnexpectedToolCallErrors: stepToolCountingState.hasUnexpectedToolCallErrors(),
      success: "true",
      errorName: "none"
    };
    numberOfParallelToolCalls.histogram(ctx, stepToolCountingState.toolCallCount, baseParallelToolCallTags);
    if (stepToolCountingState.toolCallCount > 0) {
      numberOfParallelToolCallsWithAtLeastOneCall.histogram(ctx, stepToolCountingState.toolCallCount, {
        ...baseParallelToolCallTags,
        ...getClientVersionMetricTagsFromContext(ctx),
        "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
      });
    }
  }
  async executeStepWithCommonMetrics(ctx, turn, executors, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, runStep, emptyResponseRetryTurnBudget) {
    const stepToolCountingState = new ToolCountingStateTracker();
    const stepToolCountingMiddleware = createToolCountingMiddleware(stepToolCountingState);
    const stepWrappedExecutor = stepToolCountingMiddleware(executors.wrappedPromptExecutor);
    const { tools, extraT, descriptionProps, toolCallIdentityResolver } = await this.buildStepSummarizationContext(ctx, turn, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager);
    const result = await this.runWithSummarizationRetry(ctx, stateHandler, executors.rootPromptExecutor, requestContext, tools, extraT, descriptionProps, (innerCtx) => this.runWithMaxTokensRetry(innerCtx, executors.rootPromptExecutor, (retryCtx, maxOutputTokenRetryDebug) => runStep(retryCtx, stepWrappedExecutor, maxOutputTokenRetryDebug), emptyResponseRetryTurnBudget));
    this.recordStepToolCallMetrics(ctx, stepToolCountingState);
    return {
      result,
      stepToolCountingState,
      tools,
      toolCallIdentityResolver
    };
  }
  async applyPostStepProcessing(ctx, turn, rootPromptExecutor, stateHandler, hasToolCall, responseMessages, onStateUpdate) {
    if (hasToolCall && this.config.reminders && this.config.reminders.length > 0) {
      const currentTodos = await Promise.all(stateHandler.todos.map((t) => t.get(ctx)));
      stateHandler.assertRootPromptBlobsLoadedForFullPromptRead();
      const conversationMessages = fromRedactedCoreMessages(rootPromptExecutor.getMessages(), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      await applyRemindersToToolResults(responseMessages, this.config.reminders, currentTodos.map((t) => fromRedactedTodoItem(t, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)), conversationMessages);
    }
    if (shouldTagToolCallIdsForCurrentContext(ctx)) {
      appendToolCallIdTagsToToolResults(responseMessages);
    }
    turn.appendPromptMessages(toRedactedCoreMessages(responseMessages, stateHandler.getPrivacyMode()));
    if (this.config.messageHistoryModifier) {
      stateHandler.assertRootPromptBlobsLoadedForFullPromptRead();
      const currentMessages = fromRedactedCoreMessages(rootPromptExecutor.getMessages(), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      const modifiedHistory = this.config.messageHistoryModifier(currentMessages);
      if (modifiedHistory) {
        stateHandler.invalidateRootPromptPrefix();
        rootPromptExecutor.clearMessages();
        rootPromptExecutor.appendMessages(toRedactedCoreMessages(modifiedHistory, stateHandler.getPrivacyMode()));
      }
    }
    let persisted = Promise.resolve();
    if (this.config.fireAndForgetCheckpoints) {
      persisted = stateHandler.computeNewStructure(ctx).then(async (currentState) => {
        await onStateUpdate(ctx, currentState);
      }).catch((error3) => {
        logger65.error(ctx, "Failed to persist checkpoint after step", {
          error: error3
        });
      });
    } else {
      const currentState = await stateHandler.computeNewStructure(ctx);
      await onStateUpdate(ctx, currentState);
    }
    this.config.afterStepCheckpoint?.(ctx, persisted);
  }
  async setupStep(ctx, stateHandler, turn) {
    const setupStepStartMs = performance.now();
    const userMessage = await turn.userMessage.get(ctx);
    if (stateHandler.mode === void 0) {
      stateHandler.setMode(stateHandler.resolveTurnMode(userMessage));
    }
    const fileOperationLockManager = new FileOperationLockManager();
    ctx.get(cloudAgentTurnPrepGlueMsRecorderKey)?.("setupStepMs", performance.now() - setupStepStartMs);
    return { fileOperationLockManager };
  }
  async runSingleStep(parentCtx, rootPromptExecutor, stateHandler, turn, toolsGenerator, mcpTools, repositoryInfo, requestContext, onStateUpdate) {
    const env_6 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource37(env_6, createSpan(parentCtx.withName("runSingleStep")), false);
      const ctx = span.ctx;
      const { fileOperationLockManager } = await this.setupStep(ctx, stateHandler, turn);
      try {
        const { hasToolCall, responseMessages } = await this.executeStepWithMetrics(ctx, turn, {
          wrappedPromptExecutor: rootPromptExecutor,
          rootPromptExecutor
        }, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, onStateUpdate);
        await this.applyPostStepProcessing(ctx, turn, rootPromptExecutor, stateHandler, hasToolCall, responseMessages, onStateUpdate);
        return { hasToolCall };
      } finally {
        agentStepCount.increment(ctx, 1, {});
      }
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      __disposeResources37(env_6);
    }
  }
  async buildToolExecutionContext(ctx, stateHandler, toolCallRecorder, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, allowedToolNames, admittedEffectiveToolName) {
    const invocationId = getInvocationId(ctx);
    if (stateHandler.mode === void 0) {
      throw new Error("stateHandler.mode must be set before building tool execution context");
    }
    const mode = stateHandler.mode;
    const toolSetHandle = this.config.toolsGenerator({
      resourceAccessor: this.resourceAccessor,
      stateHandler,
      agentSessionId: this.config.agentSessionId,
      mcpTools,
      repositoryInfos: repositoryInfo,
      blobStore: stateHandler.getBlobStore(),
      mode,
      loggingContext: ctx,
      requestContext,
      fileOperationLockManager,
      smartModeClassifierMode: this.config.smartModeClassifierMode,
      smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
      autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
    });
    const modelVisibleTools = toolSetHandle.getStaticTools();
    const scopedModelVisibleTools = allowedToolNames === void 0 ? modelVisibleTools : modelVisibleTools.filter((tool) => allowedToolNames.has(tool.name) || tool.name === admittedEffectiveToolName);
    const toolExecutionSet = toolSetHandle.getToolExecutionSet(scopedModelVisibleTools);
    const executableTools = getExecutableTools(toolExecutionSet);
    const directDynamicToolNames = getDirectDynamicToolNames(toolExecutionSet);
    const toolMap = {};
    for (const tool of executableTools) {
      toolMap[tool.name] = tool;
    }
    const renderProps = {
      allTools: extractToolMetadataMap(executableTools)
    };
    const userAutoRunInstructions = await this.getUserPermissionsFileAutoRunInstructions(ctx, requestContext);
    const projectAutoRunInstructions = this.getProjectPermissionsFileAutoRunInstructions(requestContext);
    const extraT = {
      repositoryInfos: repositoryInfo,
      shouldQueryProd: requestContext.repositoryInfoShouldQueryProd,
      stateHandler,
      strictArgParsing: this.config.strictArgParsing === true,
      modelVendor: this.config.modelInfo?.vendor,
      enableToolArgPreservation: this.config.enableToolArgPreservation === true,
      enableHookAdditionalContext: this.config.featureFlags?.enableHookAdditionalContext === true,
      enableAgentStoreConflictNoticeCollector: this.config.featureFlags?.enableAgentStoreConflictNotices === true,
      enableAgentStoreConflictNotices: this.config.featureFlags?.enableAgentStoreConflictNotices === true,
      writeBarrierTimeoutMs: this.resolveWriteBarrierTimeoutMs(),
      onWriteBarrier: this.config.recordAgentStoreWriteBarrier,
      workspacePaths: requestContext.env?.workspacePaths,
      userAutoRunInstructions,
      projectAutoRunInstructions,
      cursorRules: getAllRules(requestContext, this.config.nonFileRules, this.config.featureFlags),
      agentSkills: requestContext.agentSkills ?? [],
      contextInjectionSignal: this.conversationActionReceiver.getContextInjectionToolSignal?.()
    };
    const interactionHandler = new InteractionHandler(toUnredactedInteractionListener(this.interactionListener, stateHandler.getPrivacyMode()), toolCallRecorder, invocationId, void 0, this.config.thinkingStyle, resolveAgentSingleMessageLoopDetection(this.config), this.createAfterAgentThoughtCallback(invocationId, requestContext));
    return {
      toolMap,
      interactionHandler,
      extraT,
      renderProps,
      directDynamicToolNames,
      recordToolCallResult: interactionHandler.recordToolCallResult.bind(interactionHandler)
    };
  }
  async buildDeferredToolExecutionContext(ctx, descriptor2, stateHandler, mcpTools, splitStepData, requestContext, fileOperationLockManager, logMessage) {
    const lastTurnRef = stateHandler.turns[stateHandler.turns.length - 1];
    if (!lastTurnRef) {
      throw new Error("No turns in conversation state");
    }
    const turn = await lastTurnRef.get(ctx);
    if (!(turn instanceof AgentConversationTurnHandle)) {
      throw new Error("Expected last turn to be an agent turn");
    }
    const { stateHandler: splitStateHandler, toolCallRecorder, stateOps } = createSplitStepStateHandler(stateHandler, turn);
    const allowedToolNames = splitStepData.allowedToolNames ? new Set(splitStepData.allowedToolNames) : void 0;
    const admittedEffectiveToolName = getAdmittedEffectiveToolName(descriptor2, allowedToolNames);
    const mergedMcpTools = this.mergeRequestContextTools(mcpTools, requestContext.tools);
    const executionContext = await this.buildToolExecutionContext(ctx, splitStateHandler, toolCallRecorder, mergedMcpTools, requestContext.repositoryInfo, requestContext, fileOperationLockManager, allowedToolNames, admittedEffectiveToolName);
    if (allowedToolNames !== void 0 && !allowedToolNames.has(descriptor2.toolName) && !executionContext.directDynamicToolNames.has(getEffectiveToolCallName(descriptor2))) {
      logger65.warn(ctx, logMessage, {
        toolCallId: descriptor2.toolCallId,
        toolName: descriptor2.toolName,
        allowedToolCount: allowedToolNames.size
      });
    }
    splitStepData.stepReadPathDedup ??= /* @__PURE__ */ new Set();
    executionContext.extraT.stepReadPathDedup = splitStepData.stepReadPathDedup;
    return {
      stateOps,
      ...executionContext
    };
  }
  async runModelStep(parentCtx, rootPromptExecutor, stateHandler, turn, toolsGenerator, mcpTools, repositoryInfo, requestContext, onStateUpdate) {
    const env_7 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource37(env_7, createSpan(parentCtx.withName("runModelStep")), false);
      const ctx = span.ctx;
      const { fileOperationLockManager } = await this.setupStep(ctx, stateHandler, turn);
      const { toolCallDescriptors, responseMessages, availableToolNames, steerPreemptedIdleSample } = await this.executeModelStepWithMetrics(ctx, turn, {
        wrappedPromptExecutor: rootPromptExecutor,
        rootPromptExecutor
      }, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, onStateUpdate);
      return {
        toolCallDescriptors,
        splitStepData: {
          modelResponseMessages: responseMessages,
          requestContext,
          allowedToolNames: availableToolNames,
          ...steerPreemptedIdleSample === true ? { steerPreemptedIdleSample: true } : {}
        }
      };
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      __disposeResources37(env_7);
    }
  }
  async executeToolCall(ctx, descriptor2, stateHandler, mcpTools, splitStepData, requestContext, fileOperationLockManager) {
    const { stateOps, toolMap, interactionHandler, extraT, recordToolCallResult, renderProps, directDynamicToolNames } = await this.buildDeferredToolExecutionContext(ctx, descriptor2, stateHandler, mcpTools, splitStepData, requestContext, fileOperationLockManager, "Rejected deferred split-step tool call outside model-visible tool allowlist");
    const resultMessage = await executeDeferredToolCall(ctx, descriptor2, toolMap, interactionHandler, extraT, recordToolCallResult, renderProps, void 0, void 0, directDynamicToolNames);
    return {
      toolCallId: descriptor2.toolCallId,
      resultMessage,
      stateOps
    };
  }
  async prepareSubagent(ctx, descriptor2, stateHandler, mcpTools, splitStepData, requestContext, fileOperationLockManager) {
    const { toolMap, extraT } = await this.buildDeferredToolExecutionContext(ctx, descriptor2, stateHandler, mcpTools, splitStepData, requestContext, fileOperationLockManager, "Rejected deferred split-step subagent preparation outside model-visible tool allowlist");
    const effectiveToolName = getEffectiveToolCallName(descriptor2);
    const tool = toolMap[effectiveToolName];
    if (tool === void 0) {
      throw new Error(`Tool not found: ${effectiveToolName}`);
    }
    if (tool.prepareSubagent === void 0) {
      throw new Error(`Tool does not support subagent preparation: ${effectiveToolName}`);
    }
    return await tool.prepareSubagent(ctx, getEffectiveToolCallArgs(descriptor2), {
      toolCallId: descriptor2.toolCallId,
      ...extraT
    });
  }
  async finalizeStep(parentCtx, splitStepData, toolCallResults, rootPromptExecutor, stateHandler, onStateUpdate) {
    const env_8 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource37(env_8, createSpan(parentCtx.withName("finalizeStep")), false);
      const ctx = span.ctx;
      const lastTurnRef = stateHandler.turns[stateHandler.turns.length - 1];
      if (!lastTurnRef) {
        return {
          state: await stateHandler.computeNewStructure(ctx),
          hasToolCall: false
        };
      }
      const turn = await lastTurnRef.get(ctx);
      if (!(turn instanceof AgentConversationTurnHandle)) {
        throw new Error("Expected last turn to be an agent turn");
      }
      const responseMessages = [
        ...splitStepData.modelResponseMessages,
        ...toolCallResults.map((r) => r.resultMessage)
      ];
      const hasToolCall = toolCallResults.length > 0;
      for (const stateOp of conversationStateOpsInReplayOrder(toolCallResults)) {
        await applyConversationStateOp(ctx, stateHandler, turn, stateOp);
      }
      try {
        await this.applyPostStepProcessing(ctx, turn, rootPromptExecutor, stateHandler, hasToolCall, responseMessages, onStateUpdate);
        const state = await stateHandler.computeNewStructure(ctx);
        return { state, hasToolCall };
      } finally {
        agentStepCount.increment(ctx, 1, {});
      }
    } catch (e_8) {
      env_8.error = e_8;
      env_8.hasError = true;
    } finally {
      __disposeResources37(env_8);
    }
  }
  async executeModelStepWithMetrics(ctx, turn, executors, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, onStateUpdate) {
    const { result, tools } = await this.executeStepWithCommonMetrics(ctx, turn, executors, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, (innerCtx, wrappedPromptExecutor, maxOutputTokenRetryDebug) => this.runModelOnlyStep(innerCtx, turn, wrappedPromptExecutor, stateHandler, toolsGenerator, mcpTools, repositoryInfo, requestContext, fileOperationLockManager, onStateUpdate, maxOutputTokenRetryDebug));
    return {
      ...result,
      availableToolNames: tools.map((tool) => tool.name)
    };
  }
  async runModelOnlyStep(parentCtx, turn, rootPromptExecutor, stateHandler, toolsGenerator, mcpTools, repositoryInfos, requestContext, fileOperationLockManager, onStateUpdate, maxOutputTokenRetryDebug) {
    const env_9 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource37(env_9, createSpan(parentCtx.withName("runModelOnlyStep")), false);
      const ctx = spanCtxt.ctx;
      const invocationId = getInvocationId(ctx);
      stateHandler.lastStepInvocationId = invocationId;
      spanCtxt.span.setAttribute("invocationId", invocationId);
      logger65.info(ctx, "Running model-only step");
      const stepSetupStart = performance.now();
      const isFirstStep = turn.steps.length === 0;
      const isResponseComparisonFirstModelStep = !this.responseComparisonModelStepStarted;
      this.responseComparisonModelStepStarted = true;
      const interactionHandler = new InteractionHandler(toUnredactedInteractionListener(this.interactionListener, stateHandler.getPrivacyMode()), turn, invocationId, void 0, this.config.thinkingStyle, resolveAgentSingleMessageLoopDetection(this.config), this.createAfterAgentThoughtCallback(invocationId, requestContext));
      const userMessage = await turn.userMessage.get(ctx);
      const mode = stateHandler.resolveStepMode(userMessage);
      const toolsBuildStartMs = performance.now();
      const toolSetHandle = toolsGenerator({
        resourceAccessor: this.resourceAccessor,
        stateHandler,
        agentSessionId: this.config.agentSessionId,
        mcpTools,
        repositoryInfos,
        blobStore: stateHandler.getBlobStore(),
        mode,
        loggingContext: ctx,
        requestContext,
        fileOperationLockManager,
        smartModeClassifierMode: this.config.smartModeClassifierMode,
        smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
        autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
      });
      ctx.get(cloudAgentTurnPrepGlueMsRecorderKey)?.("toolsBuildMs", performance.now() - toolsBuildStartMs);
      const initialMessages = fromRedactedCoreMessages(rootPromptExecutor.getMessages(), PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      if (isFirstStep) {
        warnIfLongTrailingUserMessageRun(ctx, initialMessages, invocationId);
        firstStepSetupDuration.histogram(ctx, performance.now() - stepSetupStart);
      }
      trackPromptTokenUsage({
        ctx,
        mcpTools,
        requestContext,
        messages: initialMessages,
        selectedContext: userMessage.selectedContext,
        userInfoDisplayOptions: this.config.userInfoDisplayOptions,
        agentTokenLimit: this.config.agentTokenLimit,
        readToolName: toolSetHandle.getTool("READ")?.name,
        invocationId,
        modelInfo: this.config.modelInfo,
        featureFlags: this.config.featureFlags,
        stateHandler,
        mcpMetaToolServerCount: getToolSetMcpMetaToolServerCount(toolSetHandle)
      });
      let responseComparisonMessages = this.config.agentResponseComparison === void 0 ? void 0 : [...initialMessages];
      let responseComparisonTools = this.config.agentResponseComparison === void 0 ? void 0 : Object.freeze(toAgentTools(toolSetHandle.getStaticTools(), toolSetHandle.getDescriptionProps()));
      if (isResponseComparisonFirstModelStep && responseComparisonMessages !== void 0 && responseComparisonTools !== void 0) {
        await this.preparePendingAgentResponseComparison({
          ctx,
          parentInvocationId: invocationId,
          messages: responseComparisonMessages,
          tools: responseComparisonTools,
          privacyMode: stateHandler.getPrivacyMode()
        });
      }
      const [cancellableStreamCtx, cancelStream] = ctx.withCancel();
      const idleSamplePreempter = createIdleModelSamplePreempter(this.conversationActionReceiver.getContextInjectionToolSignal?.(), cancelStream);
      const streamCtx = idleSamplePreempter === void 0 ? cancellableStreamCtx : withModelStreamChunkObserver(cancellableStreamCtx, (type2) => idleSamplePreempter.observeChunk(type2));
      idleSamplePreempter?.start();
      let result;
      try {
        result = rootPromptExecutor.executeModelStreamOnly(streamCtx, stateHandler, interactionHandler, toolSetHandle.getToolExecutionSet(), toolSetHandle.getDescriptionProps(), void 0);
      } catch (error3) {
        idleSamplePreempter?.stop();
        await this.cancelPendingAgentResponseComparison();
        throw error3;
      }
      const isCloudAgentSingleStep = this.config.maxSteps === 1;
      const tokenDetails = stateHandler.tokenDetails;
      const shouldSuppressSelfSummaryAfterInputLimitFailure = stateHandler.shouldSuppressSelfSummaryAfterInputLimitFailure(tokenDetails.usedTokens);
      const shouldStartBg = !isCloudAgentSingleStep && !stateHandler.tokenDetailsStaleAfterSummarization && !shouldSuppressSelfSummaryAfterInputLimitFailure && this.orchestrator.shouldStartBackgroundSummarization(tokenDetails, rootPromptExecutor.getMessages(), ctx);
      if (shouldStartBg) {
        const wouldMeetPersistThreshold = shouldPersistBackgroundSummarization(tokenDetails.usedTokens, tokenDetails.maxTokens, this.config.backgroundSummarizationProps);
        logger65.info(ctx, "Mid-loop background summarization trigger (model-stream-only): checking persist threshold", {
          usedTokens: tokenDetails.usedTokens,
          maxTokens: tokenDetails.maxTokens,
          unusedTokens: tokenDetails.maxTokens - tokenDetails.usedTokens,
          wouldMeetPersistThreshold,
          triggerThreshold: getBackgroundSummarizationTriggerThreshold(tokenDetails.maxTokens, this.config.backgroundSummarizationProps),
          backgroundSummarizationConfig: this.config.backgroundSummarizationProps,
          persistConfig: {
            unusedTokensThreshold: this.config.backgroundSummarizationProps.unusedTokensThresholdToPersistBackgroundSummarization,
            unusedPercentTokensThreshold: this.config.backgroundSummarizationProps.unusedPercentTokensThresholdToPersistBackgroundSummarization
          }
        });
        await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
          backgroundSummarizationMode: BackgroundSummarizationMode.Background,
          settledMessageCount: initialMessages.length,
          triggerReason: "approaching_token_limit",
          currentInvocationId: invocationId,
          resourceAccessor: this.resourceAccessor,
          tools: toolSetHandle.getStaticTools(),
          descriptionProps: toolSetHandle.getDescriptionProps(),
          extraT: {
            repositoryInfos,
            shouldQueryProd: requestContext.repositoryInfoShouldQueryProd,
            stateHandler,
            modelVendor: this.config.modelInfo?.vendor,
            enableToolArgPreservation: this.config.enableToolArgPreservation === true,
            enableHookAdditionalContext: this.config.featureFlags?.enableHookAdditionalContext === true,
            enableAgentStoreConflictNoticeCollector: this.config.featureFlags?.enableAgentStoreConflictNotices === true,
            enableAgentStoreConflictNotices: this.config.featureFlags?.enableAgentStoreConflictNotices === true,
            writeBarrierTimeoutMs: this.resolveWriteBarrierTimeoutMs(),
            onWriteBarrier: this.config.recordAgentStoreWriteBarrier,
            workspacePaths: requestContext.env?.workspacePaths,
            userAutoRunInstructions: await this.getUserPermissionsFileAutoRunInstructions(ctx, requestContext),
            projectAutoRunInstructions: this.getProjectPermissionsFileAutoRunInstructions(requestContext),
            cursorRules: getAllRules(requestContext, this.config.nonFileRules, this.config.featureFlags),
            agentSkills: requestContext.agentSkills ?? []
          },
          automationTriggerContext: this.getAutomationTriggerContext(rootPromptExecutor.getMessages())
        });
      }
      let response;
      let extendedUsage;
      let usage;
      let toolCallDescriptors;
      let finalInvocationId;
      const finishPreemptedSample = async (preempter, rejectedAfterCancel) => {
        await this.cancelPendingAgentResponseComparison();
        const preemptedAfterMs = preempter.preemptedAfterMs ?? 0;
        logger65.info(ctx, "Model sample preempted by pending steer", {
          invocationId,
          phase: preempter.phase,
          preemptedAfterMs,
          rejectedAfterCancel,
          graceMs: this.conversationActionReceiver.getContextInjectionToolSignal?.()?.idleModelSamplePreemption?.graceMs
        });
        steerIdleSamplePreempted.increment(ctx, 1, { phase: preempter.phase });
        steerIdleSamplePreemptedAfterMs.histogram(ctx, preemptedAfterMs);
        return {
          toolCallDescriptors: [],
          responseMessages: [],
          steerPreemptedIdleSample: true
        };
      };
      try {
        [response, extendedUsage, usage, toolCallDescriptors, finalInvocationId] = await Promise.all([
          result.response,
          result.extendedUsage,
          result.usage,
          result.toolCallDescriptors,
          result.invocationId,
          interactionHandler.consumeStream(streamCtx, this.tapAgentResponseComparisonWarmup(ctx, result.fullStream, responseComparisonMessages, responseComparisonTools), turn)
        ]);
      } catch (error3) {
        if (idleSamplePreempter?.preempted === true) {
          return await finishPreemptedSample(idleSamplePreempter, true);
        }
        await this.cancelPendingAgentResponseComparison();
        throw error3;
      } finally {
        idleSamplePreempter?.stop();
      }
      if (idleSamplePreempter?.preempted === true) {
        return await finishPreemptedSample(idleSamplePreempter, false);
      }
      if (finalInvocationId !== invocationId) {
        logger65.error(ctx, "Invocation ID mismatch. Bug in executeModelStreamOnly", void 0, {
          initialInvocationId: invocationId,
          finalInvocationId
        });
      }
      logger65.info(ctx, "Setting token details for client token ring (model-stream-only)", {
        usedTokens: usage.totalTokens,
        maxTokens: extendedUsage.maxTokens,
        inputTokens: extendedUsage.inputTokens,
        outputTokens: extendedUsage.outputTokens,
        cacheReadTokens: extendedUsage.cacheReadTokens,
        cacheWriteTokens: extendedUsage.cacheWriteTokens
      });
      const promptContextDetails = nextRedactedPromptContextDetails(ctx, this.config, stateHandler, {
        messages: initialMessages,
        tools: toolSetHandle.getStaticTools(),
        descriptionProps: toolSetHandle.getDescriptionProps(),
        totalUsedTokens: usage.totalTokens,
        maxTokens: extendedUsage.maxTokens
      });
      stateHandler.setTokenDetails(createRedactedConversationTokenDetails(stateHandler.getPrivacyMode(), {
        usedTokens: usage.totalTokens,
        maxTokens: extendedUsage.maxTokens,
        breakdown: promptContextDetails.breakdown,
        promptContextUsageTree: promptContextDetails.promptContextUsageTree
      }));
      if (response.error || ctx.signal.aborted) {
        await this.cancelPendingAgentResponseComparison();
        if (this.config.skipErrorStateCheckpoint !== true) {
          turn.appendPromptMessages(toRedactedCoreMessages(response.messages, stateHandler.getPrivacyMode()));
          const currentState = await stateHandler.computeNewStructure(ctx);
          if (onStateUpdate) {
            await onStateUpdate(ctx, currentState);
          }
        }
        throw response.error ?? new ConnectError("User aborted request", Code.Canceled);
      }
      stateHandler.addTurnUsage({
        inputTokens: extendedUsage.inputTokens,
        outputTokens: extendedUsage.outputTokens,
        cacheReadTokens: extendedUsage.cacheReadTokens,
        cacheWriteTokens: extendedUsage.cacheWriteTokens,
        reasoningTokens: extendedUsage.reasoningTokens
      });
      const hasSendMessageCapability = toolSetHandle.getTool("SEND_MESSAGE") !== void 0;
      await this.maybeRetryProjectCoordinatorWithoutSendMessage({
        ctx,
        turn,
        hasToolCall: toolCallDescriptors.length > 0,
        hasSendMessageCapability,
        isSimulatedUserMessage: userMessage.isSimulatedMsg === true,
        visibilityReminderAlreadyInjected: hasSendMessageCapability && hasProjectSendMessageReminderForCurrentRequest(initialMessages),
        mode,
        maxOutputTokenRetryDebug
      });
      if (toolCallDescriptors.length === 0 && responseComparisonMessages !== void 0 && responseComparisonTools !== void 0) {
        try {
          await this.enqueueAgentResponseComparisonIfEligible({
            ctx,
            parentInvocationId: finalInvocationId,
            responseMessages: response.messages,
            messages: responseComparisonMessages,
            tools: responseComparisonTools,
            privacyMode: stateHandler.getPrivacyMode()
          });
        } finally {
          responseComparisonMessages = void 0;
          responseComparisonTools = void 0;
        }
      }
      if (toolCallDescriptors.length === 0) {
        await this.finalizePendingAgentResponseComparison(true);
      }
      return {
        toolCallDescriptors,
        responseMessages: response.messages
      };
    } catch (e_9) {
      env_9.error = e_9;
      env_9.hasError = true;
    } finally {
      __disposeResources37(env_9);
    }
  }
};

