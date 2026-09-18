function sandBrowserToolSurface(gates) {
  return gates.browserUsePlaywright() ? "playwright" : "driver";
}
function resolveSandBrowserSurface(host) {
  if (!host.remoteBoxHasDesktop || !host.getRemoteBoxAvailable()) return "none";
  if (host.isBrowserUseSubagent) return "driver";
  return host.isComputerUseSubagent && host.isCombinedComputerUseAvailable() ? sandBrowserToolSurface(host.gates) : "none";
}
