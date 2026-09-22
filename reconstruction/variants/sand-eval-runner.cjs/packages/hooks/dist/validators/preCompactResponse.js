/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/preCompactResponse.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var isString2 = (value) => typeof value === "string";
var validatePreCompactResponse = (value) => {
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  if (value === void 0 || value === null || Object.keys(value).length === 0) {
    return createValidationResult(true, []);
  }
  const errors = [];
  if (!isObject(value)) {
    errors.push("PreCompact response must be an object");
    return createValidationResult(false, errors);
  }
  const response = value;
  if (response.user_message !== void 0 && !isString2(response.user_message)) {
    errors.push("user_message must be a string");
  }
  return createValidationResult(errors.length === 0, errors);
};

