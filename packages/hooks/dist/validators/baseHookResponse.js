/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/baseHookResponse.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validateBaseHookResponse = (value) => {
  const errors = [];
  if (!isObject2(value)) {
    errors.push("Expected an object");
    return createValidationResult(false, errors);
  }
  return createValidationResult(true);
};

