/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/pi_common_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_pi_common_pb();
function toRedactedPiTruncation(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    truncated: msg.truncated,
    truncatedBy: msg.truncatedBy,
    totalLines: msg.totalLines,
    outputLines: msg.outputLines,
    outputBytes: msg.outputBytes,
    maxLines: msg.maxLines,
    maxBytes: msg.maxBytes,
    firstLineExceedsLimit: msg.firstLineExceedsLimit,
    lastLinePartial: msg.lastLinePartial
  };
}
function fromRedactedPiTruncation(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PiTruncation({
    truncated: msg.truncated,
    truncatedBy: msg.truncatedBy,
    totalLines: msg.totalLines,
    outputLines: msg.outputLines,
    outputBytes: msg.outputBytes,
    maxLines: msg.maxLines,
    maxBytes: msg.maxBytes,
    firstLineExceedsLimit: msg.firstLineExceedsLimit,
    lastLinePartial: msg.lastLinePartial
  });
}

