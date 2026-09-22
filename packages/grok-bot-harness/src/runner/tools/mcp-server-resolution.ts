/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/mcp-server-resolution.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function resolveMcpServerRowsByIdentifierOrLegacyId(installed, token) {
  const trimmed = token.trim();
  if (trimmed.length === 0) return [];
  const byIdentifier = installed.filter((server) => server.serverIdentifier === trimmed);
  if (byIdentifier.length > 0) return byIdentifier;
  return installed.filter((server) => server.id === trimmed);
}
function resolveMcpServerRowByIdentifierOrLegacyId(installed, token) {
  return resolveMcpServerRowsByIdentifierOrLegacyId(installed, token)[0] ?? null;
}
async function readMcpInstalledListing(listInstalled) {
  try {
    return { kind: "read", servers: await listInstalled() };
  } catch {
    return { kind: "unreadable" };
  }
}

