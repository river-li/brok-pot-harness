var logger62 = createLogger("@anysphere/agent/ask-question-completion");
function isValidAskQuestionCompletion(action) {
  const resultCase = action.result?.result.case;
  return action.originalToolCallId.length > 0 && (resultCase === "success" || resultCase === "rejected" || resultCase === "error");
}
function hasAppliedAskQuestionCompletion(stateHandler, originalToolCallId) {
  return originalToolCallId.length > 0 && stateHandler.hasCompletedAskQuestion(originalToolCallId);
}
async function applyAskQuestionCompletion(ctx, args) {
  const { action, stateHandler, turn, rootPromptExecutor, resultFormat } = args;
  const originalToolCallId = action.originalToolCallId;
  if (!isValidAskQuestionCompletion(action)) {
    logger62.warn(ctx, "Dropping invalid ask_question completion", {
      originalToolCallId,
      resultCase: action.result?.result.case
    });
    return { outcome: "invalid" };
  }
  if (originalToolCallId.length > 0 && stateHandler.hasCompletedAskQuestion(originalToolCallId)) {
    logger62.info(ctx, "Dropping duplicate ask_question completion (already applied)", {
      originalToolCallId
    });
    return { outcome: "already-applied" };
  }
  const syntheticArgs = action.originalArgs ? createRedactedAskQuestionArgs(action._privacyMode, {
    title: action.originalArgs.title,
    questions: action.originalArgs.questions,
    asyncOriginalToolCallId: originalToolCallId
  }) : void 0;
  const syntheticToolCall = createRedactedAskQuestionToolCall(action._privacyMode, {
    args: syntheticArgs,
    result: action.result
  });
  const recordedToolCallId = originalToolCallId.length > 0 ? originalToolCallId : (0, import_node_crypto30.randomUUID)();
  const promptToolCallId = (0, import_node_crypto30.randomUUID)();
  const toolCall = createRedactedToolCall(action._privacyMode, {
    toolCallId: recordedToolCallId,
    tool: {
      case: "askQuestionToolCall",
      value: syntheticToolCall
    }
  });
  const argsPlainObject = {
    title: action.originalArgs?.title?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) ?? "",
    questions: action.originalArgs?.questions.map((q2) => ({
      id: q2.id,
      prompt: q2.prompt.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
      allow_multiple: q2.allowMultiple,
      options: q2.options.map((opt) => ({
        id: opt.id,
        label: opt.label.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)
      }))
    })) ?? [],
    async_original_tool_call_id: originalToolCallId
  };
  const assistantMessage = {
    role: "assistant",
    content: [
      {
        type: "tool-call",
        toolCallId: promptToolCallId,
        toolName: "ask_question",
        args: argsPlainObject
      }
    ]
  };
  const toolMessage = {
    role: "tool",
    content: [
      {
        type: "tool-result",
        toolCallId: promptToolCallId,
        toolName: "ask_question",
        result: formatCompletionResult(action, resultFormat)
      }
    ]
  };
  const promptMessages = toRedactedCoreMessages([assistantMessage, toolMessage], stateHandler.getPrivacyMode());
  await turn.upsertToolCall(ctx, toolCall, recordedToolCallId);
  rootPromptExecutor.appendMessages(promptMessages);
  if (originalToolCallId.length > 0 && shouldReceiptAskQuestionResult(action.result ? fromRedactedAskQuestionResult(action.result, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0)) {
    stateHandler.markAskQuestionCompleted(originalToolCallId);
  }
  return {
    outcome: "applied",
    recordedToolCallId,
    toolCall,
    promptMessages
  };
}
function formatCompletionResult(action, resultFormat) {
  if (resultFormat === "formatted-string") {
    return action.result ? formatAskQuestionResultAsString(fromRedactedAskQuestionResult(action.result, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)) : "Unknown error";
  }
  let resultPlainObject;
  if (action.result?.result.case === "success") {
    resultPlainObject = {
      success: {
        answers: action.result.result.value.answers.map((a) => ({
          question_id: a.questionId,
          selected_option_ids: a.selectedOptionIds,
          freeform_text: a.freeformText.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)
        }))
      }
    };
  } else if (action.result?.result.case === "rejected") {
    resultPlainObject = {
      rejected: {
        reason: action.result.result.value.reason.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)
      }
    };
  } else if (action.result?.result.case === "error") {
    resultPlainObject = {
      error: {
        error_message: action.result.result.value.errorMessage.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)
      }
    };
  } else {
    resultPlainObject = {};
  }
  return JSON.stringify(resultPlainObject);
}
