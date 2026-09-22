/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/validation.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function ensureFinitePositive({ value, name: name17, context: context2 }) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${context2} ${name17} must be a finite positive number, got ${value}`);
  }
  return value;
}

