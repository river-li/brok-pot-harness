/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/hook_additional_context_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_hook_additional_context_pb();
function toRedactedHookAdditionalContext(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    hookEventName: msg.hookEventName,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode)
  };
}
function fromRedactedHookAdditionalContext(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new HookAdditionalContext({
    hookEventName: msg.hookEventName,
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

