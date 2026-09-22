/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/transport.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var AUTOMATION_SUBAGENT_VISIBLE_TRANSCRIPT_BLOCKED = "Automation subagents cannot mutate the visible transcript. Continue autonomously when the result can wait; if the saved instruction requires user-visible communication, use WakeParent because a normal final response does not wake the parent or reach the user. If an old instruction names SendMessage or SendToUser, those tools are deprecated and unavailable here: do not discover or retry them; pass the complete payload or handoff to WakeParent.";
var AUTOMATION_SUBAGENT_INTERACTIVE_SEND_BLOCKED = "Automation subagents cannot send widgets or secret requests because replies cannot route back to the originating subagent. Continue autonomously and send text, an attachment, or a cloud-agent card instead.";
function isAutomationApprovalCard(update) {
  return update.type === "send-message" && (update.message.type === "auto-review-approval" || update.message.type === "local-tool-permission");
}
function createAutomationSubagentTransport(transport, options2) {
  if (options2?.parentMediated !== true) {
    return {
      onUpdate: (update) => transport?.onUpdate(update),
      lastSentMessageId: () => transport?.lastSentMessageId?.(),
      lastReactionApplied: () => transport?.lastReactionApplied?.() ?? false,
      sendMessageBlockReason: (message, deliverTo) => {
        if (message.type === "widget" || message.type === "secret-request") {
          return AUTOMATION_SUBAGENT_INTERACTIVE_SEND_BLOCKED;
        }
        return transport?.sendMessageBlockReason?.(message, deliverTo);
      }
    };
  }
  return {
    onUpdate: (update) => {
      if (update.type === "send-message" || update.type === "react-to-message") {
        if (isAutomationApprovalCard(update)) transport?.onUpdate(update);
        return;
      }
      transport?.onUpdate(update);
    },
    lastSentMessageId: () => transport?.lastSentMessageId?.(),
    lastReactionApplied: () => false,
    sendMessageBlockReason: () => AUTOMATION_SUBAGENT_VISIBLE_TRANSCRIPT_BLOCKED
  };
}
function createSandTransport(ingest) {
  let lastSentMessageId;
  let lastReactionApplied = false;
  return {
    onUpdate: (update) => {
      const assignedId = ingest(update);
      if (update.type === "send-message") {
        lastSentMessageId = assignedId;
      } else if (update.type === "react-to-message") {
        lastReactionApplied = assignedId != null;
      }
    },
    lastSentMessageId: () => lastSentMessageId,
    lastReactionApplied: () => lastReactionApplied
  };
}

