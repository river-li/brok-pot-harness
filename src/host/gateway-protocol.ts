var GATEWAY_SCHEMES = ["http", "https"];
var SandGatewayRequestError = class extends SandDomainError {
  name = "SandGatewayRequestError";
};
var connectorCardVariant = oneOf(
  "connector card variant",
  SAND_CONNECTOR_CARD_VARIANTS
);
var workingStateExportTrigger = oneOf(
  "working state export trigger",
  ["warming", "recreate", "host_update", "manual"]
);
var deliverAgentMessageArgs = rpcObject({
  messageId: rpcString(),
  from: rpcObject({ id: rpcString(), name: rpcString() }),
  toAgentId: rpcString(),
  text: rpcString()
});
var SAND_GATEWAY_ROOM_MEMBER_TURN_OUTCOMES = [
  "delivered",
  "pass",
  "skipped",
  "timeout",
  "cancelled",
  "error"
];
var deliverRoomMemberTurnResultArgs = rpcObject({
  roomId: rpcString(),
  nonce: rpcString(),
  memberAgentId: rpcString(),
  outcome: oneOf("room member turn outcome", SAND_GATEWAY_ROOM_MEMBER_TURN_OUTCOMES),
  messages: rpcArray(rpcString()),
  error: rpcOptional(rpcString())
});
var roomTurnSpeakerKind = oneOf("room turn speaker kind", ["human", "agent"]);
var roomTurnMessageArgs = rpcObject({
  speakerKind: roomTurnSpeakerKind,
  speakerName: rpcString(),
  isSelf: rpcOptional(rpcBoolean()),
  text: rpcString(),
  replyTo: rpcOptional(
    rpcObject({
      speakerKind: roomTurnSpeakerKind,
      speakerName: rpcString(),
      isSelf: rpcOptional(rpcBoolean()),
      quote: rpcString()
    })
  )
});
var runRoomMemberTurnArgs = rpcObject({
  nonce: rpcString(),
  room: rpcObject({ id: rpcString(), name: rpcString(), description: rpcString() }),
  memberAgentId: rpcString(),
  peers: rpcArray(rpcObject({ id: rpcString(), name: rpcString(), description: rpcString() })),
  newMessages: rpcArray(roomTurnMessageArgs),
  isWindingDown: rpcBoolean(),
  deadlineMs: rpcNumber(),
  parentRequestId: rpcOptional(rpcString()),
  rootParentRequestId: rpcOptional(rpcString()),
  attachments: rpcOptional(rpcArray(rpcObject({ path: rpcString(), name: rpcString() }))),
  isAttachmentOnlyTurn: rpcOptional(rpcBoolean())
});
var credentialTargetRule = rpcUnion(
  rpcObject({
    kind: rpcLiteral("exact-host-port"),
    scheme: oneOf("credential target scheme", ["http", "https"]),
    host: rpcString(),
    port: rpcNumber()
  }),
  rpcObject({
    kind: rpcLiteral("registrable-domain"),
    registrableDomain: rpcString()
  })
);
var credentialApprovalMode = oneOf("credential approval mode", SAND_CREDENTIAL_APPROVAL_MODES);
var credentialDirectoryItem = rpcObject({
  credentialId: rpcString(),
  connectionId: rpcString(),
  catalogRevision: rpcString(),
  title: rpcString(),
  category: rpcString(),
  sites: rpcArray(rpcString()),
  targetRules: rpcArray(credentialTargetRule),
  vaultName: rpcOptional(rpcString()),
  hasOneTimeCode: rpcOptional(rpcBoolean())
});
var gatewayHostOnlyRpcEdge = declareRpcEdge("gateway-host-only", {
  methods: {
    readVoiceCallAgentContext: rpcMethod().args({ id: rpcString() }),
    resolveCredentialBrowserTarget: rpcMethod().args({
      agentId: rpcOptional(rpcString()),
      item: credentialDirectoryItem,
      siteHint: rpcString()
    }),
    fillBrowserCredentialDirect: rpcMethod().args({
      agentId: rpcOptional(rpcString()),
      item: credentialDirectoryItem,
      targetSite: rpcString(),
      targetWebSocketDebuggerUrl: rpcOptional(rpcString()),
      approvalMode: rpcOptional(credentialApprovalMode),
      username: rpcOptional(rpcString()),
      password: rpcString(),
      oneTimeCode: rpcOptional(rpcString()),
      oneTimeCodeTicket: rpcOptional(rpcString()),
      passwordStepTicket: rpcOptional(rpcString())
    }),
    fillBrowserPasswordStep: rpcMethod().args({
      item: credentialDirectoryItem,
      targetSite: rpcString(),
      targetWebSocketDebuggerUrl: rpcString(),
      approvalMode: credentialApprovalMode,
      username: rpcOptional(rpcString()),
      password: rpcString(),
      oneTimeCode: rpcOptional(rpcString()),
      oneTimeCodeTicket: rpcOptional(rpcString())
    }),
    fillBrowserOneTimeCode: rpcMethod().args({
      item: credentialDirectoryItem,
      targetSite: rpcString(),
      targetWebSocketDebuggerUrl: rpcString(),
      oneTimeCode: rpcString()
    }),
    getOpenCredentialRequest: rpcMethod().args({
      entryId: rpcString(),
      agentId: rpcString()
    }),
    fillBrowserCredential: rpcMethod().args({
      entryId: rpcString(),
      agentId: rpcString(),
      approvalMode: rpcOptional(credentialApprovalMode),
      username: rpcOptional(rpcString()),
      password: rpcString(),
      oneTimeCode: rpcOptional(rpcString()),
      oneTimeCodeTicket: rpcOptional(rpcString()),
      passwordStepTicket: rpcOptional(rpcString())
    }),
    acquireCredentialFillAgentHold: rpcMethod().args({
      holdId: rpcString(),
      toolName: rpcString(),
      windowIndex: rpcOptional(rpcNumber()),
      waitMs: rpcOptional(rpcNumber()),
      ttlMs: rpcOptional(rpcNumber())
    }),
    releaseCredentialFillAgentHold: rpcMethod().args({ holdId: rpcString() }),
    resolveCredentialRequest: rpcMethod().args({
      entryId: rpcString(),
      agentId: rpcString(),
      resolution: oneOf("credential resolution", ["denied", "failed"]),
      detail: rpcOptional(rpcString())
    }),
    appendConnectorCard: rpcMethod().args({
      connector: rpcString(),
      variant: connectorCardVariant,
      reason: rpcOptional(rpcString()),
      agentId: rpcString()
    }),
    deleteAgent: rpcMethod().args({ id: rpcString() }),
    autoUpdateBoxNow: rpcMethod().noArgs,
    snapshotBoxStoreNow: rpcMethod().args({
      includeIdleOnly: rpcOptional(rpcBoolean())
    }),
    getBoxStoreStatus: rpcMethod().noArgs,
    clearBoxStoreNow: rpcMethod().noArgs,
    setBoxMigrating: rpcMethod().args({ migrating: rpcBoolean() }),
    setHttpProxyName: rpcMethod().args({
      name: rpcNullable(rpcString())
    }),
    getNavigationTelemetryIdentity: rpcMethod().noArgs,
    markAgentRequestStarted: rpcMethod().args({
      requestId: rpcString()
    }),
    markAgentRequestEnded: rpcMethod().args({
      requestId: rpcString()
    }),
    syncUserSecrets: rpcMethod().args({
      revision: rpcString(),
      generation: rpcOptional(rpcNumber()),
      secrets: rpcOptional(rpcRecord(rpcString()))
    }),
    prepareBoxForRecreate: rpcMethod().noArgs,
    resumeBoxAfterRecreate: rpcMethod().args({
      agentIds: rpcArray(rpcString()),
      pendingWakes: rpcOptional(rpcArray(rpcUnknown()))
    }),
    deliverAgentMessage: rpcMethod().args(deliverAgentMessageArgs),
    reconcileAgentIdentity: rpcMethod().noArgs,
    exportGrokBotWorkingState: rpcMethod().args({
      agentId: rpcString(),
      maxClosureBytes: rpcOptional(rpcNumber()),
      maxClosureBlobs: rpcOptional(rpcNumber()),
      readBatchBlobs: rpcOptional(rpcNumber()),
      putConcurrency: rpcOptional(rpcNumber()),
      expectedServerId: rpcOptional(rpcString()),
      trigger: rpcOptional(workingStateExportTrigger)
    }),
    getPauseState: rpcMethod().noArgs,
    getHarnessMigrationWindow: rpcMethod().noArgs,
    listPromotableRooms: rpcMethod().noArgs,
    listSidebarSections: rpcMethod().noArgs,
    assignAgentToSidebarSection: rpcMethod().args({
      agentId: rpcString(),
      sectionId: rpcString()
    }),
    deliverRoomMemberTurnResult: rpcMethod().args(
      deliverRoomMemberTurnResultArgs
    ),
    runRoomMemberTurn: rpcMethod().args(runRoomMemberTurnArgs),
    cancelRoomMemberTurn: rpcMethod().args({
      nonce: rpcString(),
      reason: rpcString()
    })
  }
});
var GATEWAY_METHOD_DECLARATIONS = {
  ...gatewayRpcEdge.methods,
  ...gatewayHostOnlyRpcEdge.methods
};
var SAND_GATEWAY_METHODS = Object.keys(
  GATEWAY_METHOD_DECLARATIONS
).filter(isSandGatewayMethod);
function isSandGatewayMethod(name17) {
  return isKeyOf(GATEWAY_METHOD_DECLARATIONS, name17);
}
var NO_ARGS_SCHEMA2 = rpcObject({});
async function parseGatewayCommandBody(method, body) {
  let parsed2;
  try {
    parsed2 = body.length > 0 ? JSON.parse(body) : {};
  } catch (error42) {
    throw new SandGatewayRequestError(`command body is not valid JSON: ${String(error42)}`, {
      cause: error42
    });
  }
  const schema2 = GATEWAY_METHOD_DECLARATIONS[method].schema ?? NO_ARGS_SCHEMA2;
  const result = await schema2["~standard"].validate(parsed2);
  if (result.issues) {
    throw new SandGatewayRequestError(`${method}: ${describeIssues(result.issues)}`);
  }
  return result.value;
}
function handlersOf(api) {
  return api;
}
async function runGatewayCommand(api, method, body, avatars) {
  const args = await parseGatewayCommandBody(method, body);
  if (avatars === "slim" && isSlimShapedMethod(method)) {
    return handlersOf(slimAvatarOverrides(api))[method](args);
  }
  return handlersOf(api)[method](args);
}
var GATEWAY_PREPARE_UPGRADE_PATH = "/prepare-upgrade";
var LOOPBACK_HOSTS = /* @__PURE__ */ new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
function isLoopbackHost(host) {
  return LOOPBACK_HOSTS.has(host.trim().toLowerCase());
}
function stripSummaryInlineAvatar(summary) {
  if (summary.avatarDataUrl == null) return summary;
  return { ...summary, avatarDataUrl: null };
}
function stripSummaryRows(rows) {
  let isChanged = false;
  const stripped = rows.map((row) => {
    const slim = stripSummaryInlineAvatar(row);
    if (slim !== row) isChanged = true;
    return slim;
  });
  return isChanged ? stripped : rows;
}
function stripNullableSummary(summary) {
  return summary == null ? null : stripSummaryInlineAvatar(summary);
}
function stripCreateAgentResult(result) {
  const agent = stripSummaryInlineAvatar(result.agent);
  return agent === result.agent ? result : { ...result, agent };
}
var SLIM_SHAPED_METHODS = [
  "listAgents",
  "updateAgent",
  "seedConversationName",
  "setGroupMembers",
  "setAgentAvatarBytes",
  "createAgent",
  "createAgentFromTemplate",
  "createGroup",
  "duplicateAgent"
];
function isSlimShapedMethod(method) {
  return SLIM_SHAPED_METHODS.some((shaped) => shaped === method);
}
function slimAvatarOverrides(api) {
  return {
    listAgents: async () => stripSummaryRows(await api.listAgents()),
    updateAgent: async (args) => stripNullableSummary(await api.updateAgent(args)),
    seedConversationName: async (args) => {
      const outcome = await api.seedConversationName(args);
      const agent = stripNullableSummary(outcome.agent);
      return agent === outcome.agent ? outcome : { ...outcome, agent };
    },
    setGroupMembers: async (args) => stripNullableSummary(await api.setGroupMembers(args)),
    setAgentAvatarBytes: async (args) => stripNullableSummary(await api.setAgentAvatarBytes(args)),
    createAgent: async (args) => stripCreateAgentResult(await api.createAgent(args)),
    createAgentFromTemplate: async (args) => stripCreateAgentResult(await api.createAgentFromTemplate(args)),
    createGroup: async (args) => stripCreateAgentResult(await api.createGroup(args)),
    duplicateAgent: async (args) => stripCreateAgentResult(await api.duplicateAgent(args))
  };
}
function stripInlineAvatarsFromEvent(event) {
  if (event.channel === "agents") {
    const agents = stripSummaryRows(event.payload.agents);
    if (agents === event.payload.agents) return event;
    return { channel: "agents", payload: { ...event.payload, agents } };
  }
  if (event.channel === "agent-upserted") {
    const agent = stripSummaryInlineAvatar(event.payload.agent);
    if (agent === event.payload.agent) return event;
    return { channel: "agent-upserted", payload: { ...event.payload, agent } };
  }
  return event;
}
function refuseSwapRunningTurns(runningTurns) {
  return Math.max(runningTurns, 1);
}
