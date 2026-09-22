/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/send-thread-stamping.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function resolveSendReplyThreading(tm, replyToIdOption, isForkOption, readAddressedTranscript) {
  const transcriptForReply = replyToIdOption != null && replyToIdOption.length > 0 ? readAddressedTranscript() : [];
  const replyToId = replyToIdOption != null && replyToIdOption.length > 0 ? tm.turnRuntime.resolveReplyTarget(transcriptForReply, replyToIdOption) : void 0;
  const replyContext = tm.turnRuntime.buildReplyContext(transcriptForReply, replyToId);
  const isFork = isForkOption && replyToId != null;
  return { replyToId, replyContext, isFork };
}
function validateAiReplyTarget(message, inFlightId, entries) {
  const target = "reply_to" in message ? message.reply_to : void 0;
  if (target == null || target.length === 0) return message;
  if (target === inFlightId) {
    return stripReplyTo(message);
  }
  const exists = entries.some((entry) => entry.id === target);
  return exists ? message : stripReplyTo(message);
}
function applyAutoReplyThread(tm, message, session, entries) {
  if ("reply_to" in message && message.reply_to != null && message.reply_to.length > 0) {
    return message;
  }
  if (session == null) return message;
  const target = tm.turnRuntime.replyThreadTargets.get(session);
  if (target == null) return message;
  if (!entries.some((entry) => entry.id === target)) return message;
  return withReplyTo(message, target);
}

