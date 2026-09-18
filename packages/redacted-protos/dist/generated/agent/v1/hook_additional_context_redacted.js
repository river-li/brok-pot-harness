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
