/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/observability/heap-metrics.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function ownDataValue(value, key) {
  const descriptor2 = Object.getOwnPropertyDescriptor(value, key);
  return descriptor2 !== void 0 && "value" in descriptor2 ? descriptor2.value : void 0;
}
function isMetricCount(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function parseHeapMetricsReport(value) {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  try {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
      return null;
    }
    const usedBytes = ownDataValue(value, "usedBytes");
    const limitBytes = ownDataValue(value, "limitBytes");
    const loadedAgents = ownDataValue(value, "loadedAgents");
    const loadedTranscriptEntries = ownDataValue(value, "loadedTranscriptEntries");
    const idleMinutesLast15m = ownDataValue(value, "idleMinutesLast15m");
    if (typeof usedBytes !== "number" || !Number.isFinite(usedBytes) || usedBytes < 0) {
      return null;
    }
    if (typeof limitBytes !== "number" || !Number.isFinite(limitBytes) || limitBytes <= 0) {
      return null;
    }
    const sample = { usedBytes: usedBytes === 0 ? 0 : usedBytes, limitBytes };
    return {
      ...sample,
      ...isMetricCount(loadedAgents) ? { loadedAgents } : {},
      ...isMetricCount(loadedTranscriptEntries) ? { loadedTranscriptEntries } : {},
      ...isMetricCount(idleMinutesLast15m) ? { idleMinutesLast15m } : {}
    };
  } catch {
    return null;
  }
}

