/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/aiserver/v1/repository_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_repository_pb();

// @recovered-fragment 2/2
function toRedactedCodeResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    codeBlock: msg.codeBlock !== void 0 ? toRedactedCodeBlock(msg.codeBlock, privacyMode) : void 0,
    score: msg.score
  };
}
function fromRedactedCodeResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CodeResult({
    codeBlock: msg.codeBlock !== void 0 ? fromRedactedCodeBlock(msg.codeBlock, purpose, opts) : void 0,
    score: msg.score
  });
}

