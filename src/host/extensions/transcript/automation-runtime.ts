var AutomationRuntime = class {
  constructor(tm) {
    this.tm = tm;
    this.spendGuard = new AutomationSpendGuardRuntime(tm, this);
    this.eventFires = new AutomationEventFires(tm);
    this.runPath = new AutomationRunPath(tm, this.spendGuard, this.eventFires);
  }
  tm;
  watchedAutomations;
  lastKnownAutomations = /* @__PURE__ */ new Map();
  automationLifecycleMutationChains = /* @__PURE__ */ new Map();
  spendGuard;
  eventFires;
  runPath;
  get pendingEventFireBatches() {
    return this.eventFires.pendingEventFireBatches;
  }
  notifyAutomationConfigChanged() {
    this.tm.automationConfigChanged?.();
  }
  watchSessionAutomations(session) {
    if (this.watchedAutomations === session.automations) return;
    this.watchedAutomations?.setOnChange(void 0);
    this.watchedAutomations = session.automations;
    this.seedKnownAutomations(session);
    session.automations.setOnChange(() => {
      void this.enqueueAutomationLifecycleMutation({
        agentId: session.id,
        mutation: () => {
          this.recordAutomationChangeEvents(session, "agent");
          this.emitAutomations(session);
          this.notifyAutomationConfigChanged();
        }
      });
    });
  }
  seedKnownAutomations(session) {
    if (this.lastKnownAutomations.has(session.id)) return;
    this.lastKnownAutomations.set(
      session.id,
      snapshotAutomations(session.automations.listDefinitions())
    );
  }
  recordAutomationChangeEvents(session, source) {
    if (this.tm.sessions.activeSession?.id !== session.id) return;
    const current = snapshotAutomations(session.automations.listDefinitions());
    const previous = this.lastKnownAutomations.get(session.id);
    this.lastKnownAutomations.set(session.id, current);
    if (previous == null) return;
    for (const [id, after] of current) {
      const before = previous.get(id);
      if (before == null) {
        this.emitAutomationChange({
          agentId: session.id,
          action: "created",
          automationId: id,
          automationName: after.name,
          automation: after,
          source
        });
        continue;
      }
      const action = diffAutomationAction(before, after);
      if (action != null) {
        this.emitAutomationChange({
          agentId: session.id,
          action,
          automationId: id,
          automationName: after.name,
          automation: after,
          source
        });
      }
    }
    for (const [id, before] of previous) {
      if (!current.has(id)) {
        this.emitAutomationChange({
          agentId: session.id,
          action: "deleted",
          automationId: id,
          automationName: before.name,
          automation: before,
          source
        });
      }
    }
  }
  enqueueAutomationLifecycleMutation({
    agentId,
    mutation
  }) {
    return this.runOnPerAgentChain(this.automationLifecycleMutationChains, agentId, mutation);
  }
  runOnPerAgentChain(chains, agentId, task) {
    const previous = chains.get(agentId) ?? Promise.resolve();
    const result = previous.then(task, task);
    const settled = result.then(
      () => void 0,
      () => void 0
    );
    chains.set(agentId, settled);
    void settled.then(() => {
      if (chains.get(agentId) === settled) {
        chains.delete(agentId);
      }
    });
    return result;
  }
  enqueueAutomationMutation({
    agentId,
    activeMutation,
    inactiveMutation
  }) {
    return this.enqueueAutomationLifecycleMutation({
      agentId,
      mutation: () => {
        const active = this.tm.sessions.activeSession;
        let after;
        if (active?.id === agentId) {
          this.recordAutomationChangeEvents(active, "agent");
          after = activeMutation(active);
          this.recordAutomationChangeEvents(active, "automations_ui");
        } else {
          const before = this.tm.sessionStore.listAgentAutomations(agentId);
          this.recordInactiveAutomationChanges({
            agentId,
            before,
            after: before,
            source: "agent"
          });
          after = inactiveMutation();
          this.recordInactiveAutomationChanges({
            agentId,
            before,
            after,
            source: "automations_ui"
          });
        }
        this.publishAutomations(agentId, after);
        return after;
      }
    });
  }
  recordInactiveAutomationChanges({
    agentId,
    before,
    after,
    source
  }) {
    const previous = this.lastKnownAutomations.get(agentId) ?? snapshotAutomations(before);
    const current = snapshotAutomations(after);
    this.lastKnownAutomations.set(agentId, current);
    for (const [id, automation] of current) {
      const priorAutomation = previous.get(id);
      if (priorAutomation == null) {
        this.emitAutomationLifecycle({
          agentId,
          action: "created",
          automation,
          source
        });
        continue;
      }
      const action = diffAutomationAction(priorAutomation, automation);
      if (action != null) {
        this.emitAutomationLifecycle({
          agentId,
          action,
          automation,
          source
        });
      }
    }
    for (const [id, automation] of previous) {
      if (!current.has(id)) {
        this.emitAutomationLifecycle({
          agentId,
          action: "deleted",
          automation,
          source
        });
      }
    }
  }
  emitAutomationChange({
    agentId,
    action,
    automationId,
    automationName,
    automation,
    source
  }) {
    this.tm.emitTimelineEvent(agentId, {
      type: "automation-changed",
      action,
      automationId,
      automationName
    });
    this.emitAutomationLifecycle({ agentId, action, automation, source });
  }
  emitAutomationLifecycle({
    agentId,
    action,
    automation,
    source
  }) {
    const now = Date.now();
    const schedule = automation.triggerType === "cron" ? summarizeAutomationScheduleForTelemetry({
      schedule: automation.schedule,
      timeZone: this.tm.sessionStore.getUserTimeZone(),
      startMs: now
    }) : void 0;
    const ageMs = Math.max(0, now - automation.createdAt);
    const automationId = stableAutomationId({
      agentId,
      localId: automation.id
    });
    const provenance = automation.provenance ?? "unknown";
    const templateSetupTurn = this.tm.turnRuntime.activeTemplateSetupWriteProvenance(agentId) !== void 0;
    this.tm.telemetry.reportAutomationLifecycle({
      conversationId: agentId,
      automationId,
      action,
      source,
      provenance,
      isEnabled: automation.isEnabled,
      templateSetupTurn,
      triggerType: automation.triggerType,
      ...schedule != null ? {
        scheduledFiresNext7Days: schedule.scheduledFiresNext7Days,
        firesOnWeekend: schedule.firesOnWeekend,
        firesOvernight: schedule.firesOvernight
      } : {},
      ageMs,
      recordedRunCount: automation.recordedRunCount
    });
    this.tm.productAnalytics.trackEvent("sand.automation.lifecycle", {
      agent_id: agentId,
      automation_id: automationId,
      action,
      source,
      provenance,
      is_enabled: automation.isEnabled,
      template_setup_turn: templateSetupTurn,
      trigger_type: automation.triggerType,
      ...schedule != null ? {
        scheduled_fires_next_7_days: schedule.scheduledFiresNext7Days,
        fires_on_weekend: schedule.firesOnWeekend,
        fires_overnight: schedule.firesOvernight
      } : {},
      age_ms: ageMs,
      recorded_run_count: automation.recordedRunCount,
      guidance_version: AUTOMATION_PROMPT_GUIDANCE_VERSION
    });
  }
  emitAutomations(session) {
    if (this.tm.sessions.activeSession?.id !== session.id || !this.tm.shouldEmitAutomations()) {
      return;
    }
    this.publishAutomations(session.id, session.automations.list().slice(0, AUTOMATION_UI_LIMIT));
  }
  publishAutomations(agentId, automations) {
    if (!this.tm.shouldEmitAutomations()) return;
    this.tm.roster.emitter.emit("automations", {
      agentId,
      automations
    });
  }
  subscribeAutomations(listener) {
    this.tm.roster.emitter.on("automations", listener);
    return () => {
      this.tm.roster.emitter.off("automations", listener);
    };
  }
  async getAgentAutomations(agentId) {
    const active = this.tm.sessions.activeSession;
    if (active != null && active.id === agentId) {
      return active.automations.list().slice(0, AUTOMATION_UI_LIMIT);
    }
    return this.tm.sessionStore.listAgentAutomations(agentId);
  }
  async listAllAutomations() {
    return this.tm.sessionStore.listAllAutomations();
  }
  async listAllAutomationDefinitions() {
    return this.tm.sessionStore.listAllAutomationDefinitions();
  }
  async setAgentAutomationEnabled(agentId, automationId, isEnabled) {
    try {
      return await this.enqueueAutomationMutation({
        agentId,
        activeMutation: (active) => {
          active.automations.setEnabled(automationId, isEnabled);
          return active.automations.list().slice(0, AUTOMATION_UI_LIMIT);
        },
        inactiveMutation: () => this.tm.sessionStore.setAgentAutomationEnabled(agentId, automationId, isEnabled)
      });
    } finally {
      this.notifyAutomationConfigChanged();
    }
  }
  async createAgentAutomation(agentId, spec, provenance = "user") {
    try {
      return await this.enqueueAutomationMutation({
        agentId,
        activeMutation: (active) => {
          active.automations.upsert(spec, provenance);
          return active.automations.list().slice(0, AUTOMATION_UI_LIMIT);
        },
        inactiveMutation: () => this.tm.sessionStore.createAgentAutomation(agentId, spec, provenance)
      });
    } finally {
      this.notifyAutomationConfigChanged();
    }
  }
  async updateAgentAutomation(agentId, automationId, spec) {
    try {
      return await this.enqueueAutomationMutation({
        agentId,
        activeMutation: (active) => {
          active.automations.update(automationId, spec, "user");
          return active.automations.list().slice(0, AUTOMATION_UI_LIMIT);
        },
        inactiveMutation: () => this.tm.sessionStore.updateAgentAutomation(agentId, automationId, spec)
      });
    } finally {
      this.notifyAutomationConfigChanged();
    }
  }
  async deleteAgentAutomation(agentId, automationId) {
    try {
      return await this.enqueueAutomationMutation({
        agentId,
        activeMutation: (active) => {
          active.automations.remove(automationId);
          return active.automations.list().slice(0, AUTOMATION_UI_LIMIT);
        },
        inactiveMutation: () => this.tm.sessionStore.removeAgentAutomation(agentId, automationId)
      });
    } finally {
      this.notifyAutomationConfigChanged();
    }
  }
  async runAgentAutomationNow(agentId, automationId) {
    const active = this.tm.sessions.activeSession;
    const automation = active != null && active.id === agentId ? active.automations.get(automationId) : (await this.tm.sessionStore.listAgentAutomations(agentId)).find(
      (entry) => entry.id === automationId
    ) ?? null;
    if (automation == null) return;
    const runAsSubagent = this.tm.isAutomationSubagentEnabled();
    await this.fireAutomation({
      agentId,
      automation,
      trigger: "manual",
      ...runAsSubagent ? { runUuid: crypto.randomUUID(), runAsSubagent: true } : {}
    });
  }
  async runServerScheduledAutomation({
    agentId,
    automation,
    runUuid,
    scheduledForMs,
    runAsSubagent
  }) {
    return await this.fireAutomation({
      agentId,
      automation,
      trigger: "schedule",
      runUuid,
      ...runAsSubagent !== void 0 ? { runAsSubagent } : {},
      ...scheduledForMs !== void 0 ? { scheduledForMs } : {}
    });
  }
  async runAutomationForEvent(agentId, automation, event) {
    return await this.eventFires.enqueueEventAutomationFire({
      agentId,
      automation,
      event
    });
  }
  async runServerAutomationForEvent({
    agentId,
    automation,
    event,
    runUuid,
    runAsSubagent
  }) {
    return await this.eventFires.enqueueEventAutomationFire({
      agentId,
      automation,
      event,
      runUuid,
      ...runAsSubagent !== void 0 ? { runAsSubagent } : {}
    });
  }
  async fireAutomation(args) {
    return this.runPath.fireAutomation(args);
  }
  handleSpendGuardWidgetAnswer(args) {
    return this.spendGuard.handleWidgetAnswer(args);
  }
  async ensureHiddenTurnReply(runner, voiceLine) {
    const prompt = voiceLine === void 0 ? REPLY_NUDGE_PROMPT : MainLoopVoicePrompt.replyNudge({ sendTool: "SendToUser", address: voiceLine });
    return await runner.run(prompt, { hidden: true, continuesTurn: true });
  }
};
