/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/log-metadata.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function compactLogMetadata(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== void 0));
}
function snapshotUrlPartsForLog(url2) {
  try {
    const parsed = new URL(url2);
    return {
      host: parsed.host,
      origin: parsed.origin,
      pathname: parsed.pathname
    };
  } catch (_a20) {
    return {
      host: null,
      origin: null,
      pathname: null
    };
  }
}
function snapshotUrlForLog(url2, options2) {
  const parts = snapshotUrlPartsForLog(url2);
  const includePath = (options2 === null || options2 === void 0 ? void 0 : options2.includePath) !== false;
  return {
    host: parts.host,
    origin: parts.origin,
    path: includePath ? parts.pathname : null
  };
}
function snapshotServerUrlForLog(url2, options2) {
  return snapshotUrlForLog(url2, options2);
}
var init_log_metadata = __esm({
  "../packages/mcp-core/dist/log-metadata.js"() {
    "use strict";
    init_logger2();
  }
});

