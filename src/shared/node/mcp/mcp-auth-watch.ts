/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-auth-watch.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function authWatchKey(serverId, accountKey) {
  return `${serverId}::${accountKey}`;
}
var AUTH_WATCH_POLL_INTERVAL_MS = 5e3;
var AUTH_WATCH_TIMEOUT_MS = 15 * 60 * 1e3;
var AUTH_WATCH_POLL_TIMEOUT_MS = 3e4;

