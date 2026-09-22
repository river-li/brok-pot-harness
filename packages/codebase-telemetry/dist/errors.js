/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/codebase-telemetry/dist/errors.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CodebaseTelemetryCleanupError = class extends AggregateError {
  constructor(errors, message, options2) {
    super(errors, message, options2);
    this.name = "CodebaseTelemetryCleanupError";
  }
};
function toNonEmptyErrors(errors) {
  if (errors.length === 0) {
    return void 0;
  }
  const [firstError, ...remainingErrors] = errors;
  return [firstError, ...remainingErrors];
}

