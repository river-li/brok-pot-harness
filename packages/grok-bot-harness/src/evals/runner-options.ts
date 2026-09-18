var unavailableWebSearch = async () => ({
  answer: "",
  documents: []
});
var unavailableWebFetch = async () => ({
  error: "web fetch is not configured for this Sand eval run"
});
var EVAL_RUNNER_PIN = "the eval runner reads no rollout flags; the gate stays at its default";
function composeEvalRunnerGates(overrides = {}) {
  const baseline = composeSandRunnerGates({
    sendMessageDeliveryOwed: fixedGate(true, EVAL_RUNNER_PIN),
    spotlight: fixedGate(true, EVAL_RUNNER_PIN),
    dynamicTools: fixedGate(false, EVAL_RUNNER_PIN),
    stableDynamicToolCatalog: fixedGate(false, EVAL_RUNNER_PIN),
    browserNavigationRecovery: fixedGate(false, EVAL_RUNNER_PIN),
    browserUsePlaywright: fixedGate(false, EVAL_RUNNER_PIN),
    userForm: fixedGate(false, EVAL_RUNNER_PIN),
    formVault: fixedGate(false, EVAL_RUNNER_PIN),
    draftExternalMessage: fixedGate(false, EVAL_RUNNER_PIN),
    agentPromptedCookieSync: fixedGate(false, EVAL_RUNNER_PIN),
    stripeLink: fixedGate(false, EVAL_RUNNER_PIN),
    mcpMultiAccount: fixedGate(false, EVAL_RUNNER_PIN),
    unicodeTyping: fixedGate(false, EVAL_RUNNER_PIN),
    cloudAgentsDisabledByTeam: fixedGate(false, EVAL_RUNNER_PIN),
    cloudAgentArtifacts: fixedGate(false, EVAL_RUNNER_PIN),
    cloudAgentDurableWatch: fixedGate(false, EVAL_RUNNER_PIN),
    cloudAgentReplyModes: fixedGate(false, EVAL_RUNNER_PIN),
    frozenToolDescriptions: fixedGate(false, EVAL_RUNNER_PIN),
    checkSubscriptionUsage: fixedGate(false, EVAL_RUNNER_PIN),
    connectedActivity: fixedGate(false, EVAL_RUNNER_PIN),
    canvases: fixedGate(false, EVAL_RUNNER_PIN),
    cloudAgentProjects: fixedGate(false, EVAL_RUNNER_PIN),
    cloudAgentExchange: fixedGate(false, EVAL_RUNNER_PIN),
    cloudCanvasTools: fixedGate(false, EVAL_RUNNER_PIN),
    lessSubagentFanout: fixedGate(false, EVAL_RUNNER_PIN),
    reducePeerChatter: fixedGate(false, EVAL_RUNNER_PIN),
    updateCommunication: fixedGate(false, EVAL_RUNNER_PIN),
    leanSendToUserDescription: fixedGate(false, EVAL_RUNNER_PIN),
    activeReactions: fixedGate(false, EVAL_RUNNER_PIN),
    internalDetailsBoundary: fixedGate(false, EVAL_RUNNER_PIN),
    agentDescription: fixedGate(true, EVAL_RUNNER_PIN),
    botShare: fixedGate(false, EVAL_RUNNER_PIN),
    botShareGettingStarted: fixedGate(false, EVAL_RUNNER_PIN),
    teamAccessCards: fixedGate(false, EVAL_RUNNER_PIN),
    scmConnectCard: fixedGate(false, EVAL_RUNNER_PIN),
    voiceCall: fixedGate(false, EVAL_RUNNER_PIN),
    fiveMinuteAutomationFloor: fixedGate(false, EVAL_RUNNER_PIN),
    messagesTools: fixedGate(false, EVAL_RUNNER_PIN),
    chromeCookieImport: fixedGate(false, EVAL_RUNNER_PIN),
    boxEgressTunnel: fixedGate(false, EVAL_RUNNER_PIN),
    onePasswordIntegration: fixedGate(false, EVAL_RUNNER_PIN),
    agentEmail: fixedGate(false, EVAL_RUNNER_PIN)
  });
  const gates = { ...baseline };
  for (const name17 in overrides) {
    if (!isKeyOf(gates, name17)) continue;
    const value = overrides[name17];
    if (value !== void 0) gates[name17] = () => value;
  }
  return gates;
}
function buildSandEvalRunnerOptions(options2) {
  return {
    inference: options2.inference,
    streamTuning: options2.streamTuning ?? resolveSandStreamTuning({}),
    box: options2.box,
    remoteBox: options2.remoteBox,
    remoteBoxHasDesktop: options2.remoteBoxHasDesktop,
    transport: options2.transport,
    subagentTransport: options2.transport,
    requestContext: options2.requestContext,
    ...options2.modelVisibleTime == null ? {} : { modelVisibleTime: options2.modelVisibleTime },
    webSearchService: options2.webSearchService ?? unavailableWebSearch,
    webFetchService: options2.webFetchService ?? unavailableWebFetch,
    ...options2.mcp == null ? {} : { mcp: options2.mcp },
    ...options2.systemPrompt == null ? {} : { systemPrompt: options2.systemPrompt },
    ...options2.disabledToolIdentifiers == null ? {} : { disabledToolIdentifiers: options2.disabledToolIdentifiers },
    ...options2.ingestAttachment == null ? {} : { ingestAttachment: options2.ingestAttachment },
    ...options2.persistImage == null ? {} : { persistImage: options2.persistImage },
    ...options2.persistMediaBytes == null ? {} : { persistMediaBytes: options2.persistMediaBytes },
    ...options2.readMediaDimensions == null ? {} : { readMediaDimensions: options2.readMediaDimensions },
    gates: composeEvalRunnerGates(options2.evalGateOverrides)
  };
}
