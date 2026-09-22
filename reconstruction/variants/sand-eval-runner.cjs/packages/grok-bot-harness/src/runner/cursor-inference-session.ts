/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/cursor-inference-session.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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
function createSandSubagentRequestedModel(modelId) {
  return new RequestedModel({ modelId, maxMode: false });
}
function createSandAttachedMediaUrlProvider(options2) {
  const client = createSandCursorBackendClient(AgentService, options2);
  return {
    getSignedUrlForAttachedMedia: async (ctx, request3) => {
      const response = await client.getSignedUrlForAttachedMedia(
        new GetSignedUrlForAttachedMediaRequest({
          conversationId: request3.conversationId,
          key: request3.key,
          mimeType: request3.mimeType,
          contentLengthBytes: request3.contentLengthBytes !== void 0 ? BigInt(request3.contentLengthBytes) : void 0
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

