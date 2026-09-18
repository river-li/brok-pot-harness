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
