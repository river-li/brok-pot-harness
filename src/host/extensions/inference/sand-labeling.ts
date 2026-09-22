init_errors();
init_cursor_inference();
var SAND_AGENT_MODE = "sand-agent";
function createSandLabelingClient(options2) {
  const client = createSandCursorBackendClient(InferenceService, options2);
  return {
    recordFollowupClassification: (request5) => client.recordAgentFollowupClassification(request5),
    recordPostTurnLabeling: (request5) => client.recordAgentPostTurnLabeling(request5)
  };
}
var lastRequestIdByConversation = /* @__PURE__ */ new Map();
function logLabelingError(label, error42) {
  reportHostDiagnostic({
    kind: "labeling_failed",
    stage: label,
    errorClass: errorLogTag(error42)
  });
}
function recordSandFollowupLabeling(client, args) {
  const { conversationId, requestId: requestId2, modelName, messages: messages2 } = args;
  if (messages2.length === 0 || messages2.some(
    (message) => message.providerOptions?.cursor?.inferenceReason === "agent-summarization"
  )) {
    return;
  }
  if (conversationId.trim() === "" || requestId2.trim() === "") {
    return;
  }
  const previous = lastRequestIdByConversation.get(conversationId);
  if (previous?.requestId === requestId2) {
    return;
  }
  if (previous != null && args.turnSeq < previous.turnSeq) {
    return;
  }
  lastRequestIdByConversation.set(conversationId, { requestId: requestId2, turnSeq: args.turnSeq });
  if (args.advanceChainOnly === true) {
    return;
  }
  if (previous == null) {
    return;
  }
  try {
    const request5 = new AgentFollowupCategorizationRequest({
      requestId: requestId2,
      replyingToRequestId: previous.requestId,
      messages: messages2.map((msg) => coreMessageToProto(msg)),
      conversationId,
      agentMode: SAND_AGENT_MODE,
      modelName
    });
    void client.recordFollowupClassification(request5).catch((error42) => {
      logLabelingError("followup_classification", error42);
    });
  } catch (error42) {
    logLabelingError("followup_classification_prepare", error42);
  }
}
function recordSandPostTurnLabeling(client, args) {
  if (args.messages.length === 0) {
    return;
  }
  if (args.requestId.trim() === "" || args.conversationId.trim() === "") {
    return;
  }
  try {
    const request5 = new AgentPostTurnLabelingRequest({
      requestId: args.requestId,
      messages: args.messages.map((msg) => coreMessageToProto(msg)),
      conversationId: args.conversationId,
      agentMode: SAND_AGENT_MODE,
      modelName: args.modelName
    });
    void client.recordPostTurnLabeling(request5).catch((error42) => {
      logLabelingError("post_turn_labeling", error42);
    });
  } catch (error42) {
    logLabelingError("post_turn_labeling_prepare", error42);
  }
}
