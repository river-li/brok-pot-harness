/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/preToolUseResponse.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validatePreToolUseResponse = (value) => {
  const errors = [];
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  if (value.permission !== void 0) {
    const validPermissions = ["allow", "deny", "ask"];
    if (!validPermissions.includes(value.permission)) {
      errors.push(`Invalid permission value. Expected one of: ${validPermissions.join(", ")}, or undefined`);
    }
  }
  if (value.user_message !== void 0 && typeof value.user_message !== "string") {
    errors.push("Invalid user_message value. Expected a string if provided");
  }
  if (value.agent_message !== void 0 && typeof value.agent_message !== "string") {
    errors.push("Invalid agent_message value. Expected a string if provided");
  }
  if (value.updated_input !== void 0) {
    if (typeof value.updated_input !== "object" || value.updated_input === null || Array.isArray(value.updated_input)) {
      errors.push("Invalid updated_input value. Expected a plain object if provided");
    }
  }
  validateOptionalString(value.additional_context, "additional_context", errors);
  return createValidationResult(errors.length === 0, errors);
};

