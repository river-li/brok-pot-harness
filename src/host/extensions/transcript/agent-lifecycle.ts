var SandAgentLifecycleError = class extends SandDomainError {
  name = "SandAgentLifecycleError";
};
function emptyDeleteStats() {
  return { deletedActive: false, drainMs: 0, diskDeleteMs: 0, successorMs: 0 };
}
function cloneAgentDisplayName(name17) {
  const trimmed = name17.trim();
  return trimmed.length > 0 ? `${trimmed} copy` : "copy";
}
var AgentLifecycle = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  avatarMutationMutexes = /* @__PURE__ */ new Map();
  async withAvatarMutation(agentId, run) {
    const previous = this.avatarMutationMutexes.get(agentId) ?? Promise.resolve();
    let release;
    const current = new Promise((resolve29) => {
      release = resolve29;
    });
    this.avatarMutationMutexes.set(agentId, current);
    try {
      await previous;
      return await run();
    } finally {
      release();
      if (this.avatarMutationMutexes.get(agentId) === current) {
        this.avatarMutationMutexes.delete(agentId);
      }
    }
  }
  async createAgent(profile, origin = "user", options2 = {}) {
    const previous = this.tm.sessions.activeSession;
    const nextSession = await this.mintAgentSession(profile, origin, options2);
    const now = Date.now();
    this.tm.sessions.markSessionLeftBehind(previous, now);
    await this.tm.sessionStore.markSessionViewed(nextSession, now);
    this.tm.sessions.invalidateDeferredActivation();
    await this.tm.sessions.replaceSession(nextSession);
    this.tm.sessions.clearActiveTranscript(nextSession.id);
    this.tm.roster.emit({ type: "cleared" });
    await this.tm.roster.emitAgents();
    const stamp = this.tm.roster.reserveSnapshotStamp();
    const summarized = await this.tm.sessionStore.summarizeOpenSession(nextSession);
    if (summarized == null) {
      throw new SandAgentLifecycleError("Failed to summarize newly created Sand agent.");
    }
    const agent = this.tm.roster.finalizeSummaryForRpc(summarized, stamp);
    if (options2.isKickstartRequested === true) {
      void this.kickstartCreatedAgent(nextSession.id);
    }
    return { agent, transcript: getTranscript() };
  }
  async kickstartCreatedAgent(agentId) {
    let isRunReady = false;
    try {
      isRunReady = await this.tm.execution.isRunReady();
    } catch {
    }
    await this.tm.kickstartAgent(agentId, isRunReady);
  }
  async createBackgroundAgent(profile, origin = "user", options2 = {}) {
    const nextSession = await this.mintAgentSession(profile, origin, options2);
    try {
      const transcript = nextSession.db.getTranscriptEntries();
      await this.tm.roster.emitAgents();
      const stamp = this.tm.roster.reserveSnapshotStamp();
      const agent = await this.tm.sessionStore.summarizeOpenSession(nextSession);
      if (agent == null) {
        throw new SandAgentLifecycleError("Failed to summarize newly created Sand agent.");
      }
      return { agent: this.tm.roster.finalizeSummaryForRpc(agent, stamp), transcript };
    } finally {
      await nextSession.agentStore.dispose();
      nextSession.db.close();
    }
  }
  async mintAgentSession(profile, origin, options2) {
    const session = await this.tm.sessionStore.createSession(profile, origin, {
      purpose: options2.purpose,
      providedId: options2.agentId,
      serverId: options2.serverId,
      harness: options2.harness,
      namedBy: options2.namedBy
    });
    options2.configureAgentDir?.(this.tm.sessionStore.getAgentDir(session.id));
    if (options2.isIntroductionSuppressed !== true && options2.harness !== "temporal") {
      session.db.setIntroductionPending(true, options2.language);
    }
    return session;
  }
  async kickstartAgent(agentId, isRunReady) {
    if (!this.tm.execution.isLocalWorkAllowed) return false;
    let session;
    try {
      session = this.tm.sessions.activeSession?.id === agentId ? this.tm.sessions.activeSession : await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch (error41) {
      if (!isAgentAbsent(error41)) {
        this.tm.telemetry.reportAgentError({
          source: "onboarding_kickstart",
          conversationId: agentId,
          error: classifyAgentError(error41),
          detail: sandErrorDetail(error41)
        });
      }
      return false;
    }
    if (this.tm.groupChat.isGroupSession(session)) return false;
    if (!session.db.getIntroductionPending()) return false;
    if (session.db.getTranscriptEntries().some(isUserMessageEntry)) {
      session.db.setIntroductionPending(false);
      return false;
    }
    if (!isRunReady || !this.tm.execution.canExecute || !this.tm.execution.isLocalWorkAllowed) {
      return false;
    }
    if (this.tm.runLifecycle.inFlightRunCounts.has(session)) return true;
    const runner = this.tm.runnerRegistry.getRunner(session);
    const epoch = this.tm.sendPipeline.currentTurnEpoch(session);
    this.tm.runLifecycle.beginSessionRun(session);
    void this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestSources.set(session.id, "turn");
        const prompt = this.kickstartPromptFor(session);
        const startedAtMs = Date.now();
        try {
          if (epoch !== this.tm.sendPipeline.currentTurnEpoch(session)) return;
          const result = await runner.run(prompt, {
            hidden: true
          });
          let settledResult = result;
          let deliveryOwed = isDeliveryOwed(result);
          let replyNudgeAttempts = 0;
          let streamOutputProduced = result.streamOutputProduced === true;
          if (!result.aborted && result.pausedForUpgrade !== true && epoch === this.tm.sendPipeline.currentTurnEpoch(session)) {
            const settled = await this.tm.turnRuntime.ensureUserReply(
              runner,
              result,
              session,
              epoch
            );
            settledResult = settled.result;
            deliveryOwed = settled.deliveryOwed;
            replyNudgeAttempts = settled.replyNudgeAttempts;
            streamOutputProduced = settled.streamOutputProduced;
          }
          if (settledResult.pausedForUpgrade) {
            this.tm.upgradeResume.markAgentResumePending(session, "turn");
            session.db.setIntroductionPending(false);
          } else if (!settledResult.aborted && !deliveryOwed) {
            session.db.setIntroductionPending(false);
          }
          if (deliveryOwed && !settledResult.aborted && settledResult.pausedForUpgrade !== true && epoch === this.tm.sendPipeline.currentTurnEpoch(session)) {
            this.tm.reportTurnEmptyDelivery({
              conversationId: session.id,
              requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
              source: "introduction",
              requestSource: "turn",
              replyNudgeAttempts,
              toolCallCount: runner.getObservedToolCallCount(),
              streamOutputProduced,
              durationMs: Date.now() - startedAtMs,
              ackOutstanding: this.tm.ackObligationStore?.get(session.id) != null
            });
          }
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error41) {
          this.tm.telemetry.reportAgentError({
            source: "onboarding_kickstart",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error41),
            detail: sandErrorDetail(error41)
          });
          const description10 = describeAgentRunError(error41);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description10,
            ...hostTrayTitle({ kind: "introduction_failed", description: description10 }),
            dedupeKey: introductionFailedTrayKey(session.id)
          });
        } finally {
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "user", source: "kickstart" }
    );
    return true;
  }
  kickstartPromptFor(session) {
    const base = session.db.getAgentPurpose() === "disk-saver" ? SAND_DISK_SAVER_KICKSTART_PROMPT : SAND_ONBOARDING_KICKSTART_PROMPT;
    return withKickstartLanguage(base, session.db.getIntroductionLanguage());
  }
  async requestDiskSaverAudit(agentId, isRunReady) {
    if (!this.tm.execution.isLocalWorkAllowed) return false;
    let session;
    try {
      session = this.tm.sessions.activeSession?.id === agentId ? this.tm.sessions.activeSession : await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch (error41) {
      if (!isAgentAbsent(error41)) {
        this.tm.telemetry.reportAgentError({
          source: "disk_saver_reaudit",
          conversationId: agentId,
          error: classifyAgentError(error41),
          detail: sandErrorDetail(error41)
        });
      }
      return false;
    }
    if (this.tm.groupChat.isGroupSession(session)) return false;
    if (session.db.getAgentPurpose() !== "disk-saver") return false;
    if (session.db.getIntroductionPending()) {
      return await this.kickstartAgent(agentId, isRunReady);
    }
    if (!isRunReady || !this.tm.execution.canExecute || !this.tm.execution.isLocalWorkAllowed) {
      return false;
    }
    if (this.tm.runLifecycle.inFlightRunCounts.has(session)) return true;
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    void this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestSources.set(session.id, "event");
        try {
          const result = await runner.run(SAND_DISK_SAVER_REAUDIT_PROMPT, {
            hidden: true
          });
          if (result.pausedForUpgrade) {
            this.tm.upgradeResume.markAgentResumePending(session, "event");
          } else if (!result.aborted && result.sentMessageCount === 0) {
            await this.tm.automationRuntime.ensureHiddenTurnReply(runner);
          }
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error41) {
          this.tm.telemetry.reportAgentError({
            source: "disk_saver_reaudit",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error41),
            detail: sandErrorDetail(error41)
          });
        } finally {
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "event" }
    );
    return true;
  }
  async cloneAgent(sourceId) {
    const summary = (await this.tm.sessionStore.listAgents()).find(
      (agent) => agent.id === sourceId
    );
    if (summary == null) {
      throw new SandAgentLifecycleError("That Bot no longer exists.");
    }
    if (summary.isGroup) {
      throw new SandAgentLifecycleError("Groups can't be duplicated yet.");
    }
    const opened = await this.tm.sessionStore.mintAgent(async (agentId) => {
      this.tm.sessionStore.cloneAgentDir(
        this.tm.sessionStore.getAgentDir(sourceId),
        this.tm.sessionStore.getAgentDir(agentId),
        agentId,
        cloneAgentDisplayName(summary.name)
      );
      return await this.openMintedSession(agentId);
    });
    return this.commitOpenedSession(opened);
  }
  async commitOpenedSession({
    session,
    entries,
    agent
  }) {
    publishTranscriptMutation({
      kind: "agent-needs-reindex",
      agentId: session.id
    });
    const previous = this.tm.sessions.activeSession;
    const now = Date.now();
    this.tm.sessions.markSessionLeftBehind(previous, now);
    await this.tm.sessionStore.markSessionViewed(session, now);
    this.tm.sessions.invalidateDeferredActivation();
    await this.tm.sessions.replaceSession(session);
    this.tm.sessions.setActiveTranscript(session.id, entries);
    this.tm.sessions.loaded = true;
    this.tm.roster.emit({ type: "snapshot", activeAgentId: session.id, entries });
    await this.tm.roster.emitAgents();
    const stamp = this.tm.roster.reserveSnapshotStamp();
    const refreshed = await this.tm.sessionStore.summarizeOpenSession(session);
    return {
      agent: this.tm.roster.finalizeSummaryForRpc(refreshed ?? agent, stamp),
      transcript: getTranscript()
    };
  }
  async openMintedSession(newId2) {
    let session;
    try {
      session = await this.tm.sessionStore.openSession(newId2);
      const entries = await this.tm.sessionStore.getTranscriptEntries(session);
      const agent = await this.tm.sessionStore.summarizeOpenSession(session);
      if (agent == null) {
        throw new SandAgentLifecycleError("minted agent could not be summarized");
      }
      return { session, entries, agent };
    } catch (error41) {
      await this.discardMintedSession(session, newId2);
      throw error41;
    }
  }
  async discardMintedSession(session, newId2) {
    if (session != null) {
      try {
        await session.agentStore.dispose();
        session.db.close();
      } catch {
      }
    }
    await this.tm.sessionStore.deleteSession(newId2).catch((error41) => {
      this.tm.hostLog(
        `[sand] minted-session discard left ${newId2} on disk: ${errorLogTag(error41)}`,
        "error"
      );
    });
  }
  async deleteAgent(agentId) {
    return this.tm.deleteAgents([agentId]);
  }
  async deleteAgents(agentIds) {
    const ids = new Set(agentIds);
    if (ids.size === 0) return { transcript: getTranscript(), stats: emptyDeleteStats() };
    try {
      return await this.runDeleteAgents(ids);
    } catch (error41) {
      for (const id of ids) {
        if (this.tm.sessionStore.agentDirExists(id)) this.tm.sessions.deletedAgentIds.delete(id);
      }
      throw error41;
    }
  }
  async runDeleteAgents(ids) {
    const active = this.tm.sessions.activeSession ?? await this.tm.sessions.restoreSession();
    if (active == null) {
      return await this.deleteListedAndClearRoster(ids);
    }
    const isDeletingActive = ids.has(active.id);
    const stats = emptyDeleteStats();
    stats.deletedActive = isDeletingActive;
    const drainStartedAt = Date.now();
    for (const id of ids) {
      await this.interruptAgentForDeletion(id);
    }
    stats.drainMs = Date.now() - drainStartedAt;
    for (const id of ids) {
      this.tm.trayErrors.clearForAgent(id);
    }
    for (const id of ids) {
      if (id === active.id) continue;
      const session = this.tm.sessions.liveSessions.get(id);
      const pending = this.tm.sessions.pendingSessionOpens.get(id);
      const opened = pending === void 0 ? void 0 : await this.tm.sessions.settledOpen(pending);
      for (const retained of /* @__PURE__ */ new Set([session, opened])) {
        if (retained == null) continue;
        await retained.agentStore.dispose();
        this.tm.runLifecycle.closeSessionWhenIdle(retained);
      }
      this.tm.runnerRegistry.runners.delete(id);
      this.tm.sessions.liveSessions.delete(id);
      this.tm.sessions.pendingSessionOpens.delete(id);
      const diskStartedAt = Date.now();
      await this.tm.sessionStore.deleteSession(id);
      stats.diskDeleteMs += Date.now() - diskStartedAt;
      this.tm.onAgentForgotten?.(id);
      this.tm.pendingWakeStore?.clearAgent(id);
      this.tm.boxHandoff.boxHandoffs.delete(id);
      this.tm.boxHandoff.awaitingSink.clear(id);
      this.tm.roster.emitAsyncTasksForAgent(id);
    }
    if (!isDeletingActive) {
      await this.tm.roster.emitAgents();
      return { transcript: getTranscript(), stats };
    }
    const pickStartedAt = Date.now();
    const nextAgent = (await this.tm.sessionStore.listAgents(active.id)).find(
      (agent) => !ids.has(agent.id)
    );
    stats.successorMs += Date.now() - pickStartedAt;
    await active.agentStore.dispose();
    this.tm.runnerRegistry.runners.delete(active.id);
    this.tm.sessions.liveSessions.delete(active.id);
    this.tm.sessions.pendingSessionOpens.delete(active.id);
    this.tm.runLifecycle.closeSessionWhenIdle(active);
    const activeDiskStartedAt = Date.now();
    await this.tm.sessionStore.deleteSession(active.id);
    stats.diskDeleteMs += Date.now() - activeDiskStartedAt;
    this.tm.onAgentForgotten?.(active.id);
    this.tm.pendingWakeStore?.clearAgent(active.id);
    this.tm.boxHandoff.boxHandoffs.delete(active.id);
    this.tm.boxHandoff.awaitingSink.clear(active.id);
    this.tm.roster.emitAsyncTasksForAgent(active.id);
    const successorStartedAt = Date.now();
    const successorIds = [
      ...nextAgent != null ? [nextAgent.id] : [],
      ...(await this.tm.sessionStore.listAgentRecordIds()).filter(
        (id) => !ids.has(id) && id !== nextAgent?.id
      )
    ];
    for (const successorId of successorIds) {
      let nextSession;
      try {
        nextSession = this.tm.sessions.liveSessions.get(successorId) ?? await this.tm.sessions.openSessionOnce(successorId);
      } catch (error41) {
        this.tm.hostLog(
          `[sand] skipping unopenable agent ${successorId} after delete: ${errorLogTag(error41)}`,
          "error"
        );
        continue;
      }
      await this.tm.sessionStore.markSessionViewed(nextSession);
      this.tm.sessions.invalidateDeferredActivation();
      this.tm.sessions.setActiveSession(nextSession);
      this.tm.runLifecycle.watchActiveSession(nextSession);
      const entries = await this.tm.sessionStore.getTranscriptEntries(nextSession);
      this.tm.sessions.setActiveTranscript(nextSession.id, entries);
      this.tm.sessions.loaded = true;
      this.tm.roster.emit({ type: "snapshot", activeAgentId: nextSession.id, entries });
      await this.tm.roster.emitAgents();
      stats.successorMs += Date.now() - successorStartedAt;
      return { transcript: entries, stats };
    }
    this.tm.sessions.invalidateDeferredActivation();
    this.tm.sessions.clearActiveSession();
    this.tm.sessions.clearActiveTranscript(null);
    this.tm.sessions.loaded = true;
    this.tm.roster.emit({ type: "cleared" });
    await this.tm.roster.emitAgents();
    stats.successorMs += Date.now() - successorStartedAt;
    return { transcript: getTranscript(), stats };
  }
  async deleteListedAndClearRoster(ids) {
    const stats = emptyDeleteStats();
    const drainStartedAt = Date.now();
    for (const id of ids) {
      await this.interruptAgentForDeletion(id);
    }
    stats.drainMs = Date.now() - drainStartedAt;
    for (const id of ids) {
      this.tm.trayErrors.clearForAgent(id);
      this.tm.runnerRegistry.runners.delete(id);
      this.tm.sessions.liveSessions.delete(id);
      this.tm.sessions.pendingSessionOpens.delete(id);
      const diskStartedAt = Date.now();
      await this.tm.sessionStore.deleteSession(id);
      stats.diskDeleteMs += Date.now() - diskStartedAt;
      this.tm.onAgentForgotten?.(id);
      this.tm.pendingWakeStore?.clearAgent(id);
      this.tm.boxHandoff.boxHandoffs.delete(id);
      this.tm.boxHandoff.awaitingSink.clear(id);
      this.tm.roster.emitAsyncTasksForAgent(id);
    }
    this.tm.sessions.invalidateDeferredActivation();
    this.tm.sessions.clearActiveSession();
    this.tm.sessions.clearActiveTranscript(null);
    this.tm.sessions.loaded = true;
    this.tm.roster.emit({ type: "cleared" });
    await this.tm.roster.emitAgents();
    return { transcript: getTranscript(), stats };
  }
  async interruptAgentForDeletion(agentId) {
    this.tm.sessions.deletedAgentIds.add(agentId);
    this.tm.ackObligations.markAckObligationLost(agentId, "agent_deleted");
    this.tm.ackObligations.ackRunTokens.delete(agentId);
    this.tm.backgroundWakes.pendingSubagentCompletions.delete(agentId);
    this.tm.backgroundWakes.pendingShellCompletions.delete(agentId);
    this.tm.backgroundWakes.pendingInbound.delete(agentId);
    this.tm.backgroundWakes.pendingAgentInbound.delete(agentId);
    this.tm.backgroundWakes.pendingChannelFailures.delete(agentId);
    this.tm.groupChat.dmPreemptedGroupMemberIds.delete(agentId);
    this.tm.backgroundWakes.dmPreemptedWakeAgentIds.delete(agentId);
    this.tm.roster.forgetAgentSubagentWork(agentId);
    this.tm.roster.lastRunnerAsyncTasks.delete(agentId);
    const groupMemberRunner = this.tm.runnerRegistry.activeGroupMemberRunners.get(agentId);
    const runner = this.tm.runnerRegistry.runners.get(agentId);
    if (runner != null || groupMemberRunner != null) {
      const wasInFlight = this.tm.runLifecycle.runningAgentIds().has(agentId);
      const hadActiveGroupMemberRun = groupMemberRunner?.interruptAll("agent deleted") ?? false;
      const hadActiveRun = (runner?.interruptAll("agent deleted") ?? false) || hadActiveGroupMemberRun;
      this.tm.telemetry.reportTurnInterrupt({
        conversationId: agentId,
        reason: "agent_deleted",
        hadActiveRun,
        wasInFlight
      });
      runner?.cancelBackgroundShellRewatches();
      groupMemberRunner?.cancelBackgroundShellRewatches();
    }
    await Promise.all([
      this.tm.runnerRegistry.subagentOwnership.abortAndDrain("agent deleted", agentId),
      this.tm.runLifecycle.drainExclusiveRuns(agentId)
    ]);
    runner?.interruptAll("agent deleted");
    groupMemberRunner?.interruptAll("agent deleted");
    await this.tm.runnerRegistry.subagentOwnership.abortAndDrain("agent deleted", agentId);
    await runner?.drainBackgroundSubagents();
    await groupMemberRunner?.drainBackgroundSubagents();
  }
  async updateAgent(agentId, profile) {
    const active = this.tm.sessions.activeSession;
    const trimmedProfile = {
      ...profile.avatarShape === void 0 ? {} : { avatarShape: profile.avatarShape.trim() },
      ...profile.avatarColor === void 0 ? {} : { avatarColor: profile.avatarColor.trim() },
      name: profile.name.trim(),
      description: profile.description.trim(),
      ...profile.title === void 0 ? {} : { title: profile.title.trim() }
    };
    const stamp = this.tm.roster.reserveSnapshotStamp();
    let summary;
    if (active != null && active.id === agentId) {
      this.tm.sessionStore.writeAgentProfileFile(agentId, trimmedProfile);
      summary = await this.tm.sessionStore.summarizeOpenSession(active);
    } else {
      summary = await this.tm.sessionStore.updateAgentProfile(agentId, trimmedProfile);
    }
    await this.tm.roster.emitAgentUpdate(agentId);
    this.tm.roster.emitProfileChanged(agentId);
    return summary == null ? null : this.tm.roster.finalizeSummaryForRpc(summary, stamp);
  }
  async seedConversationName({
    id,
    prompt
  }) {
    const active = this.tm.sessions.activeSession;
    const stamp = this.tm.roster.reserveSnapshotStamp();
    const outcome = seedRoomProfileName({
      agentDir: this.tm.sessionStore.getAgentDir(id),
      prompt
    });
    if (outcome === "seeded") {
      this.tm.roster.lastKnownAgentNames.set(id, conversationNameFromPrompt(prompt));
      this.tm.roster.emitProfileChanged(id);
    }
    const summary = active != null && active.id === id ? await this.tm.sessionStore.summarizeOpenSession(active) : await this.tm.sessionStore.summarizeAgentById(id, void 0);
    if (outcome === "seeded") await this.tm.roster.emitAgentUpdate(id);
    return {
      outcome,
      agent: summary == null ? null : this.tm.roster.finalizeSummaryForRpc(summary, stamp)
    };
  }
  async setAgentUnread(agentId, isUnread, atMs) {
    const active = this.tm.sessions.activeSession;
    if (active != null && active.id === agentId) {
      if (isUnread) {
        await this.tm.sessionStore.seedSessionActivityFromDbMtime(active);
        active.db.markUnread(atMs);
      } else {
        active.db.markRead();
      }
    } else {
      await this.tm.sessionStore.setSessionUnread(agentId, isUnread, atMs);
    }
    await this.tm.roster.emitAgentUpdate(agentId);
  }
  async setAgentNotifyOnUpdates(agentId, isEnabled) {
    this.tm.sessionStore.setSessionNotifyOnUpdates(agentId, isEnabled);
    await this.tm.roster.emitAgentUpdate(agentId);
  }
  async setAgentVoice({
    agentId,
    voiceId,
    voiceSpeed,
    voiceLanguage
  }) {
    this.tm.sessionStore.setSessionVoice({
      agentId,
      ...voiceId === void 0 ? {} : { voiceId: normalizeSandVoiceId(voiceId) },
      ...voiceSpeed === void 0 ? {} : { voiceSpeed: normalizeSandVoiceSpeed(voiceSpeed) },
      ...voiceLanguage === void 0 ? {} : { voiceLanguage: normalizeSandVoiceLanguage(voiceLanguage) }
    });
    await this.tm.roster.emitAgentUpdate(agentId);
  }
  async setAgentHiddenFromSidebar(agentId, isHidden) {
    this.tm.sessionStore.setSessionHiddenFromSidebar(agentId, isHidden);
    await this.tm.roster.emitAgentUpdate(agentId);
  }
  async setAgentAvatarBytes(agentId, pngBytes) {
    return await this.withAvatarMutation(
      agentId,
      () => this.setAgentAvatarBytesUnlocked(agentId, pngBytes, "local")
    );
  }
  async setAgentAvatarBytesIfVersion(args) {
    return await this.withAvatarMutation(args.agentId, async () => {
      const current = await this.getAgentAvatar(args.agentId);
      if (current.version !== args.expectedVersion || !args.isCurrent()) return false;
      await this.setAgentAvatarBytesUnlocked(args.agentId, args.bytes, "remote");
      return true;
    });
  }
  async setAgentAvatarBytesUnlocked(agentId, pngBytes, source) {
    const active = this.tm.sessions.activeSession;
    const stamp = this.tm.roster.reserveSnapshotStamp();
    this.tm.roster.noteHostWrittenAvatarVersion({
      agentId,
      version: pngBytes == null ? null : avatarVersionForBytes(pngBytes)
    });
    let summary;
    if (active != null && active.id === agentId) {
      summary = await this.tm.sessionStore.setAgentAvatarBytes(
        active.db,
        active.dbPath,
        agentId,
        pngBytes,
        agentId
      );
    } else {
      summary = await this.tm.sessionStore.setAgentAvatarBytesById(agentId, pngBytes);
    }
    if (source === "local") this.tm.roster.emitProfileChanged(agentId, true);
    await this.tm.roster.emitAgentUpdate(agentId);
    return summary == null ? null : this.tm.roster.finalizeSummaryForRpc(summary, stamp);
  }
  async getAgentAvatar(agentId) {
    return await this.tm.sessionStore.getAgentAvatar(agentId);
  }
};
