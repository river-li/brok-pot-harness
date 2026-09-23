var idArgs = { id: rpcString() };
var agentIdAndAutomationId = { id: rpcString(), automationId: rpcString() };
var idAndSkillArgs = { id: rpcString(), workflowId: rpcString() };
var agentIdAndPlatform = { id: rpcString(), platform: rpcString() };
var clientPlatform = oneOf("client platform", SAND_USER_FORM_CLIENT_PLATFORMS);
var approvalPlatform = payloadShape(
  "approval platform",
  isSandApprovalPlatform
);
var stringRecord = rpcRecord(rpcString());
var variableValueRecord = rpcRecord(rpcUnion(rpcString(), rpcNumber(), rpcBoolean()));
var draftPayload = payloadShape(
  "draft payload",
  isSandDraftPayload
);
var gatewayAcceptanceStatusArgs = rpcObject({
  accountSlot: rpcString(),
  clientNonce: rpcString(),
  agentId: rpcOptional(rpcString()),
  sessionId: rpcOptional(rpcString())
});
var transcriptPageArgs = rpcObject({
  id: rpcString(),
  beforeSeq: rpcOptional(rpcNumber()),
  limit: rpcNumber(),
  sinceMs: rpcOptional(rpcNumber()),
  untilMs: rpcNumber()
});
var transcriptWindowArgs = rpcObject({
  id: rpcString(),
  beforeSeq: rpcOptional(rpcNumber()),
  limit: rpcNumber()
});
var transcriptTailArgs = rpcObject({
  id: rpcString(),
  beforeSeq: rpcOptional(rpcNumber()),
  limit: rpcNumber(),
  sessionId: rpcOptional(rpcString())
});
var sendPromptFields = {
  prompt: rpcString(),
  agentId: rpcString(),
  directAddressedAcceptance: rpcOptional(rpcLiteral(true)),
  clientNonce: rpcOptional(rpcString()),
  attachmentPaths: rpcOptional(rpcArray(rpcString())),
  attachmentNames: rpcOptional(rpcArray(rpcString())),
  richText: rpcOptional(rpcString()),
  replyToId: rpcOptional(rpcString()),
  automationWriteProvenance: rpcOptional(
    rpcUnion(
      rpcLiteral(SAND_AUTOMATION_WRITE_PROVENANCE_UNTRUSTED),
      rpcLiteral(SAND_AUTOMATION_WRITE_PROVENANCE_TEMPLATE_IMPORT)
    )
  ),
  isFork: rpcOptional(rpcBoolean()),
  traceparent: rpcOptional(rpcString()),
  enterEpochMs: rpcOptional(rpcNumber()),
  composedAtMs: rpcOptional(rpcNumber()),
  source: rpcOptional(payloadShape("client surface", isSandClientSurface)),
  sessionId: rpcOptional(rpcString()),
  machineId: rpcOptional(rpcString())
};
var sendPromptArgs = rpcObject(sendPromptFields);
var webAuthnCeremonyKind = oneOf(
  "ceremony kind",
  SAND_WEB_AUTHN_CEREMONY_KINDS
);
var webAuthnCeremonyRequest = rpcObject({
  kind: webAuthnCeremonyKind,
  origin: rpcString(),
  optionsJson: rpcString()
});
var botTemplatePublishArgs = rpcObject({
  shareId: rpcString(),
  version: rpcNumber()
});
var botTemplateVersionArgs = rpcObject({
  shareId: rpcString(),
  version: rpcNumber()
});
var botTemplateForSourceAgentArgs = rpcObject({
  sourceAgentId: rpcString()
});
var botTemplateDeleteArgs = rpcObject({
  shareId: rpcString()
});
var botTemplateVisibilityArgs = rpcObject({
  shareId: rpcString(),
  visibility: oneOf("bot template visibility", SAND_BOT_TEMPLATE_VISIBILITIES)
});
var agentOrigin = oneOf("agent origin", SAND_AGENT_ORIGINS);
var agentPurpose = payloadShape(
  "agent purpose",
  isSandAgentPurpose
);
var agentProfileFields = {
  name: rpcString(),
  description: rpcString(),
  title: rpcOptional(rpcString()),
  avatarShape: rpcOptional(rpcString()),
  avatarColor: rpcOptional(rpcString())
};
var agentProfile = rpcObject(agentProfileFields);
var createAgentArgs = rpcObject({
  ...agentProfileFields,
  avatarPngBase64: rpcOptional(rpcString()),
  creationRoute: rpcOptional(
    rpcUnion(
      rpcObject({ kind: rpcLiteral("box") }),
      rpcObject({ kind: rpcLiteral("temporal"), scope: rpcString() })
    )
  ),
  origin: rpcOptional(agentOrigin),
  purpose: rpcOptional(agentPurpose),
  isIntroductionSuppressed: rpcOptional(rpcBoolean()),
  isKickstartRequested: rpcOptional(rpcBoolean()),
  language: rpcOptional(rpcString()),
  templateId: rpcOptional(rpcString()),
  clientNonce: rpcOptional(rpcString()),
  supportsTemporalHarness: rpcOptional(rpcBoolean()),
  harness: rpcOptional(
    rpcUnion(
      rpcLiteral(SAND_REQUESTED_AGENT_HARNESS_BOX),
      rpcLiteral(SAND_REQUESTED_AGENT_HARNESS_TEMPORAL)
    )
  )
});
var createAgentFromTemplateArgs = rpcObject({
  shareId: rpcString(),
  agentId: rpcString(),
  name: rpcString(),
  avatarShape: rpcString(),
  avatarColor: rpcString(),
  expectedActiveVersion: rpcNumber(),
  creatorContext: rpcOptional(rpcString()),
  language: rpcOptional(rpcString())
});
var uploadAttachmentArgs = rpcObject({
  agentId: rpcOptional(rpcString()),
  filename: rpcString(),
  bytesBase64: rpcString()
});
var uploadAttachmentChunkArgs = rpcObject({
  agentId: rpcOptional(rpcString()),
  uploadId: rpcString(),
  filename: rpcString(),
  offset: rpcNumber(),
  totalSize: rpcNumber(),
  bytesBase64: rpcString()
});
var readAttachmentTextArgs = rpcObject({
  agentId: rpcOptional(rpcString()),
  path: rpcString()
});
var readAttachmentChunkArgs = rpcObject({
  agentId: rpcOptional(rpcString()),
  path: rpcString(),
  offset: rpcNumber(),
  length: rpcNumber(),
  videoPlayback: rpcOptional(rpcBoolean())
});
var notificationConfigInput = rpcObject({
  isEnabled: rpcOptional(rpcBoolean()),
  allowedApps: rpcOptional(rpcArray(rpcString())),
  minIntervalMs: rpcOptional(rpcNumber()),
  maxPerWindow: rpcOptional(rpcNumber()),
  windowMs: rpcOptional(rpcNumber())
});
var selectedTeamBinding = rpcObject({
  teamId: rpcNumber(),
  accountScope: rpcString()
});
var modelSelection = rpcObject({
  modelId: rpcString(),
  maxMode: rpcBoolean(),
  parameters: rpcArray(rpcObject({ id: rpcString(), value: rpcString() }))
});
var autoReviewInstructions = rpcObject({
  isEnabled: rpcBoolean(),
  allowInstructions: rpcArray(rpcString()),
  blockInstructions: rpcArray(rpcString())
});
var localToolPermission = payloadShape(
  "local tool permission",
  isSandLocalToolPermission
);
var sidebarSectionUpdate = rpcObject({
  id: rpcString(),
  name: rpcString(),
  agentIds: rpcArray(rpcString()),
  isCollapsed: rpcOptional(rpcBoolean())
});
var hostSettingsUpdate = rpcObject({
  notifications: rpcOptional(notificationConfigInput),
  selectedTeam: rpcOptional(rpcNullable(selectedTeamBinding)),
  mcpCustomInstructions: rpcOptional(stringRecord),
  mcpCustomInstructionsByServerId: rpcOptional(stringRecord),
  mcpCustomInstructionsAccountScope: rpcOptional(rpcNullable(rpcString())),
  mcpDisabledToolsByServerId: rpcOptional(rpcRecord(rpcArray(rpcString()))),
  mcpBoxServers: rpcOptional(rpcArray(rpcString())),
  userTimeZone: rpcOptional(rpcString()),
  osLocale: rpcOptional(rpcString()),
  userTimeZoneOverride: rpcOptional(rpcString()),
  agentDefaultModel: rpcOptional(rpcNullable(modelSelection)),
  computerUseModel: rpcOptional(rpcNullable(modelSelection)),
  autoReviewInstructions: rpcOptional(autoReviewInstructions),
  localToolPermission: rpcOptional(localToolPermission),
  localToolPermissionMachineId: rpcOptional(rpcString()),
  webauthnProxyEnabled: rpcOptional(rpcBoolean()),
  messagesEnabled: rpcOptional(rpcBoolean()),
  pinnedAgentIds: rpcOptional(rpcArray(rpcString())),
  sidebarSections: rpcOptional(rpcArray(sidebarSectionUpdate)),
  hasSeenOnboarding: rpcOptional(rpcBoolean()),
  featureFlagOverrides: rpcOptional(rpcRecord(rpcBoolean()))
});
var hostStatusArgs = rpcObject({
  includeManagedCapabilities: rpcOptional(rpcBoolean())
});
var localToolPermissionResolution = payloadShape(
  "local tool permission resolution",
  isSandLocalToolPermissionResolution
);
function cardResolveArgs(resolution) {
  return rpcObject({
    entryId: rpcString(),
    requestId: rpcString(),
    resolution,
    agentId: rpcString(),
    sessionId: rpcOptional(rpcString())
  });
}
var localToolPermissionArgs = cardResolveArgs(localToolPermissionResolution);
var connectorGrantArgs = cardResolveArgs(oneOf("connector grant resolution", SAND_CONNECTOR_GRANT_RESOLUTIONS));
var skillTrigger = rpcObject({
  schedule: rpcString(),
  isEnabled: rpcBoolean()
});
var skillSpec = rpcObject({
  name: rpcString(),
  description: rpcString(),
  body: rpcString(),
  trigger: rpcNullable(skillTrigger),
  sourceRef: rpcOptional(rpcNullable(rpcString()))
});
var voiceCallTurn = rpcObject({
  id: rpcString(),
  speaker: rpcUnion(rpcLiteral("user"), rpcLiteral("assistant")),
  text: rpcString(),
  atMs: rpcNumber()
});
var voiceCallNudge = rpcObject({
  id: rpcString(),
  request: rpcString(),
  atMs: rpcNumber(),
  answer: rpcNullable(rpcString()),
  answeredAtMs: rpcOptional(rpcNullable(rpcNumber())),
  direction: rpcOptional(rpcUnion(rpcLiteral("to-main"), rpcLiteral("to-voice"))),
  cut: rpcOptional(rpcNullable(rpcObject({ atMs: rpcNumber(), heardMs: rpcNumber() })))
});
var voiceCallEvent = rpcObject({
  kind: rpcUnion(
    rpcLiteral("caller-speech-started"),
    rpcLiteral("caller-speech-stopped"),
    rpcLiteral("caller-interrupted"),
    rpcLiteral("agent-speech-started"),
    rpcLiteral("agent-speech-stopped"),
    rpcLiteral("response-create"),
    rpcLiteral("protocol-error")
  ),
  atMs: rpcNumber()
});
var voiceCallToolCall = rpcObject({
  id: rpcString(),
  name: rpcString(),
  argumentsJson: rpcString(),
  atMs: rpcNumber(),
  result: rpcNullable(rpcObject({ json: rpcString(), atMs: rpcNumber() }))
});
var voiceCallOverheardStep = rpcObject({
  id: rpcString(),
  text: rpcString(),
  atMs: rpcNumber()
});
var voiceCallRecord = rpcObject({
  callId: rpcString(),
  agentId: rpcString(),
  model: rpcString(),
  realtimeConversationId: rpcOptional(rpcNullable(rpcString())),
  agentRequestId: rpcOptional(rpcString()),
  startedAtMs: rpcNumber(),
  endedAtMs: rpcNumber(),
  durationMs: rpcNumber(),
  ending: rpcUnion(rpcLiteral("hung-up"), rpcLiteral("disconnected"), rpcLiteral("failed")),
  turns: rpcArray(voiceCallTurn),
  nudges: rpcArray(voiceCallNudge),
  events: rpcOptional(rpcArray(voiceCallEvent)),
  toolCalls: rpcOptional(rpcArray(voiceCallToolCall)),
  overheard: rpcOptional(rpcArray(voiceCallOverheardStep)),
  harnessMayCollect: rpcOptional(rpcBoolean())
});
var slackMatch = rpcUnion(
  rpcObject({ kind: rpcLiteral("mention") }),
  rpcObject({ kind: rpcLiteral("keyword"), keyword: rpcString() }),
  rpcObject({ kind: rpcLiteral("message") }),
  rpcObject({
    kind: rpcLiteral("reaction"),
    emoji: rpcOptional(rpcArray(rpcString())),
    bySelf: rpcOptional(rpcBoolean())
  })
);
var slackListener = rpcObject({
  type: rpcLiteral("slack"),
  channel: rpcString(),
  match: slackMatch
});
var githubListener = rpcObject({
  type: rpcLiteral("github"),
  repo: rpcString(),
  events: rpcArray(oneOf("github event kind", GITHUB_EVENT_KINDS)),
  pr: rpcOptional(rpcNumber()),
  userAllowlist: rpcOptional(rpcArray(rpcString())),
  ciBranch: rpcOptional(rpcString())
});
var originListener = rpcObject({
  type: rpcLiteral("origin"),
  repo: rpcString(),
  events: rpcArray(oneOf("origin event kind", ORIGIN_EVENT_KINDS)),
  pr: rpcOptional(rpcNumber()),
  userAllowlist: rpcOptional(rpcArray(rpcString()))
});
var microsoftTeamsTrigger = rpcObject({
  type: rpcLiteral("microsoftTeams"),
  tenantId: rpcString(),
  teamIds: rpcArray(rpcString()),
  channelIds: rpcArray(rpcString()),
  messageContains: rpcString(),
  messageContainsIsRegex: rpcBoolean(),
  blockUnauthenticatedTeamsUsers: rpcBoolean()
});
var linearTriggerEvent = rpcUnion(
  rpcObject({ case: rpcLiteral("issueCreated") }),
  rpcObject({ case: rpcLiteral("statusChanged"), statusIds: rpcArray(rpcString()) }),
  rpcObject({ case: rpcLiteral("endOfCycle"), cycleIds: rpcArray(rpcString()) })
);
var linearTrigger = rpcObject({
  type: rpcLiteral("linear"),
  event: linearTriggerEvent,
  projectIds: rpcArray(rpcString()),
  teamIds: rpcArray(rpcString())
});
var sentryTrigger = rpcObject({
  type: rpcLiteral("sentry"),
  event: rpcObject({ case: oneOf("sentry event case", SENTRY_EVENT_CASES) }),
  projectIds: rpcArray(rpcString())
});
var pagerDutyTrigger = rpcObject({
  type: rpcLiteral("pagerduty"),
  event: rpcObject({ case: oneOf("pagerduty event case", PAGERDUTY_EVENT_CASES) }),
  serviceIds: rpcArray(rpcString())
});
var emailTrigger = rpcObject({
  type: rpcLiteral("email"),
  inbox: rpcString(),
  from: rpcOptional(rpcArray(rpcString())),
  requireAuthPass: rpcOptional(rpcBoolean())
});
var webhookTrigger = rpcObject({ type: rpcLiteral("webhook") });
var cronTrigger2 = rpcObject({
  type: rpcLiteral("cron"),
  schedule: rpcString()
});
var trigger = rpcUnion(
  cronTrigger2,
  slackListener,
  githubListener,
  originListener,
  microsoftTeamsTrigger,
  linearTrigger,
  sentryTrigger,
  pagerDutyTrigger,
  emailTrigger,
  webhookTrigger
);
var triggerGroupListeners = payloadParsed(
  "at least two triggers",
  (value) => {
    const listeners2 = rpcArray(trigger).check(value, []);
    if (!listeners2.ok) return { success: false };
    const [first, second, ...rest] = listeners2.value;
    if (first === void 0 || second === void 0) return { success: false };
    return { success: true, data: [first, second, ...rest] };
  }
);
var triggerGroup = rpcObject({
  type: rpcLiteral("group"),
  listeners: triggerGroupListeners
});
var automationTrigger = rpcUnion(trigger, triggerGroup);
var automationSpec = rpcObject({
  name: rpcString(),
  prompt: rpcString(),
  trigger: automationTrigger,
  isEnabled: rpcOptional(rpcBoolean())
});
var boxHandBackTrigger = oneOf(
  "hand-back trigger",
  SAND_BOX_HAND_BACK_TRIGGERS
);
var teachEntryPoint = oneOf(
  "teach entry point",
  SAND_TEACH_ENTRY_POINTS
);
var cookieValue = payloadParsed(
  "cookie value",
  (value) => typeof value === "string" ? { success: true, data: asCookieValue(value) } : { success: false }
);
var cookieOriginRequestEntry = rpcUnion(
  rpcString(),
  rpcObject({ origin: rpcString(), profileId: rpcString() })
);
var chromeCookieRecord = rpcObject({
  name: rpcString(),
  value: cookieValue,
  domain: rpcString(),
  path: rpcString(),
  expires: rpcNumber(),
  httpOnly: rpcBoolean(),
  secure: rpcBoolean(),
  sameSite: rpcOptional(oneOf("same-site policy", ["Strict", "Lax", "None"])),
  session: rpcOptional(rpcBoolean()),
  priority: rpcOptional(oneOf("cookie priority", ["Low", "Medium", "High"])),
  partitionKey: rpcOptional(rpcUnion(rpcString(), rpcRecord(rpcUnknown())))
});
var mcpAuthCompletion = rpcObject({
  serverId: rpcString(),
  serverName: rpcString(),
  accountKey: rpcString(),
  serverIdentifier: rpcOptional(rpcString()),
  requestingAgentId: rpcNullable(rpcString()),
  outcome: rpcOptional(oneOf("auth outcome", ["connected", "cancelled"]))
});
var mcpServerIdArgs = { serverId: rpcString() };
var mcpAccountRef = rpcObject({
  serverId: rpcString(),
  accountKey: rpcString()
});
var mcpRenameAccountRequest = rpcObject({
  serverId: rpcString(),
  accountKey: rpcString(),
  newAccountKey: rpcString()
});
var mcpInstallEntryRequest = rpcObject({
  entryId: rpcString(),
  values: rpcOptional(variableValueRecord),
  hasTeamConfiguredVariables: rpcOptional(rpcBoolean())
});
var mcpUpdatePluginInstallRequest = rpcObject({
  pluginId: rpcString(),
  values: variableValueRecord
});
var rpcOauthRedirectUri = rpcOptional(
  payloadShape("mcp oauth redirect uri", isValidMcpOAuthRedirectUri)
);
var mcpAuthenticateRequest = rpcObject({
  serverId: rpcString(),
  accountKey: rpcOptional(rpcString()),
  trigger: rpcOptional(rpcLiteral("connector_card")),
  forceReauth: rpcOptional(rpcBoolean()),
  requestingAgentId: rpcOptional(rpcString()),
  oauthRedirectUri: rpcOauthRedirectUri
});
var mcpSetInstructionsRequest = rpcObject({
  serverId: rpcString(),
  instructions: rpcString()
});
var mcpToggleToolDisabledRequest = rpcObject({
  serverId: rpcString(),
  toolName: rpcString()
});
var TWO_BASE64_ALPHABET_CHARS = /[A-Za-z0-9+/\-_][^A-Za-z0-9+/\-_]*[A-Za-z0-9+/\-_]/;
var nonEmptyAudioBase64 = payloadParsed(
  "base64 audio that decodes to bytes",
  (value) => typeof value === "string" && TWO_BASE64_ALPHABET_CHARS.test(value) ? { success: true, data: value } : { success: false }
);
var transcribeAudioArgs = rpcObject({
  audioBase64: nonEmptyAudioBase64,
  mimeType: rpcString(),
  language: rpcOptional(rpcString())
});
var gatewayRpcEdge = declareRpcEdge("gateway", {
  methods: {
    getAgentTranscript: rpcMethod().args(idArgs),
    getAgentTranscriptPage: rpcMethod().args(transcriptPageArgs),
    openAgentWindowed: rpcMethod().args({
      id: rpcString(),
      limit: rpcNumber()
    }),
    getAgentTranscriptWindow: rpcMethod().args(transcriptWindowArgs),
    openAgentTail: rpcMethod().args({
      id: rpcString(),
      limit: rpcNumber(),
      sessionId: rpcOptional(rpcString())
    }),
    getAgentTranscriptTail: rpcMethod().args(transcriptTailArgs),
    getAgentThread: rpcMethod().args({ id: rpcString(), rootId: rpcString() }),
    sendPrompt: rpcMethod().args(sendPromptArgs),
    promptAcceptanceStatus: rpcMethod().args(gatewayAcceptanceStatusArgs),
    respondToWidget: rpcMethod().args({
      entryId: rpcString(),
      value: rpcString(),
      agentId: rpcString()
    }),
    resolveAutoReviewApproval: rpcMethod().args({
      entryId: rpcString(),
      requestId: rpcString(),
      resolution: oneOf("approval resolution", SAND_AUTO_REVIEW_RESOLUTIONS),
      agentId: rpcString(),
      approvalPlatform: rpcOptional(approvalPlatform),
      approvedCommand: rpcOptional(rpcString()),
      sessionId: rpcOptional(rpcString())
    }),
    resolveLocalToolPermission: rpcMethod().args(localToolPermissionArgs),
    resolveConnectorGrant: rpcMethod().args(connectorGrantArgs),
    resolveVirtualCardApproval: rpcMethod().args({
      entryId: rpcString(),
      requestId: rpcString(),
      resolution: oneOf("virtual card resolution", ["approved", "denied", "failed", "expired"]),
      agentId: rpcString(),
      spendRequestId: rpcOptional(rpcString()),
      failureReason: rpcOptional(rpcString()),
      paymentMethodId: rpcOptional(rpcString())
    }),
    resolveMessagesGrants: rpcMethod().args({ requestId: rpcString() }),
    requestMessagesGrants: rpcMethod().args({
      requestId: rpcString(),
      grants: rpcArray(oneOf("messages grant", MESSAGES_GRANTS))
    }),
    awaitMessagesGrants: rpcMethod().args({
      requestId: rpcString(),
      waitMs: rpcNumber()
    }),
    cancelMessagesGrants: rpcMethod().args({ requestId: rpcString() }),
    requestCookieOriginApproval: rpcMethod().args({
      requestId: rpcString(),
      origins: rpcArray(cookieOriginRequestEntry),
      agentId: rpcOptional(rpcString())
    }),
    awaitCookieOriginApproval: rpcMethod().args({
      requestId: rpcString(),
      waitMs: rpcNumber()
    }),
    cancelCookieOriginApproval: rpcMethod().args({ requestId: rpcString() }),
    requestWebAuthnCeremony: rpcMethod().args(webAuthnCeremonyRequest),
    dismissWidget: rpcMethod().args({
      entryId: rpcString(),
      agentId: rpcString()
    }),
    submitSecret: rpcMethod().args({
      entryId: rpcString(),
      value: rpcString(),
      agentId: rpcString(),
      sessionId: rpcOptional(rpcString())
    }),
    storeSecret: rpcMethod().args({
      target: rpcUnion(
        rpcObject({
          kind: rpcLiteral("box-env"),
          name: rpcString()
        }),
        rpcObject({
          kind: rpcLiteral("channel-credential"),
          platform: rpcString(),
          field: rpcString()
        })
      ),
      value: rpcString(),
      agentId: rpcString()
    }),
    submitUserForm: rpcMethod().args({
      entryId: rpcString(),
      values: stringRecord,
      agentId: rpcString(),
      platform: rpcOptional(clientPlatform)
    }),
    dismissUserForm: rpcMethod().args({
      entryId: rpcString(),
      mode: oneOf("dismissal mode", ["dismissed", "escalated"]),
      agentId: rpcString(),
      platform: rpcOptional(clientPlatform)
    }),
    sendDraft: rpcMethod().args({
      entryId: rpcString(),
      draft: draftPayload,
      agentId: rpcString(),
      sessionId: rpcOptional(rpcString())
    }),
    discardDraft: rpcMethod().args({
      entryId: rpcString(),
      agentId: rpcString(),
      sessionId: rpcOptional(rpcString())
    }),
    reactToMessage: rpcMethod().args({
      entryId: rpcString(),
      emoji: rpcString(),
      agentId: rpcString()
    }),
    voteFeedback: rpcMethod().args({
      agentId: rpcString(),
      entryId: rpcString(),
      action: oneOf("feedback action", SAND_FEEDBACK_ACTIONS),
      categories: rpcOptional(rpcArray(rpcString())),
      comment: rpcOptional(rpcString())
    }),
    publishBotTemplate: rpcMethod().args(botTemplatePublishArgs),
    listBotTemplates: rpcMethod().noArgs,
    getBotTemplateVersion: rpcMethod().args(botTemplateVersionArgs),
    getBotTemplateForSourceAgent: rpcMethod().args(
      botTemplateForSourceAgentArgs
    ),
    getBotTemplateExportPolicy: rpcMethod().noArgs,
    deleteBotTemplate: rpcMethod().args(botTemplateDeleteArgs),
    setBotTemplateVisibility: rpcMethod().args(botTemplateVisibilityArgs),
    listAgents: rpcMethod().noArgs,
    countAgents: rpcMethod().noArgs,
    searchAgents: rpcMethod().args({
      query: rpcString(),
      limit: rpcOptional(rpcNumber())
    }),
    searchMedia: rpcMethod().args({
      query: rpcString(),
      limit: rpcOptional(rpcNumber())
    }),
    openAgent: rpcMethod().args(idArgs),
    createAgent: rpcMethod().args(createAgentArgs),
    createAgentFromTemplate: rpcMethod().args(
      createAgentFromTemplateArgs
    ),
    createGroup: rpcMethod().args({
      name: rpcString(),
      description: rpcOptional(rpcString()),
      memberAgentIds: rpcArray(rpcString()),
      humanMemberUserIds: rpcOptional(rpcArray(rpcNumber())),
      namedBy: rpcOptional(oneOf("name provenance", SAND_PROFILE_NAMED_BY)),
      creationRoute: rpcOptional(
        rpcUnion(
          rpcObject({ kind: rpcLiteral("box") }),
          rpcObject({ kind: rpcLiteral("temporal"), scope: rpcString() })
        )
      ),
      clientNonce: rpcOptional(rpcString())
    }),
    setGroupMembers: rpcMethod().args({
      id: rpcString(),
      memberAgentIds: rpcArray(rpcString()),
      requesterAgentId: rpcOptional(rpcString())
    }),
    updateAgent: rpcMethod().args({
      id: rpcString(),
      profile: agentProfile
    }),
    seedConversationName: rpcMethod().args({
      id: rpcString(),
      prompt: rpcString()
    }),
    deleteAgents: rpcMethod().args({ ids: rpcArray(rpcString()) }),
    duplicateAgent: rpcMethod().args(idArgs),
    kickstartAgent: rpcMethod().args(idArgs),
    interruptAgentRun: rpcMethod().args({
      id: rpcString(),
      sessionId: rpcOptional(rpcString())
    }),
    requestDiskSaverAudit: rpcMethod().args(idArgs),
    broadcastToAgents: rpcMethod().args({
      targets: rpcUnion(rpcLiteral("all"), rpcArray(rpcString())),
      message: rpcString()
    }),
    getCloudAgentInfo: rpcMethod().args({
      bcId: rpcString(),
      includeFiles: rpcOptional(rpcBoolean()),
      includeArtifacts: rpcOptional(rpcBoolean())
    }),
    getCloudAgentConversation: rpcMethod().args({
      bcId: rpcString()
    }),
    getCloudAgentWatch: rpcMethod().args({ bcId: rpcString() }),
    ensureCloudAgentArtifacts: rpcMethod().args({
      agentId: rpcString(),
      bcId: rpcString()
    }),
    stopCloudAgent: rpcMethod().args({ bcId: rpcString() }),
    getListenerIntegrations: rpcMethod().noArgs,
    getListenerConnectUrl: rpcMethod().args({
      platform: rpcString(),
      forceOauth: rpcOptional(rpcBoolean()),
      oauthRedirectUri: rpcOauthRedirectUri
    }),
    disconnectListenerPlatform: rpcMethod().args({ platform: rpcString() }),
    completeGithubConnect: rpcMethod().args({
      state: rpcString(),
      code: rpcOptional(rpcString()),
      installationId: rpcOptional(rpcString()),
      setupAction: rpcOptional(rpcString()),
      error: rpcOptional(rpcString())
    }),
    setAgentUnread: rpcMethod().args({
      id: rpcString(),
      isUnread: rpcBoolean(),
      atMs: rpcOptional(rpcNumber())
    }),
    clearGeneratedRoomNameStamps: rpcMethod().args({
      rooms: rpcArray(rpcObject({ id: rpcString(), generatedName: rpcString() }))
    }),
    setAgentHiddenFromSidebar: rpcMethod().args({
      id: rpcString(),
      isHidden: rpcBoolean()
    }),
    setAgentNotificationsEnabled: rpcMethod().args({
      id: rpcString(),
      isEnabled: rpcBoolean()
    }),
    setAgentNotifyOnUpdates: rpcMethod().args({
      id: rpcString(),
      isEnabled: rpcBoolean()
    }),
    setAgentVoice: rpcMethod().args({
      id: rpcString(),
      voiceId: rpcOptional(rpcNullable(rpcString())),
      voiceSpeed: rpcOptional(rpcNumber()),
      voiceLanguage: rpcOptional(rpcString())
    }),
    previewVoice: rpcMethod().args({
      voiceId: rpcString(),
      greetingId: rpcString()
    }),
    setAgentAvatarBytes: rpcMethod().args({
      id: rpcString(),
      pngBase64: rpcNullable(rpcString())
    }),
    getAgentAvatar: rpcMethod().args(idArgs),
    getAgentNotificationAvatar: rpcMethod().args(idArgs),
    getAgentTodos: rpcMethod().args(idArgs),
    getAgentWorkflows: rpcMethod().args(idArgs),
    createAgentWorkflow: rpcMethod().args({
      id: rpcString(),
      spec: skillSpec
    }),
    updateAgentWorkflow: rpcMethod().args({
      ...idAndSkillArgs,
      spec: skillSpec
    }),
    deleteAgentWorkflow: rpcMethod().args(idAndSkillArgs),
    runAgentWorkflowNow: rpcMethod().args(idAndSkillArgs),
    importAgentWorkflowText: rpcMethod().args({
      id: rpcString(),
      markdown: rpcString(),
      name: rpcOptional(rpcString())
    }),
    importAgentWorkflowUrl: rpcMethod().args({
      id: rpcString(),
      url: rpcString(),
      name: rpcOptional(rpcString())
    }),
    getConversationOutline: rpcMethod().args(idArgs),
    readMainAgentContext: rpcMethod().args(idArgs),
    readVoiceCallSentMessages: rpcMethod().args(idArgs),
    nudgeVoiceCall: rpcMethod().args({
      id: rpcString(),
      callId: rpcString(),
      request: rpcString(),
      spokenTurns: rpcArray(rpcString())
    }),
    recordVoiceCall: rpcMethod().args({ record: voiceCallRecord }),
    setVoiceCallPresence: rpcMethod().args({
      id: rpcString(),
      callId: rpcString(),
      isOnTheLine: rpcBoolean(),
      acceptsOverheard: rpcOptional(rpcBoolean())
    }),
    getVoiceCall: rpcMethod().args({
      id: rpcString(),
      callId: rpcString()
    }),
    skillsCatalog: rpcMethod().noArgs,
    syncPluginSkills: rpcMethod().noArgs,
    getPluginSyncStatus: rpcMethod().noArgs,
    getMcpState: rpcMethod().noArgs,
    getMcpCatalog: rpcMethod().noArgs,
    getEffectiveMcpPlugins: rpcMethod().noArgs,
    getMcpPluginLogo: rpcMethod().args({ url: rpcString() }),
    installMcpEntry: rpcMethod().args(mcpInstallEntryRequest),
    updateMcpPluginInstall: rpcMethod().args(mcpUpdatePluginInstallRequest),
    removeMcpServer: rpcMethod().args(mcpServerIdArgs),
    uninstallMcpPlugin: rpcMethod().args({ pluginId: rpcString() }),
    authenticateMcpServer: rpcMethod().args(mcpAuthenticateRequest),
    renameMcpAccount: rpcMethod().args(mcpRenameAccountRequest),
    removeMcpAccount: rpcMethod().args(mcpAccountRef),
    setMcpCustomInstructions: rpcMethod().args(mcpSetInstructionsRequest),
    listMcpServerTools: rpcMethod().args(mcpServerIdArgs),
    toggleMcpToolDisabled: rpcMethod().args(
      mcpToggleToolDisabledRequest
    ),
    transcribeAudio: rpcMethod().args(transcribeAudioArgs),
    generateAgentAvatarImage: rpcMethod().args({
      description: rpcString()
    }),
    getSkillPublishTargets: rpcMethod().noArgs,
    publishSkill: rpcMethod().args({
      workflowId: rpcString(),
      teamId: rpcNumber()
    }),
    resyncPublishedSkill: rpcMethod().args({ workflowId: rpcString() }),
    unpublishSkill: rpcMethod().args({ workflowId: rpcString() }),
    getSubagents: rpcMethod().args(idArgs),
    getAsyncTasks: rpcMethod().args(idArgs),
    getTrays: rpcMethod().noArgs,
    dismissTray: rpcMethod().args(idArgs),
    clearTrays: rpcMethod().noArgs,
    getAgentChannels: rpcMethod().args(idArgs),
    connectChannel: rpcMethod().args({
      ...agentIdAndPlatform,
      token: rpcString()
    }),
    disconnectChannel: rpcMethod().args(agentIdAndPlatform),
    refreshChannel: rpcMethod().args(agentIdAndPlatform),
    getBoxSecretsStatus: rpcMethod().noArgs,
    getAgentAutomations: rpcMethod().args(idArgs),
    getAutomationWebhookCredential: rpcMethod().args(agentIdAndAutomationId),
    listAllAutomations: rpcMethod().noArgs,
    isGlobalSearchEnabled: rpcMethod().noArgs,
    isEgressTunnelAvailable: rpcMethod().noArgs,
    setAgentAutomationEnabled: rpcMethod().args({
      ...agentIdAndAutomationId,
      isEnabled: rpcBoolean()
    }),
    createAgentAutomation: rpcMethod().args({
      id: rpcString(),
      spec: automationSpec
    }),
    updateAgentAutomation: rpcMethod().args({
      ...agentIdAndAutomationId,
      spec: automationSpec
    }),
    deleteAgentAutomation: rpcMethod().args(agentIdAndAutomationId),
    runAgentAutomationNow: rpcMethod().args({
      ...agentIdAndAutomationId,
      sessionId: rpcOptional(rpcString())
    }),
    getForeverBoxStatus: rpcMethod().args(idArgs),
    ensureForeverBox: rpcMethod().args(idArgs),
    handBackForeverBox: rpcMethod().args({
      id: rpcString(),
      trigger: rpcOptional(boxHandBackTrigger),
      requestId: rpcOptional(rpcString())
    }),
    startTeachRecording: rpcMethod().args({
      agentId: rpcString(),
      entryPoint: teachEntryPoint
    }),
    stopTeachRecording: rpcMethod().args({
      agentId: rpcString(),
      save: rpcBoolean()
    }),
    getTeachRecordingStatus: rpcMethod().noArgs,
    uploadAttachment: rpcMethod().args(uploadAttachmentArgs),
    uploadAttachmentChunk: rpcMethod().args(uploadAttachmentChunkArgs),
    readAttachmentImage: rpcMethod().args({
      path: rpcString(),
      rendition: rpcOptional(rpcUnion(rpcLiteral("preview"), rpcLiteral("original")))
    }),
    readAttachmentText: rpcMethod().args(readAttachmentTextArgs),
    readAttachmentChunk: rpcMethod().args(readAttachmentChunkArgs),
    getHostSettings: rpcMethod().noArgs,
    setHostSettings: rpcMethod().args(hostSettingsUpdate),
    setBoxSecrets: rpcMethod().args({ secrets: stringRecord }),
    carryBoxSecretsToBot: rpcMethod().args({
      serverId: rpcString(),
      names: rpcArray(rpcString())
    }),
    injectChromeCookies: rpcMethod().args({
      cookies: rpcArray(chromeCookieRecord)
    }),
    refreshMcp: rpcMethod().args({ completion: rpcOptional(mcpAuthCompletion) }),
    listBoxMcpServers: rpcMethod().args({
      serverIdentifiers: rpcArray(rpcString())
    }),
    completeMcpOAuth: rpcMethod().args({ code: rpcString(), state: rpcString() }),
    updateForeverBox: rpcMethod().args(idArgs),
    setWindowFocused: rpcMethod().args({ isFocused: rpcBoolean() }),
    getHostStatus: rpcMethod().args(hostStatusArgs),
    updateHostNow: rpcMethod().args({
      force: rpcOptional(rpcBoolean()),
      includeErrorDetail: rpcOptional(rpcBoolean())
    })
  },
  events: rpcType(),
  capabilities: rpcType(),
  failureCodes: rpcType()
});
