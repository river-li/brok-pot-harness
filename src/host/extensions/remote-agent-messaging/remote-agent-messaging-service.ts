/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/remote-agent-messaging/remote-agent-messaging-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_grok_bot_pb();
init_errors();
var REMOTE_AGENT_MESSAGE_TIMEOUT_MS = 2e4;
var UNSETTLED_SEND_LEDGER_CAP = 64;
function describeRemoteAgentDelivery(delivery, target) {
  const label = target.name.length > 0 ? target.name : `agent ${target.requestedId}`;
  switch (delivery) {
    case GrokBotAgentMessageDelivery.DELIVERED_TEMPORAL:
    case GrokBotAgentMessageDelivery.DELIVERED_BOX:
    case GrokBotAgentMessageDelivery.DUPLICATE:
      return `Sent to ${label}. This is asynchronous \u2014 if they reply, it'll arrive later as a new message that wakes you; don't wait on it now.`;
    case GrokBotAgentMessageDelivery.TARGET_NOT_FOUND:
      return `No agent found with id ${target.requestedId}.`;
    case GrokBotAgentMessageDelivery.FORBIDDEN:
      return `You can't message ${label}.`;
    case GrokBotAgentMessageDelivery.INVALID_TARGET:
      return `${label} can't receive messages from here; message a teammate directly.`;
    case GrokBotAgentMessageDelivery.BOX_UNREACHABLE:
    case GrokBotAgentMessageDelivery.TEMPORAL_UNAVAILABLE:
    case GrokBotAgentMessageDelivery.UNSPECIFIED:
      return `Could not reach ${label} right now; try again later.`;
  }
}
function createRemoteAgentMessagingService(deps) {
  const unsettledSends = /* @__PURE__ */ new Map();
  const sendKey = (args, text2) => `${args.fromAgentId}\0${args.toAgentId}\0${text2}`;
  return {
    isEnabled: deps.isEnabled,
    requestTemporalMemberTurn: (args) => deps.temporalMemberTurns.requestTemporalMemberTurn(args),
    receiveRoomMemberTurnResult: (args) => deps.temporalMemberTurns.receiveRoomMemberTurnResult(args),
    cancelTemporalMemberTurns: (args) => deps.temporalMemberTurns.cancelTemporalMemberTurns(args),
    deliverServerRoomMemberTurnResult: (args) => deps.temporalMemberTurns.deliverServerRoomMemberTurnResult(args),
    async sendToRemoteAgent(args) {
      const undelivered = (ack2) => ({
        delivered: false,
        target: null,
        ack: ack2
      });
      const text2 = clampAgentMessage(args.text);
      if (text2.length === 0) return undelivered("Message was empty; nothing was sent.");
      if (args.toAgentId === args.fromAgentId) return undelivered("An agent can't message itself.");
      const key = sendKey(args, text2);
      const messageId = unsettledSends.get(key) ?? deps.mintMessageId();
      let response;
      try {
        response = await deps.client.sendGrokBotAgentMessage(
          {
            fromAgentId: args.fromAgentId,
            toAgentId: args.toAgentId,
            messageId,
            text: text2,
            sentAtMs: BigInt(Date.now())
          },
          { timeoutMs: REMOTE_AGENT_MESSAGE_TIMEOUT_MS }
        );
      } catch (error42) {
        unsettledSends.delete(key);
        unsettledSends.set(key, messageId);
        if (unsettledSends.size > UNSETTLED_SEND_LEDGER_CAP) {
          const oldest = unsettledSends.keys().next().value;
          if (oldest !== void 0) unsettledSends.delete(oldest);
        }
        deps.reportFailure(errorLogTag(error42));
        return undelivered(`Could not reach agent ${args.toAgentId} right now; try again later.`);
      }
      unsettledSends.delete(key);
      const ack = describeRemoteAgentDelivery(response.delivery, {
        name: response.targetName,
        requestedId: args.toAgentId
      });
      const delivered = response.delivery === GrokBotAgentMessageDelivery.DELIVERED_TEMPORAL || response.delivery === GrokBotAgentMessageDelivery.DELIVERED_BOX || response.delivery === GrokBotAgentMessageDelivery.DUPLICATE;
      return {
        delivered,
        target: response.targetAgentId.length > 0 ? { id: response.targetAgentId, name: response.targetName } : null,
        ack
      };
    }
  };
}

