/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/postToolUseFailureResponse.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validatePostToolUseFailureResponse = (value) => {
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  const errors = [];
  validateOptionalString(value.additional_context, "additional_context", errors);
  return createValidationResult(errors.length === 0, errors);
};

