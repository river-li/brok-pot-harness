function resolveSandRequestedModel(inputs) {
  const { sessionOptions, envModelOverride, storedDefaultModel } = inputs;
  const effectiveDefaultModel = inputs.experimentModelOverride ?? storedDefaultModel;
  const effectiveDefaultModelId = envModelOverride ?? effectiveDefaultModel?.modelId ?? SAND_DEFAULT_MODEL_ID;
  const subagentModelId = sessionOptions?.modelId;
  const storedComputerUseModel = sandComputerUseModelSchema.safeParse(
    inputs.storedComputerUseModel
  );
  const storedBrowserUseModel = sandBrowserUseModelSchema.safeParse(inputs.storedBrowserUseModel);
  if (sessionOptions?.isSummarizationSession === true && subagentModelId != null) {
    return createSandSubagentRequestedModel(subagentModelId);
  }
  if (sessionOptions?.isComputerUseSubagent === true) {
    return storedComputerUseModel.success ? createSandRequestedModelFromSelection(storedComputerUseModel.data) : createSandComputerUseRequestedModel(SAND_COMPUTER_USE_SUBAGENT_MODEL_ID);
  }
  if (sessionOptions?.isBrowserUseSubagent === true) {
    return storedBrowserUseModel.success ? createSandRequestedModelFromSelection(storedBrowserUseModel.data) : createSandComputerUseRequestedModel(SAND_COMPUTER_USE_SUBAGENT_MODEL_ID);
  }
  if (subagentModelId != null && subagentModelId !== effectiveDefaultModelId) {
    return createSandSubagentRequestedModel(subagentModelId);
  }
  if (envModelOverride != null) return new RequestedModel({ modelId: envModelOverride });
  if (effectiveDefaultModel != null) {
    return createSandRequestedModelFromSelection(effectiveDefaultModel);
  }
  return createSandDefaultRequestedModel();
}
function parseSandMockScript(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed2 !== "object" || parsed2 === null) return null;
  const sendMessage = parsed2.sendMessage;
  return typeof sendMessage === "string" && sendMessage.length > 0 ? { sendMessage } : null;
}
function createScriptedMockSession(script, modelId) {
  let callCount = 0;
  return {
    getExecutor: () => createMockPromptExecutor(() => {
      callCount += 1;
      if (callCount > 1) return { response: "" };
      return {
        response: "",
        toolCalls: [
          {
            toolCallId: `mock-send-${callCount}`,
            toolName: "SendMessage",
            args: { type: "text", content: script.sendMessage }
          }
        ]
      };
    }),
    getModelId: () => modelId
  };
}
function createCursorSandInference(options2) {
  let labelingClient;
  const geminiVideoAttachedMediaUrlProvider = createSandAttachedMediaUrlProvider({
    backend: options2.backend,
    getAccessToken: options2.getAccessToken,
    getTeamId: options2.getTeamId,
    getMachineId: options2.getMachineId
  });
  const getLabelingClient = () => {
    labelingClient ??= createSandLabelingClient({
      backend: options2.backend,
      getAccessToken: options2.getAccessToken,
      getTeamId: options2.getTeamId,
      getMachineId: options2.getMachineId
    });
    return labelingClient;
  };
  return {
    resolvePrivacyMode: () => resolveSandRunPrivacyMode({
      backend: options2.backend,
      getAccessToken: options2.getAccessToken,
      getTeamId: options2.getTeamId,
      getMachineId: options2.getMachineId
    }),
    getGeminiVideoAttachedMediaUrlProvider: () => options2.isGeminiVideoDeveloperApiEnabled?.() === true ? geminiVideoAttachedMediaUrlProvider : void 0,
    createSession(onRequestId, sessionOptions) {
      const mockResponse = options2.agentMockResponse;
      if (mockResponse != null) {
        const modelId = sessionOptions?.modelId ?? "sand-mock";
        const script = parseSandMockScript(mockResponse);
        if (script != null) return createScriptedMockSession(script, modelId);
        return {
          getExecutor: () => createMockPromptExecutor(() => ({
            response: mockResponse,
            chunkSize: 8
          })),
          getModelId: () => modelId
        };
      }
      const modelExperimentState = options2.getModelExperimentState?.();
      const experimentModelOverride = selectSandExperimentTurnModel({
        state: modelExperimentState,
        requestSource: sessionOptions?.requestSource,
        readConfiguredDefaultModel: () => options2.getConfiguredDefaultModel?.(),
        readConfiguredAutomationsModel: () => options2.getConfiguredAutomationsModel?.()
      });
      const requestedModel = resolveSandRequestedModel({
        sessionOptions,
        envModelOverride: options2.agentModelOverride,
        storedDefaultModel: options2.getDefaultModel?.(),
        storedComputerUseModel: options2.getComputerUseModel?.(),
        storedBrowserUseModel: options2.getBrowserUseModel?.(),
        experimentModelOverride
      });
      const inferenceOptions = {
        backend: options2.backend,
        getAccessToken: options2.getAccessToken,
        getGrokBotAccessToken: options2.getGrokBotToken,
        getTeamId: options2.getTeamId,
        getMachineId: options2.getMachineId,
        requestedModel,
        inferenceReason: options2.isGeminiVideoDeveloperApiEnabled?.() === true ? sessionOptions?.inferenceReason : void 0,
        onRequestId,
        ...sessionOptions?.lineage != null ? { lineage: sessionOptions.lineage } : {}
      };
      return createCursorInferencePromptSession(inferenceOptions);
    },
    recordPostTurnLabeling(args) {
      recordSandPostTurnLabeling(getLabelingClient(), args);
    },
    recordFollowupLabeling(args) {
      recordSandFollowupLabeling(getLabelingClient(), args);
    }
  };
}
