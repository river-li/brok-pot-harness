function createSandEvalInference(options2) {
  const backendOptions = {
    backend: options2.backend,
    getAccessToken: options2.getAccessToken,
    getMachineId: options2.getMachineId
  };
  const attachedMediaUrlProvider = createSandAttachedMediaUrlProvider(backendOptions);
  return {
    resolvePrivacyMode: () => resolveSandRunPrivacyMode(backendOptions),
    getGeminiVideoAttachedMediaUrlProvider: () => attachedMediaUrlProvider,
    createSession: (onRequestId, sessionOptions) => {
      const requestedModel = sessionOptions?.modelId != null && sessionOptions.modelId !== options2.model.modelId ? createSandSubagentRequestedModel(sessionOptions.modelId) : createSandRequestedModelFromSelection(options2.model);
      const inferenceOptions = {
        backend: options2.backend,
        getAccessToken: options2.getAccessToken,
        getMachineId: options2.getMachineId,
        requestedModel,
        inferenceReason: sessionOptions?.inferenceReason,
        onRequestId,
        inferenceRequestContext: options2.inferenceRequestContext,
        ...sessionOptions?.lineage == null ? {} : { lineage: sessionOptions.lineage }
      };
      return createCursorInferencePromptSession(inferenceOptions);
    }
  };
}
