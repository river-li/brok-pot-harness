/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/parse/retry-after.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function parseRetryAfterHeaderMs(raw, nowMs2 = Date.now()) {
  const trimmed = raw?.trim();
  if (trimmed == null || trimmed === "") {
    return void 0;
  }
  const seconds = Number(trimmed);
  if (Number.isFinite(seconds)) {
    return seconds <= 0 ? 0 : Math.round(seconds * 1e3);
  }
  const whenMs = Date.parse(trimmed);
  if (Number.isNaN(whenMs)) {
    return void 0;
  }
  const deltaMs = whenMs - nowMs2;
  return deltaMs <= 0 ? 0 : deltaMs;
}

