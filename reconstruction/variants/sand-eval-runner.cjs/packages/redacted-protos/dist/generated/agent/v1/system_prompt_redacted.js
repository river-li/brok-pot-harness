/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/system_prompt_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedSystemPromptSpec(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    spec: toRedactedSystemPromptSpec_spec(msg.spec, privacyMode)
  };
}
function toRedactedSystemPromptSpec_spec(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "replace":
      return { case: "replace", value: createRedactedString(oneof.value, DataClassification.CODE, "replace", privacyMode) };
    case "append":
      return { case: "append", value: createRedactedString(oneof.value, DataClassification.CODE, "append", privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSystemPromptSpec(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SystemPromptSpec({
    spec: fromRedactedSystemPromptSpec_spec(msg.spec, purpose, opts)
  });
}
function fromRedactedSystemPromptSpec_spec(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "replace":
      return { case: "replace", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    case "append":
      return { case: "append", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    default:
      return { case: void 0, value: void 0 };
  }
}

