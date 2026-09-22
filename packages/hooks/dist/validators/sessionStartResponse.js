/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/sessionStartResponse.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validateSessionStartResponse = (value) => {
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  const errors = [];
  if (value.env !== void 0) {
    if (!isObject2(value.env)) {
      errors.push("env must be an object if provided");
    } else {
      for (const [key, val] of Object.entries(value.env)) {
        if (!isString2(key)) {
          errors.push(`env key "${key}" must be a string`);
        }
        if (!isString2(val)) {
          errors.push(`env value for "${key}" must be a string`);
        }
      }
    }
  }
  if (value.additional_context !== void 0 && !isString2(value.additional_context)) {
    errors.push("additional_context must be a string if provided");
  }
  if (value.continue !== void 0 && typeof value.continue !== "boolean") {
    errors.push("continue must be a boolean if provided");
  }
  if (value.user_message !== void 0 && !isString2(value.user_message)) {
    errors.push("user_message must be a string if provided");
  }
  return createValidationResult(errors.length === 0, errors);
};

