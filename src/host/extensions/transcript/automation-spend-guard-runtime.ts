/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/automation-spend-guard-runtime.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SPEND_GUARD_ANSWER_OUTCOMES = {
  keep: { routines: "resume-guard-paused", snoozes: true, retiresGuard: false },
  resume: { routines: "resume-guard-paused", snoozes: true, retiresGuard: false },
  optOut: { routines: "resume-guard-paused", snoozes: false, retiresGuard: true },
  pause: { routines: "disable-every-enabled", snoozes: false, retiresGuard: false },
  stayPaused: { routines: "leave-as-is", snoozes: false, retiresGuard: false }
};
var CLEARED_GUARD_STATE = {
  nudgedAtMs: null,
  snoozedUntilMs: null,
  optedOut: false,
  cardEntryIds: [],
  pausedAutomationIds: []
};
function disableEveryEnabledAutomation(session) {
  const disabled = [];
  for (const automation of session.automations.listDefinitions()) {
    if (automation.isEnabled) {
      session.automations.setEnabled(automation.id, false);
      disabled.push(automation.id);
    }
  }
  return disabled;
}
function reEnableGuardPausedAutomations(session, guardPausedIds) {
  const toResume = new Set(guardPausedIds);
  for (const automation of session.automations.listDefinitions()) {
    if (toResume.has(automation.id) && !automation.isEnabled) {
      session.automations.setEnabled(automation.id, true);
    }
  }
}
var AutomationSpendGuardRuntime = class {
  constructor(tm, host) {
    this.tm = tm;
    this.host = host;
  }
  tm;
  host;
  async apply(session, firing) {
    const nowMs2 = Date.now();
    const isFiringOff = () => session.automations.get(firing.id)?.isEnabled !== true;
    const evaluated = this.evaluate(session, nowMs2);
    switch (evaluated.decision) {
      case "user-active":
      case "opted-out":
      case "snoozed":
      case "below-thresholds":
        return { paused: isFiringOff() };
      case "awaiting-ack":
        this.issueCardIfNone(session);
        return { paused: isFiringOff() };
      case "nudge":
        session.db.setAutomationSpendGuardState({
          ...CLEARED_GUARD_STATE,
          nudgedAtMs: nowMs2,
          cardEntryIds: [this.issueGuardCard(session, buildSpendGuardNudgeWidget())]
        });
        return {
          paused: isFiringOff(),
          reminder: renderSpendGuardNudgeReminder({
            nowMs: nowMs2,
            lastViewedAtMs: evaluated.lastViewedAtMs,
            unreadCount: evaluated.unreadCount,
            firesSinceViewedCount: evaluated.firesSinceViewedCount,
            timeZone: this.tm.sessionStore.getUserTimeZone()
          })
        };
      case "pause": {
        const paused = await this.pauseForAwayUser(session);
        return { paused: paused || isFiringOff() };
      }
    }
  }
  evaluate(session, nowMs2) {
    const unread = session.db.getUnreadState();
    const state = session.db.getAutomationSpendGuardState();
    const firesSinceViewedCount = countAutomationRunsSince(
      session.automations.listDefinitions(),
      unread.lastViewedAt
    );
    return {
      decision: evaluateAutomationSpendGuard({
        nowMs: nowMs2,
        lastViewedAtMs: unread.lastViewedAt,
        unreadCount: unread.unreadCount,
        firesSinceViewedCount,
        nudgedAtMs: state.nudgedAtMs,
        snoozedUntilMs: state.snoozedUntilMs,
        optedOut: state.optedOut
      }),
      lastViewedAtMs: unread.lastViewedAt,
      unreadCount: unread.unreadCount,
      firesSinceViewedCount
    };
  }
  async pauseForAwayUser(session) {
    let guardPausedIds = [];
    await this.runGuardTransition(session, (current) => {
      if (this.evaluate(session, Date.now()).decision !== "pause") return;
      guardPausedIds = disableEveryEnabledAutomation(session);
      if (guardPausedIds.length === 0) return;
      const isPauseAlreadyOpen = current.pausedAutomationIds.length > 0;
      session.db.setAutomationSpendGuardState({
        ...CLEARED_GUARD_STATE,
        nudgedAtMs: current.nudgedAtMs,
        pausedAutomationIds: [.../* @__PURE__ */ new Set([...current.pausedAutomationIds, ...guardPausedIds])],
        cardEntryIds: isPauseAlreadyOpen ? current.cardEntryIds : [...current.cardEntryIds, this.issueGuardCard(session, buildSpendGuardPausedWidget())]
      });
    });
    if (guardPausedIds.length === 0) return false;
    this.tm.automationConfigChanged?.();
    this.host.emitAutomations(session);
    this.tm.trayErrors.pushError({
      agentId: session.id,
      ...hostTrayTitle({ kind: "routines_paused_while_away" }),
      errorKind: "routines_paused_while_away",
      severity: "info",
      dedupeKey: `spend-guard-paused:${session.id}`
    });
    return true;
  }
  async handleWidgetAnswer(args) {
    const answer = interpretSpendGuardAnswer(args.value);
    if (answer == null || this.tm.sessions.isAgentGone(args.agentId)) return null;
    const session = await this.tm.sessions.resolveBackgroundSession(args.agentId);
    const nowMs2 = Date.now();
    let applied = false;
    await this.runGuardTransition(session, (current) => {
      if (!current.cardEntryIds.includes(args.entryId) || !this.isHostIssuedCard(session, args.entryId, args.value)) {
        return;
      }
      const outcome = SPEND_GUARD_ANSWER_OUTCOMES[answer];
      let guardPausedIds = [];
      if (outcome.routines === "resume-guard-paused") {
        reEnableGuardPausedAutomations(session, current.pausedAutomationIds);
      } else if (outcome.routines === "disable-every-enabled") {
        guardPausedIds = [
          .../* @__PURE__ */ new Set([...current.pausedAutomationIds, ...disableEveryEnabledAutomation(session)])
        ];
      }
      session.db.setAutomationSpendGuardState({
        ...CLEARED_GUARD_STATE,
        snoozedUntilMs: outcome.snoozes ? nowMs2 + SPEND_GUARD_SNOOZE_MS : null,
        optedOut: outcome.retiresGuard,
        pausedAutomationIds: guardPausedIds,
        cardEntryIds: guardPausedIds.length > 0 ? current.cardEntryIds : []
      });
      applied = true;
    });
    if (!applied) return null;
    const ack = renderSpendGuardAnswerAck(answer);
    args.onApplied?.(ack);
    this.tm.automationConfigChanged?.();
    this.host.emitAutomations(session);
    return ack;
  }
  issueCardIfNone(session) {
    const current = session.db.getAutomationSpendGuardState();
    if (current.cardEntryIds.length > 0) return;
    session.db.setAutomationSpendGuardState({
      ...current,
      cardEntryIds: [this.issueGuardCard(session, buildSpendGuardNudgeWidget())]
    });
  }
  isHostIssuedCard(session, entryId, value) {
    const entry = this.readEntries(session).find((item) => item.id === entryId);
    if (entry?.kind !== "send-message" || entry.message.type !== "widget") return false;
    return isSpendGuardCard(entry.message.widget, value);
  }
  readEntries(session) {
    return this.tm.sessions.activeSession?.id === session.id ? getTranscript() : session.db.getTranscriptEntries();
  }
  issueGuardCard(session, widget) {
    const isActive = this.tm.sessions.activeSession?.id === session.id;
    const entries = this.readEntries(session);
    const entry = {
      kind: "send-message",
      id: nextEntryId(entries, "send-message"),
      message: { type: "widget", widget },
      timestampMs: Date.now()
    };
    if (isActive) {
      this.tm.appendEntry(entry);
    } else {
      session.db.appendTranscriptEntry(entry);
      this.tm.sessionStore.markSessionActivity(session);
      void this.tm.roster.emitAgentUpdate(session.id);
    }
    return entry.id;
  }
  runGuardTransition(session, transition) {
    return this.host.enqueueAutomationLifecycleMutation({
      agentId: session.id,
      mutation: () => {
        const before = session.automations.listDefinitions();
        const isActive = this.tm.sessions.activeSession?.id === session.id;
        this.recordPendingAgentEdits(session, isActive, before);
        transition(session.db.getAutomationSpendGuardState());
        this.recordGuardDelta(session, isActive, before);
      }
    });
  }
  recordPendingAgentEdits(session, isActive, before) {
    if (isActive) {
      this.host.recordAutomationChangeEvents(session, "agent");
      return;
    }
    this.host.recordInactiveAutomationChanges({
      agentId: session.id,
      before,
      after: before,
      source: "agent"
    });
  }
  recordGuardDelta(session, isActive, before) {
    if (isActive) {
      this.host.recordAutomationChangeEvents(session, "spend_guard");
      return;
    }
    this.host.recordInactiveAutomationChanges({
      agentId: session.id,
      before,
      after: session.automations.listDefinitions(),
      source: "spend_guard"
    });
  }
};

