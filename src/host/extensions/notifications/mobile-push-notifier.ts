/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/notifications/mobile-push-notifier.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createSandMobilePushSender(client) {
  return async (input) => {
    await client.notifySandAgentTurnFinished({
      agentId: input.agentId,
      agentName: input.agentName,
      messagePreview: input.messagePreview ?? "",
      lastMessageId: input.lastMessageId ?? "",
      awaitingUserResponse: input.awaitingUserResponse,
      senderAgentId: input.senderAgentId ?? "",
      memberAgentIds: [...input.memberAgentIds],
      messageContentJson: input.messageContent !== void 0 ? JSON.stringify(input.messageContent) : ""
    });
  };
}
var SAND_MOBILE_PUSH_FOCUS_FRESHNESS_MS = 5 * 6e4;
var SandMobilePushNotifier = class {
  constructor(deps) {
    this.deps = deps;
    this.decider = new SandOsNotificationDecider();
    this.now = deps.now ?? Date.now;
  }
  deps;
  decider;
  now;
  hasSeededBaseline = false;
  preSeedDeltas = [];
  seedBaseline(agents) {
    this.decider.seedBaseline(agents.map(toNotificationSnapshot));
    this.flushPreSeedDeltas();
  }
  handleAgentsEvent(event, presence) {
    const { nowMs: nowMs2, isWindowFocused } = this.resolvePresence(presence);
    const decisions = this.decider.decide({
      agents: event.agents.map(toNotificationSnapshot),
      isWindowFocused,
      nowMs: nowMs2
    });
    this.flushPreSeedDeltas();
    for (const decision of decisions) {
      if (decision.verdict !== "deliver") continue;
      this.fire(decision.transition);
    }
  }
  handleAgentUpsertedEvent(event, presence) {
    if (!this.hasSeededBaseline) {
      this.preSeedDeltas.push({ event, presence });
      return;
    }
    for (const decision of this.decider.decideAgent(
      toNotificationSnapshot(event.agent),
      this.resolvePresence(presence)
    )) {
      if (decision.verdict !== "deliver") continue;
      this.fire(decision.transition);
    }
  }
  resolvePresence(presence) {
    const nowMs2 = this.now();
    const focusedAtMs = presence.windowFocusedAtMs;
    const isWindowFocused = focusedAtMs != null && nowMs2 - focusedAtMs <= SAND_MOBILE_PUSH_FOCUS_FRESHNESS_MS;
    return { nowMs: nowMs2, isWindowFocused };
  }
  forget(agentId) {
    this.decider.forget(agentId);
  }
  flushPreSeedDeltas() {
    if (this.hasSeededBaseline) {
      return;
    }
    this.hasSeededBaseline = true;
    const buffered3 = this.preSeedDeltas;
    this.preSeedDeltas = [];
    for (const bufferedEvent of buffered3) {
      this.handleAgentUpsertedEvent(bufferedEvent.event, bufferedEvent.presence);
    }
  }
  fire(transition) {
    void this.deps.notify({
      agentId: transition.agentId,
      agentName: transition.agentName,
      messagePreview: transition.lastMessagePreview ?? void 0,
      lastMessageId: transition.lastMessageId ?? void 0,
      awaitingUserResponse: transition.kind === "agent-needs-input",
      senderAgentId: transition.lastMessageAuthorId ?? void 0,
      memberAgentIds: transition.memberIds,
      ...transition.pushMessageContent != null ? { messageContent: transition.pushMessageContent } : {}
    }).catch(() => {
    });
  }
};

