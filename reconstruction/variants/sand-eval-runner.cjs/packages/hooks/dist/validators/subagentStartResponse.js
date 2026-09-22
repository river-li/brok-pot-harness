/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/subagentStartResponse.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validateSubagentStartResponse = (value) => {
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  const errors = [];
  const response = value;
  if (response.permission !== void 0) {
    const validPermissions = ["allow", "deny", "ask"];
    if (!validPermissions.includes(response.permission)) {
      errors.push(`Invalid permission value. Expected one of: ${validPermissions.join(", ")}, or undefined`);
    }
  }
  if (response.user_message !== void 0 && !isString(response.user_message)) {
    errors.push("user_message must be a string if provided");
  }
  return createValidationResult(errors.length === 0, errors);
};

