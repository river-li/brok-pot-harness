var BoxHandoffResume = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  boxHandoffs = /* @__PURE__ */ new Map();
  foreverBoxListeners = /* @__PURE__ */ new Set();
  awaitingSink = this.createAwaitingStateSink();
  scmConnectLaunchGate = /* @__PURE__ */ new Set();
  subscribeForeverBox(listener) {
    this.foreverBoxListeners.add(listener);
    return () => {
      this.foreverBoxListeners.delete(listener);
    };
  }
  withBoxHandoff(status) {
    return {
      ...status,
      handoff: this.boxHandoffs.get(status.agentId) ?? null
    };
  }
  createAwaitingStateSink() {
    return {
      set: (agentId, state) => {
        void this.applyAwaitingState(agentId, state);
      },
      clear: (agentId) => {
        void this.applyAwaitingState(agentId, null);
      },
      trySetForTab: (agentId, state) => {
        void this.applyAwaitingStateForTab(agentId, state.tabId, state);
      },
      clearForTab: (agentId, tabId, options2) => {
        void this.applyAwaitingStateForTab(agentId, tabId, null, options2);
      }
    };
  }
  async applyAwaitingState(agentId, state) {
    if (this.tm.sessions.isAgentGone(agentId)) return;
    try {
      await this.tm.sessionStore.setAwaitingUserResponse(agentId, state);
      await this.tm.roster.emitAgentUpdate(agentId);
    } catch {
    }
  }
  async applyAwaitingStateForTab(agentId, tabId, state, options2) {
    if (this.tm.sessions.isAgentGone(agentId)) return;
    try {
      const applied = await this.tm.sessionStore.setAwaitingUserResponseForTab(
        agentId,
        tabId,
        state,
        options2
      );
      if (applied) await this.tm.roster.emitAgentUpdate(agentId);
    } catch {
    }
  }
  async handBackForeverBox(agentId, trigger2) {
    const decision = decideBoxHandBack(this.boxHandoffs.get(agentId), trigger2);
    if (decision.kind === "none") return;
    this.boxHandoffs.delete(agentId);
    this.awaitingSink.clear(agentId);
    const entryId = await this.tm.resolveBoxRequestEntry(
      agentId,
      decision.requestId,
      decision.resolution,
      { wakeOutcomeUnseen: true }
    );
    await this.tm.emitForeverBoxStatus(agentId);
    await this.tm.resumeAfterBoxHandoff(agentId, decision.trigger, {
      wakeOutcomeEntryIds: entryId == null ? [] : [entryId]
    });
  }
  async emitForeverBoxStatus(agentId) {
    try {
      const status = this.tm.withBoxHandoff(await this.tm.foreverBox.getStatus({ id: agentId }));
      for (const listener of this.foreverBoxListeners) listener(status);
    } catch {
      return;
    }
  }
  async resumeAfterBoxHandoff(agentId, trigger2 = "button", options2) {
    await this.resumeWithHiddenPrompt(
      agentId,
      buildBoxHandBackPrompt(trigger2),
      "resume_after_box_handoff_failed",
      options2
    );
  }
  async resumeAfterMcpAuth(agentId, serverName, accountLabel) {
    const displayName2 = formatMcpAccountDisplayName(serverName, accountLabel);
    await this.resumeWithHiddenPrompt(
      agentId,
      `[The "${displayName2}" MCP server finished authorizing \u2014 it's connected and its tools are available now. Your first action is a SendMessage telling the user it's connected, then pick up whatever you paused to authorize it. If there was nothing else to do, just confirm it's ready and ask what they'd like to do with it. Remember: nothing reaches the user unless it's inside a SendMessage.]`,
      "resume_after_mcp_auth_failed"
    );
  }
  scmConnectLaunchBlockedReason(agentId) {
    return this.scmConnectLaunchGate.has(agentId) ? "a source control integration was connected while a repo-backed action was parked, and the owner has not replied since." : void 0;
  }
  clearScmConnectLaunchGate(agentId) {
    this.scmConnectLaunchGate.delete(agentId);
  }
  async resumeAfterScmConnect(wake) {
    const { agentId, platform: platform2, grantedRepo } = wake;
    this.scmConnectLaunchGate.add(agentId);
    const displayName2 = connectCardManifest(platform2)?.displayName ?? platform2;
    const event = grantedRepo == null ? `${displayName2} is now connected to the user's Cursor account. Your first action is a SendMessage telling the user it's connected.` : `The user's Cursor account was just granted ${displayName2} access to ${grantedRepo}. Your first action is a SendMessage telling the user the repository is now accessible.`;
    await this.resumeWithHiddenPrompt(
      agentId,
      `[${event} Then confirm with them before retrying the blocked repo action \u2014 do not reuse a parked prompt or repo URL unless they ask. Remember: nothing reaches the user unless it's inside a SendMessage.]`,
      "resume_after_listener_connect_failed"
    );
  }
  async resumeAfterListenerConnect(agentId, platform2) {
    const displayName2 = listenerIntegrationManifest(platform2)?.displayName ?? platform2;
    const slackReminder = platform2 === "slack" ? " For a channel listener, also remind them the Cursor bot must be in the channel (/invite @Cursor) or messages there can't reach it." : "";
    await this.resumeWithHiddenPrompt(
      agentId,
      `[${displayName2} is now connected to the user's Cursor account \u2014 ${displayName2} listener routines can fire. Your first action is a SendMessage telling the user it's connected, then pick up whatever you paused (e.g. finish or re-check the listener routine you were setting up).${slackReminder} Remember: nothing reaches the user unless it's inside a SendMessage.]`,
      "resume_after_listener_connect_failed"
    );
  }
  async resumeWithHiddenPrompt(agentId, prompt, errorTitleKind, options2) {
    if (!this.tm.execution.canExecute) return;
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch {
      return;
    }
    if (this.tm.groupChat.isGroupSession(session)) return;
    const wakeOutcomeEntryIds = options2?.wakeOutcomeEntryIds ?? [];
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    const ackToken = this.tm.ackObligations.mintAckRunToken(session.id);
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, "handoff-resume");
        try {
          await runner.run(prompt, {
            hidden: true,
            ackToken,
            requestSource: "handoff-resume",
            ...this.tm.widgetResponses.wakeOutcomeSeenHook(session, wakeOutcomeEntryIds)
          });
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error41) {
          this.tm.telemetry.reportAgentError({
            source: "resume",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error41),
            detail: sandErrorDetail(error41)
          });
          const description10 = describeAgentRunError(error41);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description10,
            ...hostTrayTitle({ kind: errorTitleKind, description: description10 })
          });
        } finally {
          this.tm.ackObligations.retireAckRunToken(session.id, ackToken);
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "handoff-resume", ackToken }
    );
  }
};
