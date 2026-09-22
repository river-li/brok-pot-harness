/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/postToolUseResponse.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validatePostToolUseResponse = (value) => {
  const errors = [];
  const base = validateBaseHookResponse(value);
  if (!base.isValid) {
    return base;
  }
  validateOptionalString(value.additional_context, "additional_context", errors);
  return createValidationResult(errors.length === 0, errors);
};

