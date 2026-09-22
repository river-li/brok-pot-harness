/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/runner-gates.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_RUNNER_GATE_DEFAULTS = {
  sendMessageDeliveryOwed: true,
  dynamicTools: false,
  stableDynamicToolCatalog: false,
  browserNavigationRecovery: false,
  browserUsePlaywright: false,
  userForm: false,
  formVault: false,
  draftExternalMessage: false,
  agentPromptedCookieSync: false,
  stripeLink: false,
  spotlight: true,
  mcpMultiAccount: false,
  unicodeTyping: false,
  cloudAgentsDisabledByTeam: false,
  cloudAgentArtifacts: false,
  /**
   * Statsig `grok_bot_cloud_agent_durable_watch`, read per turn on both hosts.
   * Off: a cloud-agent watch wakes the bot once, when the run it registered
   * against finishes, and the tool keeps its one-shot copy. On: launch / reply
   * / watch of an owned agent stay armed across every later run, `unwatch`
   * and `watch confirm: true` adoption exist, and the revival carries the
   * runaway notice.
   */
  cloudAgentDurableWatch: false,
  /**
   * Statsig `grok_bot_cloud_agent_reply_modes`. Off: CloudAgent `reply` is
   * today's queue-or-interrupt follow-up. On: `reply` takes `mode`
   * (queue | steer | interrupt), where steer injects into the agent's running
   * turn and falls back to queue when it is idle. Temporal-only: the box host
   * has no steer port and pins it off.
   */
  cloudAgentReplyModes: false,
  cloudAgentExchange: false,
  cloudCanvasTools: false,
  lessSubagentFanout: false,
  /**
   * reduce_sand_peer_chatter treatment: SendToAgent argument aliases, a
   * required `priority` that decides wake-now vs. hold-for-next-turn, and
   * conservative [agent] wake replies. Temporal-only: the box harness pins
   * control so exposures come from the harness the inbox delivery runs on.
   */
  reducePeerChatter: false,
  updateCommunication: false,
  /**
   * grok_bot_lean_send_to_user_description treatment: the SendToUser tool
   * description carries only the message shapes and parameters, and the
   * reply policy (only voice, reply first, ack is not delivery, when to ask,
   * voice memo, end_turn) lives once, in the "## SendToUser is your only
   * voice" system prompt section. Control keeps the shipped description,
   * which restates that section. Temporal-only: the box harness pins control.
   */
  leanSendToUserDescription: false,
  /**
   * Statsig `grok_bot_active_reactions`, read per turn on both hosts. On, the
   * system prompt carries a "## Reactions" section that makes emoji tapbacks
   * part of the bot's everyday voice, and the ReactToMessage description
   * matches it. Off keeps the "use this VERY sparingly" wording.
   */
  activeReactions: false,
  /**
   * Statsig `grok_bot_frozen_tool_descriptions`. On, a conversation pins each
   * tool's description per compaction epoch, keeps sending the pinned text,
   * and carries a description edit in the next turn's `<instructions_update>`
   * note instead of rewriting the tool definitions block (see
   * frozen-tool-descriptions.ts). Temporal-only: the box host has no snapshot
   * store for it and pins it off.
   */
  frozenToolDescriptions: false,
  internalDetailsBoundary: false,
  agentDescription: true,
  botShare: false,
  botShareGettingStarted: false,
  teamAccessCards: false,
  scmConnectCard: false,
  voiceCall: false,
  fiveMinuteAutomationFloor: false,
  messagesTools: false,
  chromeCookieImport: false,
  boxEgressTunnel: false,
  onePasswordIntegration: false,
  checkSubscriptionUsage: false,
  connectedActivity: false,
  /**
   * Statsig `grok_bot_agent_mail`. On, the system prompt and send-on-behalf /
   * no-connector skills teach native Grok Bot inboxes and `claim_email_inbox`.
   * Off, that copy is absent so the model is not steered at tools it does not
   * have. Same flag as the email port and Settings Email row.
   */
  agentEmail: false,
  agentEmailMultipleInboxes: false,
  summaryTurnEndHold: false,
  generalizedSelfSummaryPrompt: false
};
var SAND_RUNNER_GATE_NAMES = Object.keys(SAND_RUNNER_GATE_DEFAULTS).filter(
  (name17) => isKeyOf(SAND_RUNNER_GATE_DEFAULTS, name17)
);
function forEveryGate(build2) {
  return Object.fromEntries(
    SAND_RUNNER_GATE_NAMES.map((name17) => [name17, build2(name17)])
  );
}
function fixedGate(value, why) {
  return { kind: "fixed", value, why };
}
function readerOf(name17, wiring) {
  if (wiring === void 0) {
    throw new Error(`runner gate ${name17} is not classified at this composition`);
  }
  if (typeof wiring === "function") return wiring;
  const value = wiring.kind === "fixed" && wiring.value;
  return () => value;
}
function composeSandRunnerGates(wirings) {
  return forEveryGate((name17) => readerOf(name17, wirings[name17]));
}
var SUBAGENT_GATE_POLICY = {
  sendMessageDeliveryOwed: "default",
  dynamicTools: "inherited",
  stableDynamicToolCatalog: "inherited",
  browserNavigationRecovery: "inherited",
  browserUsePlaywright: "inherited",
  userForm: "default",
  formVault: "default",
  draftExternalMessage: "default",
  agentPromptedCookieSync: "default",
  stripeLink: "default",
  spotlight: "inherited",
  mcpMultiAccount: "default",
  unicodeTyping: "inherited",
  cloudAgentsDisabledByTeam: "inherited",
  cloudAgentArtifacts: "inherited",
  cloudAgentDurableWatch: "inherited",
  cloudAgentReplyModes: "inherited",
  cloudAgentExchange: "default",
  cloudCanvasTools: "default",
  lessSubagentFanout: "default",
  reducePeerChatter: "inherited",
  updateCommunication: "default",
  leanSendToUserDescription: "default",
  activeReactions: "default",
  frozenToolDescriptions: "default",
  internalDetailsBoundary: "default",
  agentDescription: "inherited",
  botShare: "default",
  botShareGettingStarted: "default",
  teamAccessCards: "default",
  scmConnectCard: "default",
  voiceCall: "default",
  fiveMinuteAutomationFloor: "default",
  messagesTools: "default",
  chromeCookieImport: "default",
  boxEgressTunnel: "default",
  onePasswordIntegration: "default",
  checkSubscriptionUsage: "default",
  connectedActivity: "default",
  agentEmail: "inherited",
  agentEmailMultipleInboxes: "inherited",
  summaryTurnEndHold: "default",
  generalizedSelfSummaryPrompt: "inherited"
};
function pickSubagentGates(parent) {
  return composeSandRunnerGates(
    forEveryGate((name17) => {
      return SUBAGENT_GATE_POLICY[name17] === "inherited" ? parent[name17] : fixedGate(
        SAND_RUNNER_GATE_DEFAULTS[name17],
        "a subagent reads the default unless SUBAGENT_GATE_POLICY inherits it"
      );
    })
  );
}

