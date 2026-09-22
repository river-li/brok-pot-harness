/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/host-gateway-api.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/4
var import_node_crypto14 = require("node:crypto");

// @recovered-fragment 2/4
init_errors();

// @recovered-fragment 3/4
init_unknown_record();

// @recovered-fragment 4/4
var BASE_HOST_CAPABILITIES = [
  ORDERED_REPLICAS_V1,
  "sendAcceptanceV1",
  VOICE_SETTINGS_V1
];
var CREATE_AGENT_NONCE_LEDGER_CAP = 64;
function botTemplateGatewayView(view) {
  const { description: description9, ...rest } = view;
  return { ...rest, body: description9 };
}
async function hostCapabilities(deps) {
  const experiments = deps.extensions.api("experiments");
  const peek = { disableExposureLog: true };
  if (!experiments.checkFeatureGate("sand_share_bot", peek)) {
    return BASE_HOST_CAPABILITIES;
  }
  if (sandShareBotExportPolicyOf(
    experiments.getDynamicConfig("sand_share_bot_export_policy", peek)
  ) === "none") {
    return BASE_HOST_CAPABILITIES;
  }
  const hasExportSkill = await deps.extensions.api("managed-setup").ensureManagedSkill(EXPORT_BOT_TEMPLATE_MANAGED_SKILL_ID);
  return hasExportSkill ? [...BASE_HOST_CAPABILITIES, BOT_TEMPLATE_JSON_SHARE_V1, BOT_TEMPLATE_VISIBILITY_V1] : BASE_HOST_CAPABILITIES;
}
function createTemplateImportGatewayMethod(deps) {
  const manager = deps.extensions.api("transcript");
  const mintsByAgentId = /* @__PURE__ */ new Map();
  return {
    createAgentFromTemplate: ({
      shareId,
      agentId,
      expectedActiveVersion,
      creatorContext,
      language
    }) => {
      const pending = mintsByAgentId.get(agentId);
      if (pending != null) return pending;
      const minted = (async () => {
        const identity = deps.extensions.api("agent-identity");
        const imported = await identity.createAgentFromTemplate({
          shareId,
          agentId,
          expectedActiveVersion,
          ...creatorContext === void 0 ? {} : { creatorContext },
          ...language === void 0 ? {} : { language }
        });
        let profile;
        if (imported.kind === "server_backed") {
          profile = {
            name: imported.agent.name,
            description: imported.agent.description
          };
          profile = { ...profile, title: imported.agent.title };
          profile = {
            ...profile,
            avatarShape: imported.agent.avatarShape,
            avatarColor: imported.agent.avatarColor
          };
        } else {
          profile = imported.profile;
        }
        let local;
        const existing = manager.listAgentsSync().find((agent) => agent.id === agentId);
        if (existing === void 0) {
          let options2 = {
            isIntroductionSuppressed: true,
            agentId
          };
          if (imported.kind === "server_backed") {
            options2 = { ...options2, serverId: imported.agent.serverId };
            if (imported.agent.harness !== null) {
              options2 = { ...options2, harness: imported.agent.harness };
            }
          }
          try {
            local = await manager.createAgent(profile, "user", options2);
          } catch (error42) {
            const cleanupFailed = (stage) => (cleanupError) => {
              deps.extensions.api("telemetry").logs.reportHostDiagnostic({
                kind: "template_import_cleanup_failed",
                agentId,
                stage,
                errorClass: errorLogTag(cleanupError)
              });
            };
            await manager.deleteAgents([agentId]).catch(cleanupFailed("delete_local"));
            if (imported.kind === "server_backed") {
              await identity.rollbackRemoteAgent({ agentId, serverId: imported.agent.serverId }).catch(cleanupFailed("rollback_remote"));
            }
            throw error42;
          }
          if (imported.kind === "local_only") identity.noteAgentMinted(agentId);
        } else {
          const updated = await manager.updateAgent(agentId, profile);
          if (imported.kind === "server_backed") {
            identity.noteAgentImported(imported.agent);
          } else {
            identity.noteAgentMinted(agentId);
          }
          local = {
            agent: updated ?? existing,
            transcript: await manager.getAgentTranscript(agentId)
          };
        }
        const result = {
          agent: local.agent,
          transcript: local.transcript,
          setup: imported.setup
        };
        deps.extensions.api("telemetry").analytics.markActive("user_action");
        deps.extensions.api("telemetry").analytics.trackEvent("sand.agent.created", {
          agent_id: result.agent.id,
          origin: "user",
          template_id: shareId
        });
        return result;
      })().then(
        (result) => {
          if (result.setup.kind === "unavailable") mintsByAgentId.delete(agentId);
          return result;
        },
        (error42) => {
          mintsByAgentId.delete(agentId);
          throw error42;
        }
      );
      mintsByAgentId.set(agentId, minted);
      for (const oldest of mintsByAgentId.keys()) {
        if (mintsByAgentId.size <= CREATE_AGENT_NONCE_LEDGER_CAP) break;
        mintsByAgentId.delete(oldest);
      }
      return minted;
    }
  };
}
var SERVER_AGENT_PROXY_FULL_READ_LIMIT = 500;
var SERVER_AGENT_PROXY_MAX_READ_PAGES = 4;
function isWindowEntry(entry) {
  return entry.kind !== "tool-call" && !isBranchedEntry(entry);
}
function isRetainedPageEntry(entry, bounds) {
  const withinBounds = entry.timestampMs == null || (bounds.sinceMs == null || entry.timestampMs >= bounds.sinceMs) && entry.timestampMs <= bounds.untilMs;
  return withinBounds && isMainTranscriptPageEntry(entry);
}
async function readTailUntil(args) {
  const collected = [];
  let cursor = args.beforeSeq;
  let nextBeforeSeq;
  for (let pageIndex = 0; pageIndex < SERVER_AGENT_PROXY_MAX_READ_PAGES; pageIndex += 1) {
    const page = await args.read({
      id: args.id,
      limit: args.limit,
      ...cursor === void 0 ? {} : { beforeSeq: cursor }
    });
    collected.unshift(...page.entries);
    nextBeforeSeq = page.nextBeforeSeq;
    if (nextBeforeSeq === void 0 || args.isSatisfied(collected)) break;
    cursor = nextBeforeSeq;
  }
  return { entries: collected, ...nextBeforeSeq === void 0 ? {} : { nextBeforeSeq } };
}
function countWhere(entries, keep) {
  let count = 0;
  for (const entry of entries) if (keep(entry)) count += 1;
  return count;
}
function windowOf(raw, nextBeforeSeq) {
  const entries = raw.filter(isWindowEntry);
  const counts = branchReplyCounts(raw.filter(isBranchedEntry));
  const threadCounts = {};
  for (const entry of entries) {
    const count = counts.get(entry.id);
    if (count !== void 0) threadCounts[entry.id] = count;
  }
  return {
    entries,
    ...nextBeforeSeq === void 0 ? {} : { nextBeforeSeq },
    threadCounts
  };
}
var ServerAgentProxyRefusedError = class extends SandDomainError {
  name = "ServerAgentProxyRefusedError";
  failureCode;
  constructor(message, failureCode) {
    super(message);
    this.failureCode = failureCode;
  }
};
var ServerAgentProxyUnavailableError = class extends SandDomainError {
  name = "ServerAgentProxyUnavailableError";
  kind;
  constructor(message, kind) {
    super(message);
    this.kind = kind;
  }
};
function acceptanceStatusFrom(value) {
  return value === "accepted" || value === "rejected" || value === "pending" ? value : null;
}
function acceptanceLookupFrom(value) {
  if (!isUnknownRecord(value)) return { outcome: "unknown-durability" };
  if (value.outcome === "not-found") return { outcome: "not-found" };
  if (value.outcome !== "found" || !isUnknownRecord(value.record)) {
    return { outcome: "unknown-durability" };
  }
  const record2 = value.record;
  const status = acceptanceStatusFrom(record2.status);
  if (status === null || typeof record2.accountSlot !== "string" || typeof record2.clientNonce !== "string" || typeof record2.inputDigest !== "string" || typeof record2.acceptedAtMs !== "number" || typeof record2.agentId !== "string") {
    return { outcome: "unknown-durability" };
  }
  return {
    outcome: "found",
    record: {
      accountSlot: record2.accountSlot,
      clientNonce: record2.clientNonce,
      inputDigest: record2.inputDigest,
      status,
      acceptedAtMs: record2.acceptedAtMs,
      agentId: record2.agentId,
      echoEntryId: typeof record2.echoEntryId === "string" ? record2.echoEntryId : null,
      rejectionCode: typeof record2.rejectionCode === "string" ? record2.rejectionCode : null
    }
  };
}
var discardValue = () => null;
function wrapGatewayApiWithServerAgentProxy(args) {
  const { api, proxy } = args;
  const settle = async (reply2, onOk, fallback2) => {
    switch (reply2.status) {
      case "ok":
        return onOk(reply2.value);
      case "refused":
        throw new ServerAgentProxyRefusedError(reply2.message, reply2.failureCode);
      case "unavailable":
        throw new ServerAgentProxyUnavailableError(reply2.message, reply2.kind);
      case "unimplemented":
        return await fallback2();
    }
  };
  const act = async (request5, onOk, fallback2) => settle(await proxy.performAction(request5), onOk, fallback2);
  const activate = (agentId) => {
    void args.activateAgent(agentId).catch((error42) => {
      proxy.log(`agent activation failed for ${agentId}: ${errorLogTag(error42)}`);
    });
  };
  const openRead = (query) => query.beforeSeq === void 0 ? proxy.openAgentTail({ id: query.id, limit: query.limit }) : proxy.getAgentTranscriptTail(query);
  const tailRead = (query) => proxy.getAgentTranscriptTail(query);
  const readMainAgentContext = async (readArgs) => {
    if (!proxy.isProxiedAgent(readArgs.id)) return api.readMainAgentContext(readArgs);
    const live = proxy.activityOverlayFor(readArgs.id)?.live ?? null;
    return { agentId: readArgs.id, isWorking: live !== null && liveOverlayRunningTurn(live) };
  };
  const markRead = (agentId) => {
    void act(
      { method: "setAgentUnread", args: { id: agentId, isUnread: false } },
      discardValue,
      async () => null
    ).catch((error42) => {
      proxy.log(`mark-read action failed for ${agentId}: ${errorLogTag(error42)}`);
    });
    void api.setAgentUnread({ id: agentId, isUnread: false }).catch((error42) => {
      proxy.log(`mark-read mirror failed for ${agentId}: ${errorLogTag(error42)}`);
    });
  };
  const isAgentSummary = (value) => isUnknownRecord(value) && typeof value.id === "string";
  return {
    ...api,
    createGroup: async (createArgs) => {
      if (createArgs.creationRoute?.kind === "box" || !await proxy.serverRoomsEnabled()) {
        return api.createGroup(createArgs);
      }
      return settle(
        await proxy.createRoom({
          name: createArgs.name,
          description: createArgs.description ?? "",
          memberAgentIds: createArgs.memberAgentIds
        }),
        (value) => {
          if (!isUnknownRecord(value) || !isAgentSummary(value.agent)) {
            throw new ServerAgentProxyRefusedError("The server returned no room.", null);
          }
          return { agent: value.agent, transcript: [] };
        },
        async () => await api.createGroup(createArgs)
      );
    },
    setGroupMembers: async (membersArgs) => {
      if (!proxy.isProxiedAgent(membersArgs.id)) return api.setGroupMembers(membersArgs);
      return settle(
        await proxy.setRoomMembers({
          id: membersArgs.id,
          memberAgentIds: membersArgs.memberAgentIds
        }),
        (value) => isAgentSummary(value) ? value : null,
        async () => {
          throw new ServerAgentProxyRefusedError(
            "The server doesn't support editing this room's members yet.",
            null
          );
        }
      );
    },
    sendPrompt: async (sendArgs) => {
      if (!proxy.isProxiedAgent(sendArgs.agentId)) return api.sendPrompt(sendArgs);
      const clientNonce = sendArgs.clientNonce != null && sendArgs.clientNonce.length > 0 ? sendArgs.clientNonce : (0, import_node_crypto14.randomUUID)();
      return await act(
        { method: "sendPrompt", args: { ...sendArgs, clientNonce } },
        (value) => ({ accepted: isUnknownRecord(value) && value.accepted === true }),
        async () => await api.sendPrompt(sendArgs)
      );
    },
    promptAcceptanceStatus: async (statusArgs) => {
      const agentId = statusArgs.agentId;
      if (agentId == null || agentId.length === 0 || !proxy.isProxiedAgent(agentId)) {
        return api.promptAcceptanceStatus(statusArgs);
      }
      return await act(
        {
          method: "promptAcceptanceStatus",
          args: { agentId, clientNonce: statusArgs.clientNonce }
        },
        acceptanceLookupFrom,
        async () => await api.promptAcceptanceStatus(statusArgs)
      );
    },
    interruptAgentRun: async (interruptArgs) => {
      if (!proxy.isProxiedAgent(interruptArgs.id)) return api.interruptAgentRun(interruptArgs);
      const { id, sessionId } = interruptArgs;
      return await act(
        { method: "interruptAgentRun", args: { id, ...sessionId == null ? {} : { sessionId } } },
        (value) => ({ hadActiveRun: isUnknownRecord(value) && value.hadActiveRun === true }),
        async () => await api.interruptAgentRun(interruptArgs)
      );
    },
    respondToWidget: async (widgetArgs) => {
      if (!proxy.isProxiedAgent(widgetArgs.agentId)) return api.respondToWidget(widgetArgs);
      return await act(
        { method: "respondToWidget", args: widgetArgs },
        (value) => ({ accepted: !isUnknownRecord(value) || value.accepted !== false }),
        async () => await api.respondToWidget(widgetArgs)
      );
    },
    submitSecret: async (secretArgs) => {
      if (!proxy.isProxiedAgent(secretArgs.agentId)) return api.submitSecret(secretArgs);
      await act({ method: "submitSecret", args: secretArgs }, discardValue, async () => {
        await api.submitSecret(secretArgs);
        return null;
      });
    },
    dismissWidget: async (widgetArgs) => {
      if (!proxy.isProxiedAgent(widgetArgs.agentId)) return api.dismissWidget(widgetArgs);
      return await act(
        { method: "dismissWidget", args: widgetArgs },
        (value) => ({ accepted: !isUnknownRecord(value) || value.accepted !== false }),
        async () => await api.dismissWidget(widgetArgs)
      );
    },
    submitUserForm: async (formArgs) => {
      if (!proxy.isProxiedAgent(formArgs.agentId)) return api.submitUserForm(formArgs);
      await act({ method: "submitUserForm", args: formArgs }, discardValue, async () => {
        await api.submitUserForm(formArgs);
        return null;
      });
    },
    dismissUserForm: async (formArgs) => {
      if (!proxy.isProxiedAgent(formArgs.agentId)) return api.dismissUserForm(formArgs);
      await act({ method: "dismissUserForm", args: formArgs }, discardValue, async () => {
        await api.dismissUserForm(formArgs);
        return null;
      });
    },
    reactToMessage: async (reactArgs) => {
      if (!proxy.isProxiedAgent(reactArgs.agentId)) return api.reactToMessage(reactArgs);
      await act({ method: "reactToMessage", args: reactArgs }, discardValue, async () => {
        await api.reactToMessage(reactArgs);
        return null;
      });
    },
    voteFeedback: async (voteArgs) => {
      if (!proxy.isProxiedAgent(voteArgs.agentId)) return api.voteFeedback(voteArgs);
      await act({ method: "voteFeedback", args: voteArgs }, discardValue, async () => {
        await api.voteFeedback(voteArgs);
        return null;
      });
    },
    resolveAutoReviewApproval: async (approvalArgs) => {
      if (!proxy.isProxiedAgent(approvalArgs.agentId)) {
        return api.resolveAutoReviewApproval(approvalArgs);
      }
      await act(
        { method: "resolveAutoReviewApproval", args: approvalArgs },
        discardValue,
        async () => {
          await api.resolveAutoReviewApproval(approvalArgs);
          return null;
        }
      );
    },
    resolveLocalToolPermission: async (permissionArgs) => {
      if (!proxy.isProxiedAgent(permissionArgs.agentId)) {
        return api.resolveLocalToolPermission(permissionArgs);
      }
      await act(
        { method: "resolveLocalToolPermission", args: permissionArgs },
        discardValue,
        async () => {
          await api.resolveLocalToolPermission(permissionArgs);
          return null;
        }
      );
    },
    resolveVirtualCardApproval: async (cardArgs) => {
      const { resolution } = cardArgs;
      if (!proxy.isProxiedAgent(cardArgs.agentId) || resolution !== "approved" && resolution !== "denied") {
        return api.resolveVirtualCardApproval(cardArgs);
      }
      await act(
        {
          method: "resolveVirtualCardApproval",
          args: {
            entryId: cardArgs.entryId,
            requestId: cardArgs.requestId,
            resolution,
            agentId: cardArgs.agentId
          }
        },
        discardValue,
        async () => {
          await api.resolveVirtualCardApproval(cardArgs);
          return null;
        }
      );
    },
    handBackForeverBox: async (handBackArgs) => {
      if (!proxy.isProxiedAgent(handBackArgs.id)) return api.handBackForeverBox(handBackArgs);
      const requestId2 = handBackArgs.requestId ?? proxy.activityOverlayFor(handBackArgs.id)?.live?.boxHandoff?.requestId;
      if (requestId2 === void 0) return;
      await act(
        {
          method: "handBackForeverBox",
          args: {
            id: handBackArgs.id,
            requestId: requestId2,
            ...handBackArgs.trigger === void 0 ? {} : { trigger: handBackArgs.trigger }
          }
        },
        discardValue,
        async () => {
          await api.handBackForeverBox(handBackArgs);
          return null;
        }
      );
    },
    setAgentUnread: async (unreadArgs) => {
      if (!proxy.isProxiedAgent(unreadArgs.id)) return api.setAgentUnread(unreadArgs);
      await api.setAgentUnread(unreadArgs).catch((error42) => {
        proxy.log(`unread mirror failed for ${unreadArgs.id}: ${errorLogTag(error42)}`);
      });
      await act(
        {
          method: "setAgentUnread",
          args: { id: unreadArgs.id, isUnread: unreadArgs.isUnread }
        },
        discardValue,
        async () => null
      );
    },
    setAgentHiddenFromSidebar: async (hiddenArgs) => {
      if (!proxy.isProxiedAgent(hiddenArgs.id)) return api.setAgentHiddenFromSidebar(hiddenArgs);
      await api.setAgentHiddenFromSidebar(hiddenArgs).catch((error42) => {
        proxy.log(`hidden mirror failed for ${hiddenArgs.id}: ${errorLogTag(error42)}`);
      });
      await settle(
        await proxy.setAgentHidden(hiddenArgs.id, hiddenArgs.isHidden),
        discardValue,
        async () => null
      );
    },
    openAgentTail: async (readArgs) => {
      if (!proxy.isProxiedAgent(readArgs.id)) return api.openAgentTail(readArgs);
      const page = await proxy.openAgentTail(readArgs);
      activate(readArgs.id);
      markRead(readArgs.id);
      return page;
    },
    getAgentTranscriptTail: async (readArgs) => {
      if (!proxy.isProxiedAgent(readArgs.id)) return api.getAgentTranscriptTail(readArgs);
      return await proxy.getAgentTranscriptTail(readArgs);
    },
    openAgent: async (readArgs) => {
      if (!proxy.isProxiedAgent(readArgs.id)) return api.openAgent(readArgs);
      const page = await proxy.openAgentTail({
        id: readArgs.id,
        limit: SERVER_AGENT_PROXY_FULL_READ_LIMIT
      });
      activate(readArgs.id);
      markRead(readArgs.id);
      return page.entries;
    },
    openAgentWindowed: async (readArgs) => {
      if (!proxy.isProxiedAgent(readArgs.id)) return api.openAgentWindowed(readArgs);
      const { entries, nextBeforeSeq } = await readTailUntil({
        read: openRead,
        id: readArgs.id,
        limit: readArgs.limit,
        isSatisfied: (rows) => countWhere(rows, isWindowEntry) >= readArgs.limit
      });
      activate(readArgs.id);
      markRead(readArgs.id);
      return windowOf(entries, nextBeforeSeq);
    },
    getAgentTranscript: async (readArgs) => {
      if (!proxy.isProxiedAgent(readArgs.id)) return api.getAgentTranscript(readArgs);
      const page = await proxy.openAgentTail({
        id: readArgs.id,
        limit: SERVER_AGENT_PROXY_FULL_READ_LIMIT
      });
      return page.entries;
    },
    readVoiceCallSentMessages: async (readArgs) => {
      if (!proxy.isProxiedAgent(readArgs.id)) return api.readVoiceCallSentMessages(readArgs);
      return VoiceCallWrittenMessages.recall(
        (query) => proxy.getAgentTranscriptTail({ id: readArgs.id, ...query })
      );
    },
    readMainAgentContext,
    readVoiceCallAgentContext: readMainAgentContext,
    getAgentTranscriptWindow: async (readArgs) => {
      if (!proxy.isProxiedAgent(readArgs.id)) return api.getAgentTranscriptWindow(readArgs);
      const { entries, nextBeforeSeq } = await readTailUntil({
        read: tailRead,
        id: readArgs.id,
        limit: readArgs.limit,
        ...readArgs.beforeSeq === void 0 ? {} : { beforeSeq: readArgs.beforeSeq },
        isSatisfied: (rows) => countWhere(rows, isWindowEntry) >= readArgs.limit
      });
      return windowOf(entries, nextBeforeSeq);
    },
    getAgentTranscriptPage: async (readArgs) => {
      if (!proxy.isProxiedAgent(readArgs.id)) return api.getAgentTranscriptPage(readArgs);
      const keep = (entry) => isRetainedPageEntry(entry, readArgs);
      const { entries, nextBeforeSeq } = await readTailUntil({
        read: tailRead,
        id: readArgs.id,
        limit: readArgs.limit,
        ...readArgs.beforeSeq === void 0 ? {} : { beforeSeq: readArgs.beforeSeq },
        isSatisfied: (rows) => countWhere(rows, keep) >= readArgs.limit
      });
      return {
        entries: entries.filter(keep),
        ...nextBeforeSeq === void 0 ? {} : { nextBeforeSeq }
      };
    },
    getAgentThread: async (threadArgs) => {
      if (!proxy.isProxiedAgent(threadArgs.id)) return api.getAgentThread(threadArgs);
      const { entries } = await readTailUntil({
        read: openRead,
        id: threadArgs.id,
        limit: SERVER_AGENT_PROXY_FULL_READ_LIMIT,
        isSatisfied: (rows) => rows.some((entry) => entry.id === threadArgs.rootId)
      });
      return { entries: getThreadTranscriptEntries(entries, threadArgs.rootId) };
    }
  };
}
function createHostGatewayApi(deps) {
  const manager = deps.extensions.api("transcript");
  const attachments = deps.extensions.api("attachments");
  const automations = deps.extensions.api("automations");
  const managedSetup = deps.extensions.api("managed-setup");
  const settings = deps.extensions.api("settings");
  const localToolPermission2 = deps.extensions.api("local-tool-permission");
  const createAgentMintsByNonce = /* @__PURE__ */ new Map();
  const voiceRelaysInFlight = /* @__PURE__ */ new Set();
  const voiceRelayKey = (args) => `${args.id}
${args.callId}
${args.request.trim()}`;
  const credentialDecisionsInFlight = /* @__PURE__ */ new Set();
  const withCredentialDecision = async (entryId, alreadyInFlight, decide) => {
    if (credentialDecisionsInFlight.has(entryId)) return alreadyInFlight;
    credentialDecisionsInFlight.add(entryId);
    try {
      return await decide();
    } finally {
      credentialDecisionsInFlight.delete(entryId);
    }
  };
  const mintAgent = async (args) => {
    const identity = deps.extensions.api("agent-identity");
    let config2 = {
      name: args.name,
      description: args.description
    };
    if (args.title !== void 0) config2 = { ...config2, title: args.title };
    if (args.avatarShape !== void 0) config2 = { ...config2, avatarShape: args.avatarShape };
    if (args.avatarColor !== void 0) config2 = { ...config2, avatarColor: args.avatarColor };
    const options2 = {
      isIntroductionSuppressed: args.isIntroductionSuppressed ?? false,
      isKickstartRequested: args.isKickstartRequested ?? false,
      ...isSandAgentPurpose(args.purpose) ? { purpose: args.purpose } : {},
      ...args.language === void 0 ? {} : { language: args.language }
    };
    const remote = args.harness === "temporal" || await identity.isWriteEnabled() ? await identity.createRemoteAgentFirst(
      {
        name: args.name,
        description: args.description,
        title: args.title ?? "",
        avatarShape: args.avatarShape ?? "",
        avatarColor: args.avatarColor ?? "",
        kickstartRequested: args.isKickstartRequested ?? true,
        introductionSuppressed: options2.isIntroductionSuppressed,
        ...options2.purpose === void 0 ? {} : { purpose: options2.purpose },
        ...args.language === void 0 ? {} : { language: args.language }
      },
      args.harness === void 0 ? void 0 : { harness: args.harness }
    ) : null;
    let createOptions = options2;
    if (remote !== null) {
      createOptions = { ...options2, agentId: remote.agentId, serverId: remote.serverId };
      if (remote.harness !== null) createOptions = { ...createOptions, harness: remote.harness };
      config2 = { ...config2, avatarShape: remote.avatarShape, avatarColor: remote.avatarColor };
    }
    let result;
    try {
      result = await manager.createAgent(config2, args.origin, createOptions);
    } catch (error42) {
      if (remote !== null)
        identity.rollbackRemoteAgent({ agentId: remote.agentId, serverId: remote.serverId });
      throw error42;
    }
    if (remote === null) {
      identity.noteAgentMinted(result.agent.id);
    }
    deps.extensions.api("telemetry").analytics.markActive("user_action");
    const templateId = sanitizeTemplateId(args.templateId);
    deps.extensions.api("telemetry").analytics.trackEvent("sand.agent.created", {
      agent_id: result.agent.id,
      origin: args.origin ?? "user",
      ...templateId !== void 0 ? { template_id: templateId } : {}
    });
    return result;
  };
  const deleteAgentsAndReport = async (ids) => {
    const startedAt = Date.now();
    for (const id of ids) {
      void deps.extensions.api("agent-identity").noteAgentDeleted(id);
    }
    const { transcript, stats } = await manager.deleteAgents(ids);
    for (const id of ids) {
      deps.extensions.api("session").forgetHandoff(id);
      deps.extensions.api("session").forgetUserForm(id);
    }
    let boxReleaseMs = 0;
    for (const id of ids) {
      await automations.deleteAgentSchedules(id);
      const boxStartedAt = Date.now();
      await deps.releaseAgentBox(id);
      boxReleaseMs += Date.now() - boxStartedAt;
      deps.hostEvents.emit({
        kind: "notification-agent-forgotten",
        agentId: id
      });
      deps.forgetLocalToolPermission(id);
    }
    deps.extensions.api("telemetry").brain.reportAgentDelete({
      agentCount: ids.length,
      deletedActive: stats.deletedActive,
      totalMs: Date.now() - startedAt,
      drainMs: stats.drainMs,
      diskDeleteMs: stats.diskDeleteMs,
      successorMs: stats.successorMs,
      boxReleaseMs
    });
    return { transcript };
  };
  const writeLocalProfile = async (id, write2) => {
    const identity = deps.extensions.api("agent-identity");
    const adopted = await identity.adoptServerAgentById(id);
    if (adopted === "missing") {
      throw new ServerAgentProxyRefusedError(
        "The agent is not on this computer and could not be loaded from the server, so the profile update was not saved.",
        SAND_AGENT_RENAME_REFUSED
      );
    }
    if (adopted === "unavailable") {
      throw new ServerAgentProxyUnavailableError(
        "The server roster could not be read, so the profile update was not saved yet.",
        "network"
      );
    }
    return identity.expectLocalEdit(id, write2);
  };
  const userFormCommands = {
    submitUserForm: (args) => manager.submitUserForm(args),
    dismissUserForm: (args) => manager.dismissUserForm(args)
  };
  const api = {
    ...createTemplateImportGatewayMethod(deps),
    getAgentTranscript: (args) => manager.getAgentTranscript(args.id),
    getAgentTranscriptPage: async (args) => manager.getAgentTranscriptPage(args.id, args),
    getAgentTranscriptWindow: async (args) => manager.getAgentTranscriptWindow(args.id, args),
    getAgentTranscriptTail: async (args) => manager.getAgentTranscriptTail(args.id, args),
    getAgentThread: async (args) => manager.getAgentThread(args.id, args.rootId),
    sendPrompt: async (args) => {
      const sentToAgentId = (typeof args.agentId === "string" && args.agentId.length > 0 ? args.agentId : void 0) ?? manager.getActiveAgentId() ?? deps.rosterBookkeeping?.latestActiveAgentId ?? "unknown";
      deps.extensions.api("telemetry").reportMessageSent({
        ...args,
        agentId: sentToAgentId,
        isGroupRoom: manager.listAgentsSync().find((agent) => agent.id === sentToAgentId)?.isGroup === true
      });
      await manager.sendPrompt(args.prompt, {
        agentId: args.agentId,
        directAddressedAcceptance: args.directAddressedAcceptance,
        attachmentPaths: args.attachmentPaths ?? [],
        attachmentNames: args.attachmentNames ?? [],
        richText: args.richText,
        replyToId: args.replyToId,
        clientNonce: args.clientNonce,
        isFork: args.isFork,
        automationWriteProvenance: args.automationWriteProvenance,
        traceparent: args.traceparent,
        enterEpochMs: args.enterEpochMs,
        composedAtMs: args.composedAtMs,
        mcpConfigJson: args.mcpConfigJson,
        machineId: args.machineId,
        awaitTurn: deps.environment.sendAcceptReturnDisabled
      });
      return { accepted: true };
    },
    promptAcceptanceStatus: async (args) => manager.promptAcceptanceStatus(args),
    respondToWidget: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      deps.extensions.api("telemetry").analytics.trackEvent("sand.widget.responded", {
        agent_id: args.agentId
      });
      return manager.respondToWidget(args.entryId, args.value, args.agentId);
    },
    resolveAutoReviewApproval: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      const { approvalPlatform: approvalPlatform2, ...rest } = args;
      return deps.extensions.api("auto-review").resolveApproval({
        ...rest,
        ...isSandApprovalPlatform(approvalPlatform2) ? { approvalPlatform: approvalPlatform2 } : {}
      });
    },
    resolveLocalToolPermission: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      await localToolPermission2.resolveAsk(args);
    },
    resolveVirtualCardApproval: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      deps.extensions.api("session").forgetVirtualCard(args.agentId);
      await manager.widgetResponses.resolveVirtualCardApproval(args);
    },
    resolveMessagesGrants: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      deps.extensions.api("messages-grants").resolve(args.requestId);
    },
    requestMessagesGrants: async (args) => deps.extensions.api("messages-grants").begin(args),
    awaitMessagesGrants: (args) => deps.extensions.api("messages-grants").awaitAsk(args),
    cancelMessagesGrants: async (args) => deps.extensions.api("messages-grants").cancel(args.requestId),
    requestCookieOriginApproval: (args) => deps.extensions.api("cookie-origin-approval").beginRequest({
      ...args,
      origins: args.origins.map(cookieOriginRequestEntryFromWire)
    }),
    awaitCookieOriginApproval: (args) => deps.extensions.api("cookie-origin-approval").awaitRequest(args),
    cancelCookieOriginApproval: (args) => deps.extensions.api("cookie-origin-approval").cancelRequest(args),
    dismissWidget: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      deps.extensions.api("telemetry").analytics.trackEvent("sand.widget.dismissed", {
        agent_id: args.agentId
      });
      return manager.dismissWidget(args);
    },
    submitSecret: (args) => manager.submitSecret(args.entryId, args.value, args.agentId),
    storeSecret: (args) => manager.storeSecret(args.target, args.value, args.agentId),
    ...userFormCommands,
    sendDraft: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      deps.extensions.api("telemetry").analytics.trackEvent("sand.draft.sent", {
        agent_id: args.agentId
      });
      return manager.sendDraft(args);
    },
    discardDraft: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      deps.extensions.api("telemetry").analytics.trackEvent("sand.draft.discarded", {
        agent_id: args.agentId
      });
      return manager.discardDraft(args);
    },
    reactToMessage: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      deps.extensions.api("telemetry").analytics.trackEvent("sand.reaction.added", {
        agent_id: args.agentId
      });
      return manager.reactToMessage(args.entryId, args.emoji, args.agentId);
    },
    voteFeedback: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      return deps.extensions.api("feedback").voteFeedback(args);
    },
    publishBotTemplate: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      return botTemplateGatewayView(await deps.extensions.api("bot-template-share").publish(args));
    },
    listBotTemplates: async () => [],
    getBotTemplateVersion: async (args) => botTemplateGatewayView(await deps.extensions.api("bot-template-share").getVersion(args)),
    getBotTemplateForSourceAgent: async (args) => {
      const view = await deps.extensions.api("bot-template-share").getForSourceAgent(args);
      return view == null ? null : botTemplateGatewayView(view);
    },
    getBotTemplateExportPolicy: async () => {
      const exportPolicy = await deps.extensions.api("bot-template-share").getExportPolicy?.();
      return isSandShareBotExportPolicy(exportPolicy) ? { exportPolicy } : {};
    },
    deleteBotTemplate: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      return deps.extensions.api("bot-template-share").delete(args);
    },
    setBotTemplateVisibility: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      return deps.extensions.api("bot-template-share").setVisibility(args);
    },
    appendConnectorCard: (args) => manager.appendConnectorCard(args),
    listAgents: () => manager.listAgents(),
    countAgents: () => manager.countAgentsOnDisk(),
    searchAgents: (args) => manager.searchAgents(args.query, args.limit),
    searchMedia: (args) => manager.searchMedia(args.query, args.limit),
    createAgent: (args) => {
      const nonce = args.clientNonce;
      if (nonce == null || nonce.length === 0) return mintAgent(args);
      const pending = createAgentMintsByNonce.get(nonce);
      if (pending != null) return pending;
      const minted = mintAgent(args).catch((error42) => {
        createAgentMintsByNonce.delete(nonce);
        throw error42;
      });
      createAgentMintsByNonce.set(nonce, minted);
      for (const oldest of createAgentMintsByNonce.keys()) {
        if (createAgentMintsByNonce.size <= CREATE_AGENT_NONCE_LEDGER_CAP) break;
        createAgentMintsByNonce.delete(oldest);
      }
      return minted;
    },
    kickstartAgent: async (args) => ({
      isIntroductionInFlight: await deps.kickstartIfPending(args.id)
    }),
    interruptAgentRun: async (args) => ({
      hadActiveRun: normalizeGrokBotSessionId(args.sessionId) === DEFAULT_GROK_BOT_SESSION_ID && manager.interruptAgentRun(args.id)
    }),
    requestDiskSaverAudit: async (args) => ({
      isAuditInFlight: await deps.requestDiskSaverAudit(args.id)
    }),
    createGroup: (args) => manager.createGroup({
      name: args.name,
      description: args.description,
      memberIds: args.memberAgentIds,
      namedBy: args.namedBy
    }),
    clearGeneratedRoomNameStamps: (args) => deps.extensions.api("agent-identity").clearGeneratedRoomNameStamps(args.rooms),
    setGroupMembers: (args) => manager.setGroupMembers(args.id, args.memberAgentIds, {
      ...args.requesterAgentId === void 0 ? {} : { requesterAgentId: args.requesterAgentId }
    }),
    updateAgent: (args) => writeLocalProfile(args.id, () => manager.updateAgent(args.id, args.profile)),
    seedConversationName: (args) => writeLocalProfile(args.id, () => manager.seedConversationName(args)),
    deleteAgent: (args) => deleteAgentsAndReport([args.id]),
    deleteAgents: (args) => deleteAgentsAndReport(args.ids),
    duplicateAgent: async (args) => {
      const result = await manager.cloneAgent(args.id);
      deps.extensions.api("agent-identity").noteAgentMinted(result.agent.id);
      return result;
    },
    setAgentUnread: (args) => manager.setAgentUnread(args.id, args.isUnread, args.atMs),
    setAgentNotificationsEnabled: async () => {
    },
    setAgentNotifyOnUpdates: (args) => manager.setAgentNotifyOnUpdates(args.id, args.isEnabled),
    setAgentVoice: (args) => manager.setAgentVoice({
      agentId: args.id,
      ...args.voiceId === void 0 ? {} : { voiceId: args.voiceId },
      ...args.voiceSpeed === void 0 ? {} : { voiceSpeed: args.voiceSpeed },
      ...args.voiceLanguage === void 0 ? {} : { voiceLanguage: args.voiceLanguage }
    }),
    previewVoice: ({ voiceId, greetingId }) => deps.extensions.api("inference").previewVoice({ voiceId, greetingId }),
    setAgentHiddenFromSidebar: (args) => manager.setAgentHiddenFromSidebar(args.id, args.isHidden),
    openAgent: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("app_open");
      deps.extensions.api("telemetry").noteSandModelExperimentActive();
      const wasActive = manager.getActiveAgentId() === args.id;
      const startedAt = Date.now();
      const entries = await manager.switchAgent(args.id);
      deps.extensions.api("telemetry").logs.reportAgentOpen({
        conversationId: args.id,
        durationMs: Date.now() - startedAt,
        entryCount: entries.length,
        wasActive
      });
      void deps.kickstartIfPending(args.id);
      return entries;
    },
    openAgentWindowed: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("app_open");
      deps.extensions.api("telemetry").noteSandModelExperimentActive();
      const wasActive = manager.getActiveAgentId() === args.id;
      const startedAt = Date.now();
      const window2 = await manager.openAgentWindowed(args.id, args.limit);
      deps.extensions.api("telemetry").logs.reportAgentOpen({
        conversationId: args.id,
        durationMs: Date.now() - startedAt,
        entryCount: window2.entries.length,
        wasActive
      });
      void deps.kickstartIfPending(args.id);
      return window2;
    },
    openAgentTail: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("app_open");
      deps.extensions.api("telemetry").noteSandModelExperimentActive();
      const wasActive = manager.getActiveAgentId() === args.id;
      const startedAt = Date.now();
      const tail = await manager.openAgentTail(args.id, args.limit);
      deps.extensions.api("telemetry").logs.reportAgentOpen({
        conversationId: args.id,
        durationMs: Date.now() - startedAt,
        entryCount: tail.entries.length,
        wasActive
      });
      void deps.kickstartIfPending(args.id);
      return tail;
    },
    setWindowFocused: (args) => deps.setWindowFocused(args.isFocused),
    getAgentAutomations: (args) => manager.getAgentAutomations(args.id),
    getAgentTodos: (args) => manager.getAgentTodos(args.id),
    getAutomationWebhookCredential: (args) => automations.getWebhookCredential({ agentId: args.id, localId: args.automationId }),
    listAllAutomations: () => manager.listAllAutomations(),
    isGlobalSearchEnabled: async () => true,
    isEgressTunnelAvailable: async () => deps.environment.egressTunnelEnabled,
    setAgentAutomationEnabled: (args) => manager.setAgentAutomationEnabled(args.id, args.automationId, args.isEnabled),
    createAgentAutomation: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      const countBefore = (await manager.getAgentAutomations(args.id)).length;
      const automations2 = await manager.createAgentAutomation(args.id, args.spec);
      if (automations2.length > countBefore) {
        deps.extensions.api("telemetry").analytics.trackEvent("sand.automation.created", {
          agent_id: args.id,
          trigger_type: args.spec.trigger.type,
          source: "automations_ui"
        });
      }
      return automations2;
    },
    updateAgentAutomation: (args) => manager.updateAgentAutomation(args.id, args.automationId, args.spec),
    deleteAgentAutomation: (args) => manager.deleteAgentAutomation(args.id, args.automationId),
    runAgentAutomationNow: (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      const sessionId = normalizeGrokBotSessionId(args.sessionId);
      const isTemporalAgent = deps.extensions.api("server-agent-proxy").isProxiedAgent(args.id);
      if (isTemporalAgent || sessionId !== DEFAULT_GROK_BOT_SESSION_ID) {
        return automations.runNowInSession({
          agentId: args.id,
          localId: args.automationId,
          sessionId
        });
      }
      return manager.runAgentAutomationNow(args.id, args.automationId);
    },
    broadcastToAgents: async (args) => {
      deps.extensions.api("telemetry").analytics.markActive("user_action");
      const result = await manager.broadcastToAgents(args.targets, args.message);
      deps.extensions.api("telemetry").analytics.trackEvent("sand.broadcast.sent", {
        total: result.total,
        scheduled: result.scheduled,
        targets: args.targets === "all" ? "all" : "subset"
      });
      return result;
    },
    getAgentWorkflows: (args) => manager.getAgentWorkflows(args.id),
    createAgentWorkflow: async (args) => {
      const isAutomation = args.spec.trigger != null;
      if (isAutomation) {
        deps.extensions.api("telemetry").analytics.markActive("user_action");
      }
      const countBefore = isAutomation ? (await manager.getAgentAutomations(args.id)).length : 0;
      const skills = await manager.createAgentWorkflow(args.id, args.spec);
      if (isAutomation) {
        const countAfter = (await manager.getAgentAutomations(args.id)).length;
        if (countAfter > countBefore) {
          deps.extensions.api("telemetry").analytics.trackEvent("sand.automation.created", {
            agent_id: args.id,
            trigger_type: "cron",
            source: "workflow_ui"
          });
        }
      }
      return skills;
    },
    updateAgentWorkflow: (args) => manager.updateAgentWorkflow(args.id, args.workflowId, args.spec),
    deleteAgentWorkflow: (args) => manager.deleteAgentWorkflow(args.id, args.workflowId),
    runAgentWorkflowNow: (args) => manager.runAgentWorkflowNow(args.id, args.workflowId),
    importAgentWorkflowText: (args) => manager.importAgentSkillMarkdown(args.id, args.markdown, args.name),
    importAgentWorkflowUrl: (args) => manager.importAgentWorkflowUrl(args.id, args.url, args.name),
    getConversationOutline: (args) => manager.getConversationOutline(args.id),
    readMainAgentContext: (args) => manager.readMainAgentContext({ agentId: args.id }),
    readVoiceCallSentMessages: (args) => manager.readVoiceCallSentMessages(args.id),
    nudgeVoiceCall: async (args) => {
      const proxy = deps.extensions.api("server-agent-proxy");
      if (!proxy.isProxiedAgent(args.id)) {
        return manager.nudgeVoiceCall({
          agentId: args.id,
          callId: args.callId,
          request: args.request,
          sink: { kind: "box-loop" }
        });
      }
      const key = voiceRelayKey(args);
      if (voiceRelaysInFlight.has(key)) {
        return { kind: "refused", refusal: "agent-unavailable" };
      }
      voiceRelaysInFlight.add(key);
      try {
        return await manager.nudgeVoiceCall({
          agentId: args.id,
          callId: args.callId,
          request: args.request,
          sink: {
            kind: "server-loop",
            relay: (relay) => proxy.relayVoiceCallNudge({ agentId: args.id, ...relay })
          }
        });
      } finally {
        voiceRelaysInFlight.delete(key);
      }
    },
    recordVoiceCall: (args) => {
      const proxy = deps.extensions.api("server-agent-proxy");
      return manager.recordVoiceCall(
        args.record,
        proxy.isProxiedAgent(args.record.agentId) ? { kind: "server", publish: proxy.publishVoiceCallReceipt } : { kind: "box-chat" }
      );
    },
    setVoiceCallPresence: async (args) => {
      manager.setVoiceCallPresence({
        agentId: args.id,
        callId: args.callId,
        isOnTheLine: args.isOnTheLine,
        acceptsOverheard: args.acceptsOverheard ?? false
      });
    },
    getVoiceCall: async (args) => manager.readVoiceCall({ agentId: args.id, callId: args.callId }),
    skillsCatalog: () => managedSetup.skillsCatalog(),
    syncPluginSkills: () => deps.extensions.api("mcp").syncPluginSkills(),
    getPluginSyncStatus: async () => deps.extensions.api("mcp").pluginSyncStatus(),
    getMcpState: () => deps.extensions.api("mcp").plugins.listServers(),
    getMcpCatalog: () => deps.extensions.api("mcp").plugins.getCatalog(),
    getEffectiveMcpPlugins: () => deps.extensions.api("mcp").plugins.listEffectivePlugins(),
    getMcpPluginLogo: async ({ url: url2 }) => {
      const dataUrl = await deps.extensions.api("mcp").plugins.resolvePluginLogo(url2);
      return dataUrl == null ? null : { dataUrl };
    },
    installMcpEntry: (args) => deps.extensions.api("mcp").plugins.installEntry(args),
    updateMcpPluginInstall: (args) => deps.extensions.api("mcp").plugins.updatePluginInstall(args),
    removeMcpServer: ({ serverId }) => deps.extensions.api("mcp").plugins.removeServer(serverId),
    uninstallMcpPlugin: ({ pluginId }) => deps.extensions.api("mcp").plugins.uninstallPlugin(pluginId),
    authenticateMcpServer: (args) => deps.extensions.api("mcp").plugins.authenticateServer(args),
    renameMcpAccount: (args) => deps.extensions.api("mcp").plugins.renameAccount(args),
    removeMcpAccount: (args) => deps.extensions.api("mcp").plugins.removeAccount(args),
    setMcpCustomInstructions: (args) => deps.extensions.api("mcp").plugins.setCustomInstructions(args),
    listMcpServerTools: ({ serverId }) => deps.extensions.api("mcp").plugins.listServerTools(serverId),
    toggleMcpToolDisabled: (args) => deps.extensions.api("mcp").plugins.toggleToolDisabled(args),
    transcribeAudio: ({ audioBase64, mimeType, language }) => deps.extensions.api("inference").transcribeAudio({
      audio: new Uint8Array(Buffer.from(audioBase64, "base64")),
      mimeType,
      ...language === void 0 ? {} : { language }
    }),
    generateAgentAvatarImage: ({ description: description9 }) => attachments.generateAvatarImage(description9),
    getSkillPublishTargets: () => deps.extensions.api("mcp").skillPublish.listTargets(),
    publishSkill: (args) => deps.extensions.api("mcp").skillPublish.publish(args),
    resyncPublishedSkill: (args) => deps.extensions.api("mcp").skillPublish.resync(args),
    unpublishSkill: (args) => deps.extensions.api("mcp").skillPublish.unpublish(args),
    getAgentChannels: (args) => automations.getAgentChannels(args.id),
    connectChannel: async (args) => {
      manager.connectChannel(args.id, args.platform, args.token);
      return automations.getAgentChannels(args.id);
    },
    disconnectChannel: async (args) => {
      manager.disconnectChannel(args.id, args.platform);
      return automations.getAgentChannels(args.id);
    },
    refreshChannel: async (args) => automations.getAgentChannels(args.id),
    getListenerIntegrations: () => automations.getListenerIntegrations(),
    getListenerConnectUrl: async (args) => ({
      url: await automations.getListenerConnectUrl(args.platform, {
        forceOauth: args.forceOauth,
        oauthRedirectUri: args.oauthRedirectUri
      })
    }),
    disconnectListenerPlatform: async (args) => {
      await automations.disconnectListenerPlatform(args.platform);
      deps.extensions.api("mcp").mcp.refreshAccountConfig();
    },
    completeGithubConnect: (args) => automations.completeGithubConnect(args),
    getSubagents: (args) => manager.getSubagents(args.id),
    getAsyncTasks: (args) => manager.getAsyncTasks(args.id),
    setAgentAvatarBytes: async (args) => {
      const summary = await writeLocalProfile(
        args.id,
        () => manager.setAgentAvatarBytes(
          args.id,
          args.pngBase64 == null ? null : new Uint8Array(Buffer.from(args.pngBase64, "base64"))
        )
      );
      if (summary?.harness === "temporal") {
        await deps.extensions.api("agent-identity").flushPendingEdits();
      }
      return summary;
    },
    getAgentAvatar: (args) => manager.getAgentAvatar(args.id),
    getAgentNotificationAvatar: (args) => manager.getAgentNotificationAvatar(args.id),
    getForeverBoxStatus: async (args) => deps.decorateForeverBoxStatus(await deps.extensions.api("forever-box").getStatus(args)),
    getCloudAgentInfo: (args) => deps.extensions.api("cloud-agents").getInfo(args.bcId, {
      ...args.includeFiles === void 0 ? {} : { includeFiles: args.includeFiles },
      ...args.includeArtifacts === void 0 ? {} : { includeArtifacts: args.includeArtifacts }
    }),
    getCloudAgentConversation: (args) => deps.extensions.api("cloud-agents").getConversation({ bcId: args.bcId }),
    getCloudAgentWatch: (args) => deps.extensions.api("cloud-agents").getWatch(args.bcId),
    ensureCloudAgentArtifacts: (args) => deps.extensions.api("cloud-agents").artifacts.ensure(args.agentId, args.bcId),
    stopCloudAgent: (args) => deps.extensions.api("cloud-agents").cancel(args.bcId),
    ensureForeverBox: async (args) => deps.decorateForeverBoxStatus(await deps.extensions.api("forever-box").ensure(args)),
    updateForeverBox: async (args) => deps.decorateForeverBoxStatus(await deps.extensions.api("forever-box").update(args)),
    autoUpdateBoxNow: async () => deps.extensions.api("forever-box").autoUpdateNow(),
    snapshotBoxStoreNow: async (args) => await deps.extensions.api("box-store-sync").snapshotBoxStoreNow(args),
    getBoxStoreStatus: async () => await deps.extensions.api("box-store-sync").getBoxStoreStatus(),
    clearBoxStoreNow: async () => await deps.extensions.api("box-store-sync").clearBoxStoreNow(),
    updateHostNow: (args) => deps.extensions.api("host-upgrade").updateHostNow(args),
    getHostStatus: async ({ includeManagedCapabilities }) => ({
      ...deps.extensions.api("host-upgrade").getVersionState(),
      isBusy: deps.getHealth().isBusy,
      capabilities: includeManagedCapabilities ? await hostCapabilities(deps) : BASE_HOST_CAPABILITIES
    }),
    setBoxMigrating: async (args) => {
      deps.extensions.api("forever-box").setMigrating({ migrating: args.migrating === true });
      return { ok: true };
    },
    setHttpProxyName: (args) => deps.extensions.api("telemetry").setHttpProxyName(args.name),
    getHttpProxyName: async () => ({
      name: deps.extensions.api("telemetry").logs.getHttpProxyName() ?? null
    }),
    syncUserSecrets: async (args) => await deps.extensions.api("secrets").syncUserSecrets(args),
    prepareBoxForRecreate: () => deps.extensions.api("resume-ownership").prepareForRecreate(),
    resumeBoxAfterRecreate: (args) => deps.extensions.api("resume-ownership").resumeAfterRecreate({
      agentIds: args.agentIds ?? [],
      pendingWakes: args.pendingWakes
    }),
    deliverAgentMessage: async (args) => ({
      status: await manager.receivePeerAgentMessage({
        from: args.from,
        toAgentId: args.toAgentId,
        text: args.text,
        messageId: args.messageId
      })
    }),
    reconcileAgentIdentity: async () => ({
      ok: await deps.extensions.api("agent-identity").reconcileNow()
    }),
    exportGrokBotWorkingState: (args) => deps.extensions.api("working-state-export").exportAgent(args.agentId, {
      maxClosureBytes: args.maxClosureBytes,
      maxClosureBlobs: args.maxClosureBlobs,
      readBatchBlobs: args.readBatchBlobs,
      putConcurrency: args.putConcurrency,
      expectedServerId: args.expectedServerId,
      trigger: args.trigger
    }),
    getPauseState: async () => manager.getPauseState(),
    getHarnessMigrationWindow: async () => {
      const identityCoverage = await deps.extensions.api("agent-identity").getHarnessMigrationCoverage();
      const settled = deps.extensions.api("resume-ownership").getSettledHostWindow();
      if (settled.kind === "active") {
        return {
          window: "settled_host",
          operationId: settled.operationId,
          fenceStatus: settled.status,
          identityCoverage
        };
      }
      return { window: "none", identityCoverage };
    },
    listPromotableRooms: () => listPromotableRooms({
      listAgents: () => manager.listAgents(),
      isServerBound: (agentId) => isSandAgentServerBound(deps.extensions.api("session").store.getAgentDir(agentId)),
      isTurnInFlight: (agentId) => manager.liveRunningAgentIds().has(agentId),
      flushTranscript: (agentId) => deps.extensions.api("transcript-publish").flushAgent(agentId),
      readClientStateSeed: (agentId) => deps.extensions.api("working-state-export").readClientStateSeed(agentId)
    }),
    listSidebarSections: async () => deps.extensions.api("settings").listSidebarSections().map(({ id, name: name17 }) => ({ id, name: name17 })),
    assignAgentToSidebarSection: async ({ agentId, sectionId }) => deps.extensions.api("settings").assignAgentToSidebarSection(agentId, sectionId)?.map(({ id, name: name17 }) => ({ id, name: name17 })) ?? null,
    deliverRoomMemberTurnResult: async (args) => ({
      status: manager.receiveRoomMemberTurnResult({
        roomId: String(args.roomId ?? ""),
        nonce: String(args.nonce ?? ""),
        memberAgentId: String(args.memberAgentId ?? ""),
        outcome: args.outcome,
        messages: Array.isArray(args.messages) ? args.messages : [],
        ...typeof args.error === "string" ? { error: args.error } : {}
      })
    }),
    runRoomMemberTurn: (args) => manager.runRemoteRoomMemberTurn(args),
    cancelRoomMemberTurn: async (args) => manager.cancelRemoteRoomMemberTurn(args),
    handBackForeverBox: (args) => deps.extensions.api("session").endHandoff(args.id, args.trigger ?? "button"),
    startTeachRecording: (args) => deps.extensions.api("teach-recording").start(args),
    stopTeachRecording: (args) => deps.extensions.api("teach-recording").stop(args),
    getTeachRecordingStatus: async () => deps.extensions.api("teach-recording").getStatus(),
    getTrays: async () => deps.extensions.api("trays").list(),
    dismissTray: async (args) => deps.extensions.api("trays").dismiss(args),
    clearTrays: async () => deps.extensions.api("trays").clearAll(),
    uploadAttachment: async (args) => await attachments.upload(args),
    uploadAttachmentChunk: async (args) => await attachments.uploadChunk(args),
    readAttachmentImage: async (args) => await attachments.readImage(args),
    readAttachmentText: async (args) => await attachments.readText(args),
    readAttachmentChunk: async (args) => await attachments.readChunk(args),
    getHostSettings: async () => settings.getHostSettings(),
    setHostSettings: async (args) => {
      const result = settings.setHostSettings(args);
      if (args.localToolPermission !== void 0) {
        localToolPermission2.notePermissionChanged(args.localToolPermissionMachineId);
      }
      if (args.webauthnProxyEnabled !== void 0) {
        deps.extensions.api("webauthn-proxy").applyEnablement(args.webauthnProxyEnabled);
      }
      if (args.messagesEnabled === false) {
        localToolPermission2.withdrawActions(SAND_MESSAGES_LOCAL_TOOL_ACTIONS);
      }
      return result;
    },
    refreshMcp: async ({ completion }) => {
      if (completion != null) {
        await deps.handleDesktopMcpAuthCompletion(completion);
        return;
      }
      await deps.extensions.api("mcp").management.restart();
    },
    listBoxMcpServers: async ({ serverIdentifiers }) => {
      const servers = await deps.extensions.api("mcp").listBoxServers(serverIdentifiers);
      return {
        servers: servers.map((server) => ({
          serverIdentifier: server.serverIdentifier,
          status: server.status,
          ...server.statusDetail != null ? { statusDetail: server.statusDetail } : {},
          toolCount: server.toolCount
        }))
      };
    },
    completeMcpOAuth: ({ code, state }) => deps.extensions.api("mcp").plugins.completeOAuth({ stateId: state, code }),
    requestWebAuthnCeremony: async (args) => deps.extensions.api("webauthn-proxy").requestCeremony(args),
    setBoxSecrets: async ({ secrets }) => deps.extensions.api("secrets").set({ secrets }),
    carryBoxSecretsToBot: async (args) => deps.extensions.api("secrets").carryToBot(args),
    injectChromeCookies: async ({ cookies }) => deps.extensions.api("chrome-cookie-import").inject(cookies),
    getBoxSecretsStatus: async () => deps.extensions.api("secrets").getStatus(),
    readVoiceCallAgentContext: (args) => manager.readMainAgentContext({ agentId: args.id }),
    resolveCredentialBrowserTarget: ({ item, siteHint }) => deps.extensions.api("credential-provider").resolveBrowserCredentialTarget(
      { ...item, hasOneTimeCode: item.hasOneTimeCode === true },
      siteHint
    ),
    fillBrowserCredentialDirect: ({ approvalMode, ...args }) => deps.extensions.api("credential-provider").fillBrowserCredential({
      ...args,
      item: { ...args.item, hasOneTimeCode: args.item.hasOneTimeCode === true },
      approvalMode: approvalMode ?? "allow-once"
    }),
    fillBrowserPasswordStep: (args) => deps.extensions.api("credential-provider").fillBrowserPasswordStep({
      ...args,
      item: { ...args.item, hasOneTimeCode: args.item.hasOneTimeCode === true }
    }),
    fillBrowserOneTimeCode: (args) => deps.extensions.api("credential-provider").fillBrowserOneTimeCode({
      ...args,
      item: { ...args.item, hasOneTimeCode: args.item.hasOneTimeCode === true }
    }),
    getOpenCredentialRequest: (args) => manager.widgetResponses.getOpenCredentialRequest(args),
    fillBrowserCredential: (args) => withCredentialDecision(
      args.entryId,
      {
        filled: false,
        resolved: false,
        detail: "a decision is already in progress for this request"
      },
      async () => {
        const request5 = await manager.widgetResponses.getOpenCredentialRequest({
          entryId: args.entryId,
          agentId: args.agentId
        });
        if (request5 == null) {
          return {
            filled: false,
            resolved: false,
            detail: "the request is no longer open"
          };
        }
        const provider = deps.extensions.api("credential-provider");
        const item = (await provider.getFreshDirectory())?.items.find(
          (candidate) => candidate.credentialId === request5.credentialId && candidate.connectionId === request5.connectionId && candidate.catalogRevision === request5.catalogRevision
        );
        if (item == null) {
          const detail = "the credential is no longer in the current synced catalog";
          const resolved2 = await manager.widgetResponses.resolveCredentialRequest({
            entryId: args.entryId,
            resolution: "failed",
            agentId: args.agentId,
            detail
          });
          return { filled: false, resolved: resolved2, detail };
        }
        const result = await provider.fillBrowserCredential({
          item,
          targetSite: request5.targetSite,
          ...request5.targetWebSocketDebuggerUrl == null ? {} : { targetWebSocketDebuggerUrl: request5.targetWebSocketDebuggerUrl },
          approvalMode: args.approvalMode ?? "allow-once",
          ...args.username == null ? {} : { username: args.username },
          password: args.password,
          ...args.oneTimeCode == null ? {} : { oneTimeCode: args.oneTimeCode },
          ...args.oneTimeCodeTicket == null ? {} : { oneTimeCodeTicket: args.oneTimeCodeTicket },
          ...args.passwordStepTicket == null ? {} : { passwordStepTicket: args.passwordStepTicket }
        });
        const resolved = await manager.widgetResponses.resolveCredentialRequest({
          entryId: args.entryId,
          resolution: result.filled ? "approved" : "failed",
          agentId: args.agentId,
          ...result.detail == null ? {} : { detail: result.detail }
        });
        return { ...result, resolved };
      }
    ),
    acquireCredentialFillAgentHold: async (args) => {
      const holds = deps.extensions.api("credential-provider").remoteAgentHolds;
      if (holds === void 0) return { kind: "unleased" };
      return await holds.acquire(args);
    },
    releaseCredentialFillAgentHold: async ({ holdId }) => {
      deps.extensions.api("credential-provider").remoteAgentHolds?.release(holdId);
    },
    resolveCredentialRequest: (args) => withCredentialDecision(args.entryId, { resolved: false }, async () => ({
      resolved: await manager.widgetResponses.resolveCredentialRequest(args)
    }))
  };
  return wrapGatewayApiWithServerAgentProxy({
    api,
    proxy: deps.extensions.api("server-agent-proxy"),
    activateAgent: (agentId) => manager.announceRemoteActivation(agentId)
  });
}

