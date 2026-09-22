/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/afterShellExecutionResponse.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validateAfterShellExecutionResponse = (value) => {
  const base = validateBaseHookResponse(value);
  if (!base.isValid) {
    return base;
  }
  return base;
};

