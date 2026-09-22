/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/automation-completions.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_AUTOMATION_COMPLETION_ID_PREFIX = "automation-subagent:";
var SAND_PEER_INBOX_MESSAGE_ID_PREFIX = "peer-message:";
var SAND_AUTOMATION_COMPLETION_MAX_ID_CHARS = 128;
var SAND_AUTOMATION_COMPLETION_MAX_TEXT_CHARS = 64e3;
var SAND_AUTOMATION_COMPLETION_MAX_ATTRIBUTION_CHARS = 512;
var SAND_AUTOMATION_COMPLETION_MAX_PENDING = 256;
function sandAutomationCompletionId(runUuid) {
  return `${SAND_AUTOMATION_COMPLETION_ID_PREFIX}${runUuid}`;
}
function isSandPeerInboxMessageId(id) {
  return id.startsWith(SAND_PEER_INBOX_MESSAGE_ID_PREFIX);
}
function sandAutomationCompletionAttribution(automationName) {
  const name17 = automationName?.trim();
  return name17 !== void 0 && name17.length > 0 ? `Automation: ${name17}` : "Automation";
}
function formatSandAutomationCompletionText(args) {
  const name17 = args.automationName?.trim();
  const label = name17 !== void 0 && name17.length > 0 ? `Automation '${name17}'` : "Automation";
  return `${label} ${args.status}:
${args.result}`;
}
function truncateWithMarker(value, maxChars, marker17) {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars - marker17.length)}${marker17}`;
}
function boundSandAutomationCompletion(completion) {
  const peerMessage = isSandPeerInboxMessageId(completion.id);
  if (!peerMessage && !completion.id.startsWith(SAND_AUTOMATION_COMPLETION_ID_PREFIX) || completion.id.length > SAND_AUTOMATION_COMPLETION_MAX_ID_CHARS || completion.text.trim().length === 0) {
    return void 0;
  }
  const attribution = completion.attribution.trim();
  return {
    id: completion.id,
    text: truncateWithMarker(
      completion.text,
      SAND_AUTOMATION_COMPLETION_MAX_TEXT_CHARS,
      peerMessage ? "\n[message truncated]" : "\n[automation result truncated]"
    ),
    attribution: attribution.length === 0 ? "Automation" : attribution.slice(0, SAND_AUTOMATION_COMPLETION_MAX_ATTRIBUTION_CHARS)
  };
}
function createSandAutomationCompletionInbox(initial = [], options2 = {}) {
  const pending = /* @__PURE__ */ new Map();
  const staged = /* @__PURE__ */ new Map();
  const acknowledged = /* @__PURE__ */ new Set();
  const rememberAcknowledged = (id) => {
    acknowledged.delete(id);
    acknowledged.add(id);
    while (acknowledged.size > SAND_AUTOMATION_COMPLETION_MAX_PENDING) {
      const oldestId = acknowledged.values().next().value;
      if (oldestId === void 0) break;
      acknowledged.delete(oldestId);
    }
  };
  const enqueue = (completion) => {
    const bounded = boundSandAutomationCompletion(completion);
    if (bounded === void 0 || acknowledged.has(bounded.id) || staged.has(bounded.id)) {
      return;
    }
    pending.delete(bounded.id);
    pending.set(bounded.id, bounded);
    while (pending.size > SAND_AUTOMATION_COMPLETION_MAX_PENDING) {
      const oldestId = pending.keys().next().value;
      if (oldestId === void 0) break;
      pending.delete(oldestId);
    }
  };
  for (const completion of initial) enqueue(completion);
  return {
    enqueue,
    drain: () => {
      const completions = [...pending.values()];
      pending.clear();
      return completions;
    },
    stageForCheckpoint: (completions) => {
      for (const completion of completions) {
        const bounded = boundSandAutomationCompletion(completion);
        if (bounded === void 0 || acknowledged.has(bounded.id)) continue;
        pending.delete(bounded.id);
        staged.set(bounded.id, bounded);
      }
    },
    commitCheckpoint: async () => {
      const completions = [...staged.values()];
      if (completions.length === 0) return;
      await options2.onCommit?.(completions);
      for (const completion of completions) {
        if (staged.get(completion.id) !== completion) continue;
        staged.delete(completion.id);
        rememberAcknowledged(completion.id);
      }
    },
    rollbackCheckpoint: () => {
      const completions = [...staged.values()];
      staged.clear();
      for (const completion of completions) enqueue(completion);
    }
  };
}

