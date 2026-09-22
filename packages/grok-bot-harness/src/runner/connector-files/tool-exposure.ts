/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/connector-files/tool-exposure.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function offersConnectorFileTools(args) {
  if (!args.hasConnectorFilesPort) return false;
  return args.mcpToolCount > 0 || args.mcpDiscoveryUnavailable;
}

