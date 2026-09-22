/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-browser-surface.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function sandBrowserToolSurface(gates) {
  return gates.browserUsePlaywright() ? "playwright" : "driver";
}
function resolveSandBrowserSurface(host) {
  if (!host.remoteBoxHasDesktop || !host.getRemoteBoxAvailable()) return "none";
  if (host.isBrowserUseSubagent) return "driver";
  return host.isComputerUseSubagent && host.isCombinedComputerUseAvailable() ? sandBrowserToolSurface(host.gates) : "none";
}

