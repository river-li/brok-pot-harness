/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/group-chat-glue.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs96 = require("node:fs");
var import_node_path158 = require("node:path");

// @recovered-fragment 2/2
init_errors();
var SandGroupCreateError = class extends SandDomainError {
  name = "SandGroupCreateError";
};
var SandGroupMemberHarnessError = class extends SandDomainError {
  name = "SandGroupMemberHarnessError";
};
var SandGroupMembersUnavailableError = class extends SandDomainError {
  name = "SandGroupMembersUnavailableError";
};
function temporalOutcomeToMemberTurnOutcome(outcome, messages2) {
  switch (outcome) {
    case "delivered":
      return messages2.length > 0 ? "delivered" : "pass";
    case "pass":
    case "skipped":
    case "timeout":
    case "cancelled":
    case "error":
      return outcome;
  }
}
function remoteRoomTurnOutcomeOf(result, messages2, state) {
  if (messages2.length > 0) return "sent";
  if (state.cancelled) return "cancelled";
  if (state.timedOut) return "timeout";
  switch (result.outcome) {
    case "delivered":
    case "pass":
      return "pass";
    case "error":
      return "error";
    case "skipped":
    case "session_unavailable":
      return "skipped";
  }
}
var GroupChatGlue = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  dmPreemptedGroupMemberIds = /* @__PURE__ */ new Set();
  activeTemporalMemberIdsByGroup = /* @__PURE__ */ new Map();
  remoteRoomTurns = /* @__PURE__ */ new Map();
  async postToGroup(fromAgentId, groupId, text2, priority = false) {
    return (await this.postToGroupWithStatus({ fromAgentId, groupId, text: text2, priority })).reply;
  }
  async postToGroupWithStatus(args) {
    const { fromAgentId, groupId, text: text2, priority = false } = args;
    const message = clampAgentMessage(text2);
    if (message.length === 0) {
      return { status: "empty", reply: "Message was empty; nothing was sent." };
    }
    if (isPassContent(message)) {
      return {
        status: "empty",
        reply: 'Nothing was posted: "(pass)" means staying silent in a group chat.'
      };
    }
    if (!this.tm.execution.canExecute) {
      return { status: "unavailable", reply: "Messaging isn't available right now." };
    }
    let groupSession;
    try {
      groupSession = await this.tm.sessions.resolveBackgroundSession(groupId);
    } catch (error42) {
      if (!isAgentAbsent(error42)) reportFallback("group_chat_glue", error42);
      return { status: "not_found", reply: `No group found with id ${groupId}.` };
    }
    const config2 = this.localGroupConfig((0, import_node_path158.dirname)(groupSession.dbPath));
    if (config2 == null) {
      return { status: "not_found", reply: `${groupId} is not a group chat.` };
    }
    if (!config2.memberIds.includes(fromAgentId)) {
      return {
        status: "not_member",
        reply: "You can only post to a group you're a member of."
      };
    }
    const groupName = this.groupIdentityFor(groupSession).name;
    const member = (await this.resolveGroupMembers([fromAgentId]))[0] ?? {
      id: fromAgentId,
      name: "A Bot",
      description: ""
    };
    this.tm.productAnalytics.trackEvent("sand.agent_message.sent", {
      from_agent_id: fromAgentId,
      to_agent_id: groupId,
      is_group_target: true,
      is_priority: priority
    });
    this.tm.backgroundWakes.appendAgentOutboundEntry(
      fromAgentId,
      { id: groupId, name: groupName, kind: "group" },
      message,
      Date.now()
    );
    this.postGroupMemberMessage(groupSession, member, message);
    const epoch = this.tm.sendPipeline.nextTurnEpoch(groupSession);
    this.tm.runLifecycle.beginSessionRun(groupSession);
    void this.tm.runLifecycle.enqueueExclusiveRun(
      groupSession.id,
      () => {
        this.tm.turnRuntime.activeRequestSources.set(groupSession.id, "agent");
        return this.runGroupTurn(groupSession, epoch, { lane: "agent" });
      },
      { lane: "agent", source: "agent" }
    );
    return {
      status: "posted",
      reply: `Posted to "${groupName}". Its members will see it and reply on their own turns.`
    };
  }
  async pinMemberSessionForGroupTurn(memberId) {
    if (this.tm.sessions.isAgentGone(memberId)) throw new AgentGoneError(memberId);
    const live = this.tm.sessions.liveSessions.get(memberId);
    if (live != null) {
      this.tm.runLifecycle.beginSessionRun(live, { isGroupMemberTurn: true });
      return live;
    }
    const opened = await this.tm.sessions.openSessionOnce(memberId);
    this.tm.runLifecycle.beginSessionRun(opened, { isGroupMemberTurn: true });
    return opened;
  }
  async createGroup(args) {
    const memberIds = await this.resolveGroupMemberIds(args.memberIds);
    const created = await this.tm.createAgent(
      { name: args.name, description: args.description ?? "" },
      "user",
      { namedBy: args.namedBy ?? null }
    );
    this.sealGroup(created.agent.id, memberIds);
    await this.tm.roster.emitAgents();
    return {
      agent: await this.finalizedSummary(created.agent.id, created.agent),
      transcript: created.transcript
    };
  }
  async createGroupInBackground(args) {
    const memberIds = await this.resolveGroupMemberIds(args.memberIds);
    const created = await this.tm.createBackgroundAgent(
      { name: args.name, description: args.description ?? "" },
      "user",
      { namedBy: args.namedBy ?? null }
    );
    this.sealGroup(created.agent.id, memberIds);
    await this.tm.roster.emitAgents();
    return this.finalizedSummary(created.agent.id, created.agent);
  }
  async resolveGroupMemberIds(requestedMemberIds) {
    const allAgents = await this.tm.sessionStore.listAgents();
    const existing = new Set(allAgents.map((agent) => agent.id));
    const groupIds = new Set(allAgents.filter((agent) => agent.isGroup).map((agent) => agent.id));
    const requested = [...new Set(requestedMemberIds)];
    assertMembersAreNotGroups(requested, (id) => groupIds.has(id));
    const memberIds = requested.filter((id) => existing.has(id)).slice(0, GROUP_MAX_MEMBERS);
    if (memberIds.length === 0) {
      throw new SandGroupCreateError("A group needs at least one existing member agent.");
    }
    return memberIds;
  }
  sealGroup(groupId, memberIds) {
    writeSandGroupConfig(this.tm.sessionStore.getAgentDir(groupId), {
      version: GROUP_CONFIG_VERSION,
      memberIds
    });
    this.tm.productAnalytics.trackEvent("sand.group.created", {
      group_id: groupId,
      member_count: memberIds.length
    });
  }
  async finalizedSummary(agentId, fallback2) {
    const stamp = this.tm.roster.reserveSnapshotStamp();
    const summary = (await this.tm.sessionStore.listAgents(agentId)).find((agent) => agent.id === agentId) ?? fallback2;
    return this.tm.roster.finalizeSummaryForRpc(summary, stamp);
  }
  async setGroupMembers(groupId, memberIds, options2 = {}) {
    const dir = this.tm.sessionStore.getAgentDir(groupId);
    const currentConfig = this.localGroupConfig(dir);
    if (currentConfig == null) return null;
    if (options2.requesterAgentId !== void 0 && !currentConfig.memberIds.includes(options2.requesterAgentId)) {
      return null;
    }
    if (!this.tm.execution.isLocalWorkAllowed) {
      throw new SandGroupMembersUnavailableError(
        "Group members can't be changed while this box is upgrading or migrating."
      );
    }
    const allAgents = await this.tm.sessionStore.listAgents();
    const existing = new Set(allAgents.map((agent) => agent.id));
    const groupIds = new Set(allAgents.filter((agent) => agent.isGroup).map((agent) => agent.id));
    const requested = [...new Set(memberIds)];
    assertMembersAreNotGroups(requested, (id) => groupIds.has(id));
    const cleaned = requested.filter((id) => id !== groupId && existing.has(id)).slice(0, GROUP_MAX_MEMBERS);
    if (cleaned.length > 0) {
      writeSandGroupConfig(dir, {
        version: GROUP_CONFIG_VERSION,
        memberIds: cleaned
      });
      await this.tm.roster.emitAgents();
    }
    const stamp = this.tm.roster.reserveSnapshotStamp();
    const summary = (await this.tm.sessionStore.listAgents(groupId)).find(
      (agent) => agent.id === groupId
    );
    return summary == null ? null : this.tm.roster.finalizeSummaryForRpc(summary, stamp);
  }
  isGroupSession(session) {
    return isSandGroupDir((0, import_node_path158.dirname)(session.dbPath));
  }
  localGroupConfig(dir) {
    const config2 = readSandGroupConfig(dir);
    if (config2 == null) return null;
    return readSandProfileHarness(getSandProfilePath(dir)) === "temporal" ? null : config2;
  }
  isServerRoomSession(session) {
    const dir = (0, import_node_path158.dirname)(session.dbPath);
    return isSandGroupDir(dir) && this.localGroupConfig(dir) == null;
  }
  isGroupAgentId(agentId) {
    return isSandGroupDir(this.tm.sessionStore.getAgentDir(agentId));
  }
  groupIdentityFor(session) {
    const profile = this.tm.roster.resolveAgentProfile(session);
    return { name: profile.name, description: profile.description };
  }
  async runGroupTurn(session, epoch, options2 = {}) {
    try {
      const { traceCtx, lane = "background", attachments, isAttachmentOnlyTurn } = options2;
      const config2 = this.localGroupConfig((0, import_node_path158.dirname)(session.dbPath));
      if (config2 == null) return;
      const orchestrator = new GroupChatOrchestrator(
        this.groupOrchestratorDeps(session, epoch, traceCtx, lane, void 0, attachments)
      );
      await orchestrator.run({
        group: this.groupIdentityFor(session),
        memberIds: config2.memberIds,
        ...isAttachmentOnlyTurn === true ? { isAttachmentOnlyTurn: true } : {}
      });
      await this.tm.roster.emitAgentUpdate(session.id);
    } catch (error42) {
      const description9 = describeAgentRunError(error42);
      this.tm.trayErrors.pushError({
        agentId: session.id,
        ...description9,
        ...hostTrayTitle({ kind: "group_chat_failed", description: description9 })
      });
      await this.tm.roster.emitAgentUpdate(session.id);
    } finally {
      this.tm.runLifecycle.endSessionRun(session);
    }
  }
  groupOrchestratorDeps(session, epoch, traceCtx, lane = "background", requestSource, attachments) {
    return {
      resolveMembers: (ids) => this.resolveGroupMembers(ids),
      readHistory: () => this.readGroupHistory(session),
      runMemberTurn: (request5) => this.runGroupMemberTurn(
        session,
        request5,
        () => this.tm.sendPipeline.currentTurnEpoch(session) === epoch,
        traceCtx,
        lane,
        requestSource,
        attachments
      ),
      postMemberMessage: (member, content) => this.postGroupMemberMessage(session, member, content),
      isCurrent: () => this.tm.sendPipeline.currentTurnEpoch(session) === epoch
    };
  }
  async resolveGroupMembers(memberIds) {
    const members = [];
    for (const id of memberIds) {
      const dir = this.tm.sessionStore.getAgentDir(id);
      if (!(0, import_node_fs96.existsSync)(dir)) continue;
      if (isSandGroupDir(dir)) {
        this.tm.hostLog(
          `Sand group: ignoring nested group member ${id}; a group chat cannot be a member of another group.`,
          "warn"
        );
        continue;
      }
      const profile = readSandProfileFile(getSandProfilePath(dir));
      const name17 = profile != null && profile.name.trim().length > 0 ? profile.name.trim() : SAND_DEFAULT_AGENT_NAME;
      members.push({
        id,
        name: name17,
        description: profile?.description ?? ""
      });
    }
    return members;
  }
  memberKindOf(memberId) {
    const profilePath = getSandProfilePath(this.tm.sessionStore.getAgentDir(memberId));
    if (!(0, import_node_fs96.existsSync)(profilePath)) return "local";
    const profile = parseProfileJson((0, import_node_fs96.readFileSync)(profilePath, "utf8"));
    if (profile === null) throw new SandGroupMemberHarnessError("Invalid member profile.");
    if (profile.harness === "temporal") return "temporal";
    if (profile.harness == null || profile.harness === "box") return "local";
    throw new SandGroupMemberHarnessError("Cannot run a member with an unsupported harness.");
  }
  reportMemberTurnOutcome(roomSession, memberId, outcome, error42) {
    const kind = this.memberKindOf(memberId);
    this.tm.telemetry.reportGroupMemberTurnOutcome({
      conversationId: roomSession.id,
      memberConversationId: memberId,
      memberKind: kind,
      outcome,
      ...error42 !== void 0 ? { error: classifyAgentError(error42) } : {}
    });
  }
  surfaceGroupMemberTurnError(roomSession, error42) {
    const description9 = describeAgentRunError(error42);
    this.tm.trayErrors.pushError({
      agentId: roomSession.id,
      ...description9,
      ...hostTrayTitle({ kind: turnTrayTitleKind(description9.errorKind), description: description9 })
    });
  }
  async runGroupMemberTurn(roomSession, request5, isRoomTurnCurrent, traceCtx, lane = "background", requestSource, attachments) {
    const memberKind = this.memberKindOf(request5.member.id);
    if (memberKind === "temporal") {
      return await this.runTemporalGroupMemberTurn(
        roomSession,
        request5.member,
        request5.isWindingDown === true,
        isRoomTurnCurrent
      );
    }
    const result = await this.runLocalRoomMemberTurn({
      room: { id: roomSession.id, name: this.groupIdentityFor(roomSession).name },
      member: request5.member,
      prompt: request5.prompt,
      isRoomTurnCurrent,
      lineage: this.tm.runLifecycle.syntheticTurnLineage(roomSession.id),
      applyReaction: (update) => this.applyGroupMemberReaction(roomSession, request5.member, update),
      traceCtx,
      lane,
      requestSource,
      attachments
    });
    this.reportMemberTurnOutcome(roomSession, request5.member.id, result.outcome, result.error);
    if (result.outcome === "error" && isRoomTurnCurrent()) {
      this.surfaceGroupMemberTurnError(roomSession, result.error);
    }
    return result.messages;
  }
  async runLocalRoomMemberTurn(args) {
    const {
      room,
      member,
      isRoomTurnCurrent,
      traceCtx,
      lane = "background",
      requestSource,
      attachments,
      lineage
    } = args;
    if (!this.tm.execution.canExecuteGroupMember) {
      return { outcome: "skipped", messages: [] };
    }
    let memberSession;
    try {
      memberSession = await this.pinMemberSessionForGroupTurn(member.id);
    } catch (error42) {
      if (!isAgentAbsent(error42)) reportFallback("group_chat_glue", error42);
      return { outcome: "session_unavailable", messages: [] };
    }
    const sent = [];
    let finalAttemptError;
    let sessionLostOnRetry = false;
    let isDmDeliveredThisAttempt = false;
    let lastReactionApplied = false;
    let trackMemberActivity = createGroupMemberActivityTracker();
    const transport = {
      onUpdate: (update) => {
        this.tm.runLifecycle.applyActivityTransition(memberSession.id, trackMemberActivity(update));
        if (update.type === "react-to-message") {
          lastReactionApplied = args.applyReaction?.(update) ?? false;
          return;
        }
        if (update.type === "send-message" && update.deliverTo === "dm") {
          if (update.message.type === "text") {
            this.postGroupMemberDmMessage(memberSession, update.message);
            isDmDeliveredThisAttempt = true;
          }
          return;
        }
        if (update.type === "send-message" && update.message.type === "text") {
          sent.push(update.message.content);
        }
      },
      lastReactionApplied: () => lastReactionApplied,
      sendMessageBlockReason: (message, deliverTo) => {
        return deliverTo == null && message.type === "text" && sent.filter((content) => stripLeadingPass(content).length > 0).length >= GROUP_MAX_MESSAGES_PER_TURN ? GROUP_MEMBER_TURN_MESSAGE_LIMIT_NOTICE : void 0;
      }
    };
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      lastReactionApplied = false;
      isDmDeliveredThisAttempt = false;
      finalAttemptError = void 0;
      trackMemberActivity = createGroupMemberActivityTracker();
      const promptForAttempt = attempt === 1 ? args.prompt : `${args.prompt}${buildGroupRedriveNote()}`;
      await this.tm.runLifecycle.enqueueExclusiveRun(
        memberSession.id,
        async () => {
          this.tm.turnRuntime.activeRequestSources.set(memberSession.id, requestSource ?? "turn");
          let registeredRunner;
          try {
            var _stack = [];
            try {
              if (this.tm.disposed || this.tm.sessions.deletedAgentIds.has(memberSession.id)) return;
              if (attempt > 1 && !isRoomTurnCurrent()) return;
              const runner = this.tm.execution.createGroupMemberRunner(
                memberSession,
                this.tm.runnerRegistry.runnerHooksFor(memberSession, transport)
              );
              registeredRunner = runner;
              this.tm.runnerRegistry.activeGroupMemberRunners.set(memberSession.id, runner);
              this.tm.runnerRegistry.wireRunnerLifecycle(runner, memberSession, room.id, {
                roomAgentId: room.id,
                roomName: room.name
              });
              const memberTurnTrace = __using(_stack, beginTurnTrace({
                parentCtx: traceCtx,
                conversationId: room.id,
                turnType: resolveTurnTraceType({ requestSource }),
                attributes: {
                  "sand.is_group_member": true,
                  "sand.member_conversation_id": memberSession.id,
                  ...attempt > 1 ? { "sand.attempt": attempt } : {}
                }
              }));
              try {
                const memberResult = await runner.run(promptForAttempt, {
                  traceCtx: memberTurnTrace?.ctx ?? traceCtx,
                  requestSource,
                  isGroupMemberTurn: true,
                  ...lineage == null ? {} : { lineage },
                  ...attachments == null ? {} : {
                    selectedImages: attachments.selectedImages,
                    selectedVideos: attachments.selectedVideos,
                    attachedFilePaths: attachments.filePaths,
                    attachedFileSizes: attachments.fileSizes,
                    attachedFilesOnBox: attachments.onBox
                  }
                });
                setTurnTraceAttributes(memberTurnTrace, {
                  "sand.outcome": resolveTurnTraceOutcome(memberResult)
                });
              } catch (error42) {
                markTurnTraceError(memberTurnTrace, error42);
                throw error42;
              }
            } catch (_2) {
              var _error = _2, _hasError = true;
            } finally {
              __callDispose(_stack, _error, _hasError);
            }
          } catch (error42) {
            finalAttemptError = error42;
          } finally {
            if (registeredRunner != null && this.tm.runnerRegistry.activeGroupMemberRunners.get(memberSession.id) === registeredRunner) {
              this.tm.runnerRegistry.activeGroupMemberRunners.delete(memberSession.id);
            }
            this.tm.runLifecycle.endSessionRun(memberSession);
          }
        },
        {
          lane,
          source: "group-member",
          onCancelled: () => this.tm.runLifecycle.endSessionRun(memberSession)
        }
      );
      const wasPreemptedByDm = this.dmPreemptedGroupMemberIds.delete(memberSession.id);
      if (!wasPreemptedByDm || sent.length > 0 || lastReactionApplied || attempt >= maxAttempts || !isRoomTurnCurrent()) {
        break;
      }
      try {
        memberSession = await this.pinMemberSessionForGroupTurn(member.id);
      } catch {
        sessionLostOnRetry = true;
        break;
      }
    }
    if (sent.length > 0 || lastReactionApplied || isDmDeliveredThisAttempt) {
      return { outcome: "delivered", messages: sent };
    }
    if (finalAttemptError !== void 0) {
      return { outcome: "error", messages: sent, error: finalAttemptError };
    }
    return { outcome: sessionLostOnRetry ? "session_unavailable" : "pass", messages: sent };
  }
  async runTemporalGroupMemberTurn(roomSession, member, isWindingDown, isRoomTurnCurrent) {
    const delegate = this.tm.temporalMemberDelegate;
    if (delegate == null) {
      this.reportMemberTurnOutcome(roomSession, member.id, "skipped");
      return [];
    }
    const config2 = readSandGroupConfig((0, import_node_path158.dirname)(roomSession.dbPath));
    if (config2 == null) {
      this.reportMemberTurnOutcome(roomSession, member.id, "skipped");
      return [];
    }
    const members = await this.resolveGroupMembers(config2.memberIds);
    if (!isRoomTurnCurrent()) {
      this.reportMemberTurnOutcome(roomSession, member.id, "cancelled");
      return [];
    }
    const peers = members.filter((other) => other.id !== member.id);
    const newMessages = messagesSinceMemberLastSpoke(this.readGroupHistory(roomSession), member.id);
    const group = this.groupIdentityFor(roomSession);
    const lineage = this.tm.runLifecycle.syntheticTurnLineage(roomSession.id);
    this.setActiveTemporalMember(roomSession.id, member.id);
    try {
      const result = await delegate.requestTemporalMemberTurn({
        room: {
          id: roomSession.id,
          name: group.name,
          description: group.description
        },
        member,
        peers,
        newMessages,
        isWindingDown,
        ...lineage == null ? {} : { lineage }
      });
      if (!isRoomTurnCurrent()) {
        this.reportMemberTurnOutcome(roomSession, member.id, "cancelled");
        return [];
      }
      this.reportMemberTurnOutcome(
        roomSession,
        member.id,
        temporalOutcomeToMemberTurnOutcome(result.outcome, result.messages)
      );
      return result.messages;
    } catch (error42) {
      this.reportMemberTurnOutcome(roomSession, member.id, "error", error42);
      if (isRoomTurnCurrent()) {
        this.surfaceGroupMemberTurnError(roomSession, error42);
      }
      return [];
    } finally {
      this.setActiveTemporalMember(roomSession.id, void 0);
    }
  }
  receiveRoomMemberTurnResult(args) {
    const delegate = this.tm.temporalMemberDelegate;
    if (delegate == null) return "unknown";
    return delegate.receiveRoomMemberTurnResult(args);
  }
  async runRemoteRoomMemberTurn(args) {
    const delegate = this.tm.temporalMemberDelegate;
    if (delegate == null || !this.tm.execution.canExecuteGroupMember) {
      return { status: "refused", reason: "unavailable" };
    }
    if (args.nonce.length === 0 || args.room.id.length === 0) {
      return { status: "refused", reason: "invalid" };
    }
    if (this.remoteRoomTurns.has(args.nonce)) {
      return { status: "refused", reason: "duplicate" };
    }
    let memberKind;
    try {
      memberKind = this.memberKindOf(args.memberAgentId);
    } catch (error42) {
      this.tm.telemetry.reportGroupMemberTurnOutcome({
        conversationId: args.room.id,
        memberConversationId: args.memberAgentId,
        memberKind: "local",
        outcome: "skipped",
        error: classifyAgentError(error42)
      });
      return { status: "refused", reason: "invalid" };
    }
    if (memberKind !== "local") {
      return { status: "refused", reason: "not_local" };
    }
    const member = (await this.resolveGroupMembers([args.memberAgentId]))[0];
    if (member == null) {
      return { status: "refused", reason: "invalid" };
    }
    const state = { cancelled: false };
    this.remoteRoomTurns.set(args.nonce, state);
    void this.completeRemoteRoomMemberTurn(args, member, state, delegate);
    return { status: "accepted" };
  }
  cancelRemoteRoomMemberTurn(args) {
    const state = this.remoteRoomTurns.get(args.nonce);
    if (state == null) return { cancelled: false };
    state.cancelled = true;
    return { cancelled: true };
  }
  async remoteRoomTurnAttachments(args) {
    const wire = args.attachments ?? [];
    if (wire.length === 0) return void 0;
    const paths = wire.map(
      (attachment) => reanchorSandPath(attachment.path, { acceptBoxModelVisibleAlias: true })
    );
    if (!areAttachmentsOnAgentBox(args.room.id, paths)) return void 0;
    const { imageAttachmentPaths, videoAttachmentPaths, fileAttachmentPaths } = splitAttachmentPathsByChannel(paths);
    return {
      selectedImages: await loadSelectedImageInputs(imageAttachmentPaths),
      selectedVideos: buildSelectedVideos(videoAttachmentPaths),
      filePaths: fileAttachmentPaths,
      fileSizes: await statAttachedFileSizes(paths),
      onBox: true
    };
  }
  async completeRemoteRoomMemberTurn(args, member, state, delegate) {
    const isPastDeadline = () => args.deadlineMs > 0 && Date.now() >= args.deadlineMs;
    const isRoomTurnCurrent = () => !state.cancelled && !isPastDeadline();
    let result;
    try {
      const attachments = await this.remoteRoomTurnAttachments(args);
      result = isRoomTurnCurrent() ? await this.runLocalRoomMemberTurn({
        room: { id: args.room.id, name: args.room.name },
        member,
        prompt: buildGroupTurnPrompt({
          member,
          group: { name: args.room.name, description: args.room.description },
          peers: args.peers,
          newMessages: fromRoomTurnMessages(args.newMessages, member.id),
          isWindingDown: args.isWindingDown,
          isAttachmentOnlyTurn: args.isAttachmentOnlyTurn === true
        }),
        isRoomTurnCurrent,
        ...attachments === void 0 ? {} : { attachments },
        ...args.parentRequestId == null || args.rootParentRequestId == null ? {} : {
          lineage: {
            parentRequestId: args.parentRequestId,
            rootParentRequestId: args.rootParentRequestId
          }
        },
        requestSource: "turn"
      }) : { outcome: "pass", messages: [] };
    } catch (error42) {
      result = { outcome: "error", messages: [], error: error42 };
    } finally {
      this.remoteRoomTurns.delete(args.nonce);
    }
    const messages2 = result.messages.map((content) => stripLeadingPass(content)).filter((content) => content.length > 0).slice(0, GROUP_MAX_MESSAGES_PER_TURN);
    const outcome = remoteRoomTurnOutcomeOf(result, messages2, {
      cancelled: state.cancelled,
      timedOut: isPastDeadline()
    });
    this.tm.telemetry.reportGroupMemberTurnOutcome({
      conversationId: args.room.id,
      memberConversationId: member.id,
      memberKind: "local",
      outcome: outcome === "sent" ? "delivered" : outcome,
      ...result.error !== void 0 ? { error: classifyAgentError(result.error) } : {}
    });
    await delegate.deliverServerRoomMemberTurnResult({
      roomId: args.room.id,
      nonce: args.nonce,
      memberAgentId: member.id,
      outcome,
      messages: outcome === "sent" ? messages2 : [],
      ...result.error !== void 0 ? { error: errorLogTag(result.error) } : {}
    });
  }
  cancelTemporalMemberTurns(args) {
    this.tm.temporalMemberDelegate?.cancelTemporalMemberTurns(args);
  }
  setActiveTemporalMember(groupId, memberId) {
    const had = this.activeTemporalMemberIdsByGroup.get(groupId);
    if (had === memberId) return;
    if (memberId == null) {
      this.activeTemporalMemberIdsByGroup.delete(groupId);
    } else {
      this.activeTemporalMemberIdsByGroup.set(groupId, memberId);
    }
    void this.tm.roster.emitAgentUpdate(groupId);
  }
  applyGroupMemberReaction(roomSession, member, update) {
    const emoji3 = update.emoji.trim();
    if (emoji3.length === 0 || !isMessageAddress(update.messageAddress)) {
      return false;
    }
    const target = this.tm.sessions.activeSession?.id === roomSession.id ? findEntry(update.messageAddress) : roomSession.db.getEntryById(update.messageAddress);
    if (target == null) return false;
    if (target.kind === "send-message" && target.author?.id === member.id) {
      return false;
    }
    const applied = this.tm.widgetResponses.applyReaction({
      session: roomSession,
      entryId: update.messageAddress,
      emoji: emoji3,
      by: member.id
    });
    return applied != null;
  }
  postGroupMemberDmMessage(memberSession, message) {
    const isActive = this.tm.sessions.activeSession?.id === memberSession.id;
    const entries = isActive ? getTranscript() : memberSession.db.getTranscriptEntries();
    const entry = {
      kind: "send-message",
      id: nextEntryId(entries, "send-message"),
      message: {
        type: "text",
        content: message.content,
        ...message.images != null && message.images.length > 0 ? { images: message.images } : {}
      },
      timestampMs: Date.now()
    };
    if (isActive) {
      this.tm.appendEntry(entry);
      return;
    }
    memberSession.db.appendTranscriptEntry(entry);
    this.tm.sessionStore.markSessionActivity(memberSession);
    void this.tm.roster.emitAgentUpdate(memberSession.id);
  }
  postGroupMemberMessage(session, member, content) {
    const author = { id: member.id, name: member.name };
    const isActive = this.tm.sessions.activeSession?.id === session.id;
    const entries = isActive ? getTranscript() : session.db.getTranscriptEntries();
    const entry = {
      kind: "send-message",
      id: nextEntryId(entries, "send-message"),
      message: { type: "text", content },
      timestampMs: Date.now(),
      author
    };
    if (isActive) {
      this.tm.appendEntry(entry);
      return;
    }
    session.db.appendTranscriptEntry(entry);
    this.tm.sessionStore.markSessionActivity(session);
    void this.tm.roster.emitAgentUpdate(session.id);
  }
  readGroupHistory(session) {
    const isActive = this.tm.sessions.activeSession?.id === session.id;
    const entries = isActive ? getTranscript() : session.db.getTranscriptEntries();
    return groupHistoryFromTranscriptEntries(entries);
  }
};

