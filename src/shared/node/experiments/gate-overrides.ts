/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/experiments/gate-overrides.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function parseGateOverrides(raw) {
  if (raw == null || raw.length === 0) return {};
  const overrides = {};
  for (const pair of raw.split(",")) {
    const [key, value] = pair.split("=", 2).map((part) => part.trim());
    if (key == null || key.length === 0 || Object.hasOwn(overrides, key)) continue;
    overrides[key] = value === "1" || value === "true" || value === "on";
  }
  return overrides;
}

