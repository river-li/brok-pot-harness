function toNotificationSnapshot(agent) {
  return {
    id: agent.id,
    name: agent.name,
    ...agent.purpose == null ? {} : { purpose: agent.purpose },
    ...agent.namedBy === void 0 ? {} : { namedBy: agent.namedBy },
    isGroup: agent.isGroup,
    isRunning: agent.isRunning,
    awaitingReason: agent.awaitingUserResponse?.reason ?? null,
    awaitingReasonCopy: agent.awaitingUserResponse?.reasonCopy ?? null,
    notifyEnabled: agent.notifyOnUpdatesEnabled,
    isHiddenFromSidebar: agent.isHiddenFromSidebar === true,
    memberIds: agent.memberIds,
    lastMessageAuthorId: agent.lastMessageAuthorId ?? null,
    lastMessageId: agent.lastMessageId,
    lastMessagePreview: agent.lastMessagePreview ?? null,
    lastMessagePreviewSource: agent.lastMessagePreviewSource ?? null,
    pushMessageContent: agent.pushMessageContent ?? null
  };
}
var SAND_OS_NOTIFICATION_THROTTLE_MS = 5e3;
function diffAgentNotificationTransitions(previous, next) {
  const transitions = [];
  for (const agent of next) {
    const before = previous.get(agent.id);
    if (before == null) continue;
    const becameAwaiting = agent.awaitingReason != null && before.awaitingReason == null;
    if (becameAwaiting) {
      transitions.push({
        agentId: agent.id,
        agentName: agent.name,
        ...agent.purpose == null ? {} : { agentPurpose: agent.purpose },
        kind: "agent-needs-input",
        reason: agent.awaitingReason,
        reasonCopy: agent.awaitingReasonCopy ?? null,
        notifyEnabled: agent.notifyEnabled,
        isHiddenFromSidebar: agent.isHiddenFromSidebar,
        memberIds: agent.memberIds,
        lastMessageAuthorId: agent.lastMessageAuthorId,
        lastMessageId: agent.lastMessageId,
        lastMessagePreview: agent.lastMessagePreview,
        lastMessagePreviewSource: agent.lastMessagePreviewSource,
        pushMessageContent: agent.pushMessageContent
      });
      continue;
    }
    const finishedTurn = before.isRunning && !agent.isRunning && agent.awaitingReason == null;
    if (finishedTurn) {
      transitions.push({
        agentId: agent.id,
        agentName: agent.name,
        ...agent.purpose == null ? {} : { agentPurpose: agent.purpose },
        kind: "agent-done",
        reason: null,
        reasonCopy: null,
        notifyEnabled: agent.notifyEnabled,
        isHiddenFromSidebar: agent.isHiddenFromSidebar,
        memberIds: agent.memberIds,
        lastMessageAuthorId: agent.lastMessageAuthorId,
        lastMessageId: agent.lastMessageId,
        lastMessagePreview: agent.lastMessagePreview,
        lastMessagePreviewSource: agent.lastMessagePreviewSource,
        pushMessageContent: agent.pushMessageContent
      });
    }
  }
  return transitions;
}
function classifyNotifyDecision(input) {
  if (input.isHidden) return "suppressed_pref";
  if (!input.notifyEnabled) return "suppressed_pref";
  if (input.isWindowFocused) return "suppressed_focus";
  if (input.lastNotifiedAtMs != null && input.nowMs - input.lastNotifiedAtMs < input.throttleWindowMs) {
    return "suppressed_throttle";
  }
  return "deliver";
}
var SandOsNotificationDecider = class {
  constructor(throttleWindowMs = SAND_OS_NOTIFICATION_THROTTLE_MS) {
    this.throttleWindowMs = throttleWindowMs;
  }
  throttleWindowMs;
  previous = /* @__PURE__ */ new Map();
  lastNotifiedAtMs = /* @__PURE__ */ new Map();
  accountedMessageId = /* @__PURE__ */ new Map();
  get roster() {
    return this.previous;
  }
  decide(input) {
    const out = this.gateTransitions(
      diffAgentNotificationTransitions(this.previous, input.agents),
      input
    );
    const nextPrevious = /* @__PURE__ */ new Map();
    for (const agent of input.agents) {
      if (!this.accountedMessageId.has(agent.id)) {
        this.accountedMessageId.set(agent.id, agent.lastMessageId);
      }
      nextPrevious.set(agent.id, agent);
    }
    this.previous = nextPrevious;
    return out;
  }
  seedBaseline(agents) {
    for (const agent of agents) {
      if (!this.previous.has(agent.id)) {
        this.previous.set(agent.id, agent);
      }
      if (!this.accountedMessageId.has(agent.id)) {
        this.accountedMessageId.set(agent.id, agent.lastMessageId);
      }
    }
  }
  decideAgent(agent, input) {
    const out = this.gateTransitions(
      diffAgentNotificationTransitions(this.previous, [agent]),
      input
    );
    if (!this.accountedMessageId.has(agent.id)) {
      this.accountedMessageId.set(agent.id, agent.lastMessageId);
    }
    this.previous.set(agent.id, agent);
    return out;
  }
  takeUngatedTransitions(agents) {
    const out = this.dedupeAccountedMessages(
      diffAgentNotificationTransitions(this.previous, agents)
    );
    for (const agent of agents) {
      if (!this.accountedMessageId.has(agent.id)) {
        this.accountedMessageId.set(agent.id, agent.lastMessageId);
      }
      this.previous.set(agent.id, agent);
    }
    return out;
  }
  dedupeAccountedMessages(transitions) {
    const out = [];
    for (const transition of transitions) {
      const accounted = this.accountedMessageId.get(transition.agentId) ?? null;
      if (transition.kind === "agent-done" && (transition.lastMessageId == null || transition.lastMessageId === accounted)) {
        continue;
      }
      this.accountedMessageId.set(transition.agentId, transition.lastMessageId);
      out.push(transition);
    }
    return out;
  }
  gateTransitions(transitions, input) {
    const out = [];
    for (const transition of this.dedupeAccountedMessages(transitions)) {
      const key = throttleKey(transition.agentId, transition.kind);
      const verdict = classifyNotifyDecision({
        notifyEnabled: transition.notifyEnabled,
        isHidden: transition.isHiddenFromSidebar,
        isWindowFocused: input.isWindowFocused,
        nowMs: input.nowMs,
        lastNotifiedAtMs: this.lastNotifiedAtMs.get(key) ?? null,
        throttleWindowMs: this.throttleWindowMs
      });
      if (verdict === "deliver") {
        this.lastNotifiedAtMs.set(key, input.nowMs);
      }
      out.push({ transition, verdict });
    }
    return out;
  }
  forget(agentId) {
    this.previous.delete(agentId);
    this.accountedMessageId.delete(agentId);
    this.lastNotifiedAtMs.delete(throttleKey(agentId, "agent-done"));
    this.lastNotifiedAtMs.delete(throttleKey(agentId, "agent-needs-input"));
  }
};
function throttleKey(agentId, kind) {
  return `${agentId}:${kind}`;
}
