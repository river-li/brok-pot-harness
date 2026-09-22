/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/account/dev-login.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isDevBackendHostname(hostname2) {
  return hostname2 === "localhost" || hostname2 === "127.0.0.1" || hostname2 === "[::1]" || hostname2.endsWith(".lclhst.build") || hostname2 === "dev-staging.cursor.sh";
}

