/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/beforeCommandExecutionHookResponse.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validateBeforeCommandExecutionHookResponse = (value) => {
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
  return createValidationResult(errors.length === 0, errors);
};

