/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/cursor-inference-session.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_agent_service_pb();
init_requested_model_pb();
init_agent_model();
init_sand_agent_model();
init_cursor_inference();
function createSandRequestedModelFromSelection(selection) {
  return new RequestedModel({
    modelId: selection.modelId,
    maxMode: selection.maxMode,
    parameters: selection.parameters.map(
      (parameter) => new RequestedModel_ModelParameterValue({
        id: parameter.id,
        value: parameter.value
      })
    )
  });
}
function createSandDefaultRequestedModel() {
  return createSandRequestedModelFromSelection(SAND_DEFAULT_MODEL_SELECTION);
}
function createSandSubagentRequestedModel(modelId) {
  return new RequestedModel({ modelId, maxMode: false });
}
function createSandComputerUseRequestedModel(modelId) {
  return createSandRequestedModelFromSelection({
    ...SAND_COMPUTER_USE_MODEL_SELECTION,
    modelId
  });
}
function createSandAttachedMediaUrlProvider(options2) {
  const client = createSandCursorBackendClient(AgentService, options2);
  return {
    getSignedUrlForAttachedMedia: async (ctx, request5) => {
      const response = await client.getSignedUrlForAttachedMedia(
        new GetSignedUrlForAttachedMediaRequest({
          conversationId: request5.conversationId,
          key: request5.key,
          mimeType: request5.mimeType,
          contentLengthBytes: request5.contentLengthBytes !== void 0 ? BigInt(request5.contentLengthBytes) : void 0
        }),
        { signal: ctx.signal }
      );
      return {
        key: response.key,
        putUrl: response.putUrl,
        getUrl: response.getUrl,
        expiresAtUnixMs: response.expiresAtUnixMs,
        refreshAfterUnixMs: response.refreshAfterUnixMs
      };
    }
  };
}
function createCursorInferencePromptSession(options2) {
  const client = createSandCursorBackendClient(InferenceService, options2);
  return createProtoSessionProvider(
    client,
    options2.requestedModel,
    void 0,
    options2.inferenceReason
  ).getSession(imageResizingMiddleware);
}

