/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-core/dist/interaction-updates.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_agent_pb();
var Updates = {
  textDelta(text2, messageStartedAtMs) {
    return new InteractionUpdate({
      messageStartedAtMs,
      message: {
        case: "textDelta",
        value: new TextDeltaUpdate({ text: text2 })
      }
    });
  },
  toolCallStarted(callId, toolCall, modelCallId) {
    return new InteractionUpdate({
      messageStartedAtMs: toolCall.startedAtMs,
      message: {
        case: "toolCallStarted",
        value: new ToolCallStartedUpdate({ callId, toolCall, modelCallId })
      }
    });
  },
  toolCallCompleted(callId, toolCall, modelCallId) {
    return new InteractionUpdate({
      messageStartedAtMs: toolCall.startedAtMs,
      message: {
        case: "toolCallCompleted",
        value: new ToolCallCompletedUpdate({ callId, toolCall, modelCallId })
      }
    });
  },
  toolCallDelta(callId, toolCallDelta, modelCallId, messageStartedAtMs) {
    return new InteractionUpdate({
      messageStartedAtMs,
      message: {
        case: "toolCallDelta",
        value: new ToolCallDeltaUpdate({
          callId,
          toolCallDelta,
          modelCallId
        })
      }
    });
  },
  thinkingDelta(text2, thinkingStyle, messageStartedAtMs) {
    return new InteractionUpdate({
      messageStartedAtMs,
      message: {
        case: "thinkingDelta",
        value: new ThinkingDeltaUpdate({ text: text2, thinkingStyle })
      }
    });
  },
  thinkingCompleted(thinkingDurationMs, messageStartedAtMs) {
    return new InteractionUpdate({
      messageStartedAtMs,
      message: {
        case: "thinkingCompleted",
        value: new ThinkingCompletedUpdate({ thinkingDurationMs })
      }
    });
  },
  userMessageAppended(userMessage2) {
    return new InteractionUpdate({
      messageStartedAtMs: userMessage2.startedAtMs,
      message: {
        case: "userMessageAppended",
        value: new UserMessageAppendedUpdate({ userMessage: userMessage2 })
      }
    });
  },
  partialToolCall(callId, toolCall, modelCallId) {
    return new InteractionUpdate({
      messageStartedAtMs: toolCall.startedAtMs,
      message: {
        case: "partialToolCall",
        value: new PartialToolCallUpdate({ callId, toolCall, modelCallId })
      }
    });
  },
  tokenDelta(tokens) {
    return new InteractionUpdate({
      message: {
        case: "tokenDelta",
        value: new TokenDeltaUpdate({ tokens })
      }
    });
  },
  summary(summary) {
    return new InteractionUpdate({
      message: {
        case: "summary",
        value: new SummaryUpdate({ summary })
      }
    });
  },
  summaryStarted() {
    return new InteractionUpdate({
      message: {
        case: "summaryStarted",
        value: new SummaryStartedUpdate()
      }
    });
  },
  heartbeat() {
    return new InteractionUpdate({
      message: {
        case: "heartbeat",
        value: new HeartbeatUpdate()
      }
    });
  },
  summaryCompleted(hookMessage, failed2) {
    return new InteractionUpdate({
      message: {
        case: "summaryCompleted",
        value: new SummaryCompletedUpdate({ hookMessage, failed: failed2 })
      }
    });
  },
  shellOutputDelta(event) {
    return new InteractionUpdate({
      message: {
        case: "shellOutputDelta",
        value: new ShellOutputDeltaUpdate({ event })
      }
    });
  },
  turnEnded(usage) {
    var _a19;
    return new InteractionUpdate({
      message: {
        case: "turnEnded",
        value: new TurnEndedUpdate(usage ? {
          inputTokens: BigInt(usage.inputTokens),
          outputTokens: BigInt(usage.outputTokens),
          cacheReadTokens: BigInt(usage.cacheReadTokens),
          cacheWriteTokens: BigInt(usage.cacheWriteTokens),
          reasoningTokens: BigInt((_a19 = usage.reasoningTokens) !== null && _a19 !== void 0 ? _a19 : 0)
        } : {})
      }
    });
  },
  stepStarted(stepId) {
    return new InteractionUpdate({
      message: {
        case: "stepStarted",
        value: new StepStartedUpdate({ stepId: BigInt(stepId) })
      }
    });
  },
  stepCompleted(stepId, stepDurationMs) {
    return new InteractionUpdate({
      message: {
        case: "stepCompleted",
        value: new StepCompletedUpdate({
          stepId: BigInt(stepId),
          stepDurationMs: BigInt(stepDurationMs)
        })
      }
    });
  },
  promptSuggestion(suggestion) {
    return new InteractionUpdate({
      message: {
        case: "promptSuggestion",
        value: new PromptSuggestionUpdate({ suggestion })
      }
    });
  },
  activeBranchChange(path31, branchName) {
    return new InteractionUpdate({
      message: {
        case: "activeBranchChange",
        value: new ActiveBranchChange({ path: path31, branchName })
      }
    });
  },
  feedbackRequest(requestId2, canonicalModelName, categories, categoryGroups = [], copy = {}) {
    return new InteractionUpdate({
      message: {
        case: "feedbackRequest",
        value: new FeedbackRequestUpdate({
          requestId: requestId2,
          canonicalModelName,
          categories: [...categories],
          categoryGroups: [...categoryGroups],
          title: copy.title,
          negativeTitle: copy.negativeTitle,
          commentPlaceholder: copy.commentPlaceholder
        })
      }
    });
  }
};

