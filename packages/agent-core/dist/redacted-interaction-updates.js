/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-core/dist/redacted-interaction-updates.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedContextInjectionStateValue(privacyMode, state) {
  const _privacyMode = privacyMode;
  switch (state.kind) {
    case "queued":
      return {
        _privacyMode,
        state: { case: "queued", value: { _privacyMode } }
      };
    case "delivered":
      return {
        _privacyMode,
        state: {
          case: "delivered",
          value: {
            _privacyMode,
            step: state.step,
            deliveryBatchId: state.deliveryBatchId,
            deliveredAtMs: BigInt(state.deliveredAtMs)
          }
        }
      };
    case "queued_for_next_turn":
      return {
        _privacyMode,
        state: { case: "queuedForNextTurn", value: { _privacyMode } }
      };
    case "cancelled":
      return {
        _privacyMode,
        state: { case: "cancelled", value: { _privacyMode } }
      };
    case "rejected":
      return {
        _privacyMode,
        state: {
          case: "rejected",
          value: { _privacyMode, reason: state.reason }
        }
      };
  }
}
var RedactedUpdates = {
  textDelta(text2, messageStartedAtMs) {
    const privacyMode = text2.__privacyMode;
    return {
      _privacyMode: privacyMode,
      messageStartedAtMs,
      message: {
        case: "textDelta",
        value: { _privacyMode: privacyMode, text: text2, isServerNotice: false }
      }
    };
  },
  toolCallStarted(callId, toolCall, modelCallId) {
    const privacyMode = toolCall._privacyMode;
    return {
      _privacyMode: privacyMode,
      messageStartedAtMs: toolCall.startedAtMs,
      message: {
        case: "toolCallStarted",
        value: { _privacyMode: privacyMode, callId, toolCall, modelCallId }
      }
    };
  },
  toolCallCompleted(callId, toolCall, modelCallId) {
    const privacyMode = toolCall._privacyMode;
    return {
      _privacyMode: privacyMode,
      messageStartedAtMs: toolCall.startedAtMs,
      message: {
        case: "toolCallCompleted",
        value: { _privacyMode: privacyMode, callId, toolCall, modelCallId }
      }
    };
  },
  toolCallDelta(callId, toolCallDelta, modelCallId, messageStartedAtMs) {
    const privacyMode = toolCallDelta._privacyMode;
    return {
      _privacyMode: privacyMode,
      messageStartedAtMs,
      message: {
        case: "toolCallDelta",
        value: {
          _privacyMode: privacyMode,
          callId,
          toolCallDelta,
          modelCallId
        }
      }
    };
  },
  thinkingDelta(text2, thinkingStyle, messageStartedAtMs) {
    const privacyMode = text2.__privacyMode;
    return {
      _privacyMode: privacyMode,
      messageStartedAtMs,
      message: {
        case: "thinkingDelta",
        value: { _privacyMode: privacyMode, text: text2, thinkingStyle }
      }
    };
  },
  thinkingCompleted(privacyMode, thinkingDurationMs, messageStartedAtMs) {
    return {
      _privacyMode: privacyMode,
      messageStartedAtMs,
      message: {
        case: "thinkingCompleted",
        value: { _privacyMode: privacyMode, thinkingDurationMs }
      }
    };
  },
  userMessageAppended(userMessage2) {
    const privacyMode = userMessage2._privacyMode;
    return {
      _privacyMode: privacyMode,
      messageStartedAtMs: userMessage2.startedAtMs,
      message: {
        case: "userMessageAppended",
        value: { _privacyMode: privacyMode, userMessage: userMessage2 }
      }
    };
  },
  partialToolCall(callId, toolCall, modelCallId, argsTextDelta) {
    const privacyMode = toolCall._privacyMode;
    return {
      _privacyMode: privacyMode,
      messageStartedAtMs: toolCall.startedAtMs,
      message: {
        case: "partialToolCall",
        value: {
          _privacyMode: privacyMode,
          callId,
          toolCall,
          modelCallId,
          argsTextDelta
        }
      }
    };
  },
  tokenDelta(privacyMode, tokens) {
    return {
      _privacyMode: privacyMode,
      message: {
        case: "tokenDelta",
        value: { _privacyMode: privacyMode, tokens }
      }
    };
  },
  summary(summary) {
    const privacyMode = summary.__privacyMode;
    return {
      _privacyMode: privacyMode,
      message: {
        case: "summary",
        value: { _privacyMode: privacyMode, summary }
      }
    };
  },
  summaryStarted(privacyMode) {
    return {
      _privacyMode: privacyMode,
      message: {
        case: "summaryStarted",
        value: { _privacyMode: privacyMode }
      }
    };
  },
  heartbeat(privacyMode) {
    return {
      _privacyMode: privacyMode,
      message: {
        case: "heartbeat",
        value: { _privacyMode: privacyMode }
      }
    };
  },
  contextInjectionState(privacyMode, injectionId, state) {
    return {
      _privacyMode: privacyMode,
      message: {
        case: "contextInjectionState",
        value: {
          _privacyMode: privacyMode,
          injectionId,
          state: toRedactedContextInjectionStateValue(privacyMode, state)
        }
      }
    };
  },
  summaryCompleted(privacyMode, hookMessage, failed2) {
    return {
      _privacyMode: privacyMode,
      message: {
        case: "summaryCompleted",
        value: { _privacyMode: privacyMode, hookMessage, failed: failed2 }
      }
    };
  },
  shellOutputDelta(privacyMode, event) {
    return {
      _privacyMode: privacyMode,
      message: {
        case: "shellOutputDelta",
        value: { _privacyMode: privacyMode, event }
      }
    };
  },
  turnEnded(privacyMode, usage) {
    var _a19;
    return {
      _privacyMode: privacyMode,
      message: {
        case: "turnEnded",
        value: Object.assign({ _privacyMode: privacyMode }, usage && {
          inputTokens: BigInt(usage.inputTokens),
          outputTokens: BigInt(usage.outputTokens),
          cacheReadTokens: BigInt(usage.cacheReadTokens),
          cacheWriteTokens: BigInt(usage.cacheWriteTokens),
          reasoningTokens: BigInt((_a19 = usage.reasoningTokens) !== null && _a19 !== void 0 ? _a19 : 0)
        })
      }
    };
  },
  stepStarted(privacyMode, stepId) {
    return {
      _privacyMode: privacyMode,
      message: {
        case: "stepStarted",
        value: { _privacyMode: privacyMode, stepId: BigInt(stepId) }
      }
    };
  },
  stepCompleted(privacyMode, stepId, stepDurationMs) {
    return {
      _privacyMode: privacyMode,
      message: {
        case: "stepCompleted",
        value: {
          _privacyMode: privacyMode,
          stepId: BigInt(stepId),
          stepDurationMs: BigInt(stepDurationMs)
        }
      }
    };
  },
  promptSuggestion(suggestion) {
    const privacyMode = suggestion.__privacyMode;
    return {
      _privacyMode: privacyMode,
      message: {
        case: "promptSuggestion",
        value: { _privacyMode: privacyMode, suggestion }
      }
    };
  },
  activeBranchChange(path31, branchName) {
    const privacyMode = path31.__privacyMode;
    return {
      _privacyMode: privacyMode,
      message: {
        case: "activeBranchChange",
        value: { _privacyMode: privacyMode, path: path31, branchName }
      }
    };
  },
  feedbackRequest(requestId2, canonicalModelName, privacyMode, categories, categoryGroups = [], copy = {}) {
    const toRedactedCategory = (category) => ({
      _privacyMode: privacyMode,
      id: category.id,
      label: category.label
    });
    return {
      _privacyMode: privacyMode,
      message: {
        case: "feedbackRequest",
        value: {
          _privacyMode: privacyMode,
          requestId: requestId2,
          canonicalModelName,
          categories: categories.map(toRedactedCategory),
          categoryGroups: categoryGroups.map((group) => ({
            _privacyMode: privacyMode,
            id: group.id,
            prompt: group.prompt,
            categories: group.categories.map(toRedactedCategory)
          })),
          // Deprecated proto field; servers no longer populate it.
          showFormImmediately: false,
          title: copy.title,
          negativeTitle: copy.negativeTitle,
          commentPlaceholder: copy.commentPlaceholder
        }
      }
    };
  }
};

