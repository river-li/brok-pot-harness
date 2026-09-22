/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/format-duration.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function formatDurationMs(duration3, options2 = {}) {
  const { alwaysShowSeconds = true, wholeSeconds = false } = options2;
  if (duration3 === void 0) {
    return void 0;
  }
  const numeric3 = typeof duration3 === "bigint" ? Number(duration3) : Number(duration3);
  if (!Number.isFinite(numeric3) || numeric3 < 0) {
    return void 0;
  }
  const totalSeconds = wholeSeconds ? Math.ceil(numeric3 / 1e3) : Math.round(numeric3 / 1e3);
  if (numeric3 < 1e3) {
    if (wholeSeconds) {
      return `${totalSeconds}s`;
    }
    return `${Math.round(numeric3)}ms`;
  }
  if (totalSeconds < 60) {
    if (wholeSeconds || numeric3 >= 1e4) {
      return `${totalSeconds}s`;
    }
    return `${(numeric3 / 1e3).toFixed(1)}s`;
  }
  if (totalSeconds < 3600) {
    const mins2 = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (secs === 0) {
      return `${mins2}m`;
    }
    return `${mins2}m ${secs}s`;
  }
  if (totalSeconds < 86400) {
    const hrs2 = Math.floor(totalSeconds / 3600);
    const mins2 = Math.floor(totalSeconds % 3600 / 60);
    const secs = totalSeconds % 60;
    if (alwaysShowSeconds) {
      if (mins2 === 0 && secs === 0) {
        return `${hrs2}h`;
      }
      if (secs === 0) {
        return `${hrs2}h ${mins2}m`;
      }
      if (mins2 === 0) {
        return `${hrs2}h ${secs}s`;
      }
      return `${hrs2}h ${mins2}m ${secs}s`;
    }
    if (mins2 === 0) {
      return `${hrs2}h`;
    }
    return `${hrs2}h ${mins2}m`;
  }
  const days = Math.floor(totalSeconds / 86400);
  const hrs = Math.floor(totalSeconds % 86400 / 3600);
  const mins = Math.floor(totalSeconds % 3600 / 60);
  if (alwaysShowSeconds) {
    if (hrs === 0 && mins === 0) {
      return `${days}d`;
    }
    if (mins === 0) {
      return `${days}d ${hrs}h`;
    }
    if (hrs === 0) {
      return `${days}d ${mins}m`;
    }
    return `${days}d ${hrs}h ${mins}m`;
  }
  if (hrs === 0) {
    return `${days}d`;
  }
  return `${days}d ${hrs}h`;
}
var init_format_duration = __esm({
  "../packages/utils/dist/format-duration.js"() {
    "use strict";
  }
});

