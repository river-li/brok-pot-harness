/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/voice-call/send-gate.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var NO_LINE_TO_SPEAK_ON = () => "call-closed";
function createVoiceCallGatedTransport(transport, refusalFor) {
  return {
    onUpdate: (update) => transport.onUpdate(update),
    lastSentMessageId: () => transport.lastSentMessageId?.(),
    lastReactionApplied: () => transport.lastReactionApplied?.() ?? false,
    sendMessageBlockReason: (message, deliverTo) => {
      const blocked = transport.sendMessageBlockReason?.(message, deliverTo);
      if (blocked !== void 0) return blocked;
      if (message.type !== "text" && message.type !== "attachment") return void 0;
      const address = message.channel;
      if (address === void 0 || VoiceCallChannel.callIdOf(address) === null) return void 0;
      const refusal = refusalFor({ address, message });
      if (refusal === null) return void 0;
      return VoiceCallChannelSends.reason(refusal, {
        address,
        sendTool: SAND_SEND_TO_USER_TOOL_NAME
      });
    }
  };
}

