function normalizeAccountKey(rawAccountKey) {
  const accountKey = normalizeMcpAccountLabel(rawAccountKey);
  if (accountKey.length === 0) {
    throw new SandMcpConfigError("MCP account label is required.");
  }
  return accountKey;
}
function runtimeConfigFromDisplay(display) {
  if (display == null) return null;
  return {
    mcpServers: Object.fromEntries(
      display.servers.flatMap(
        (server) => server.serverIdentifier != null && server.config != null && !isWithheldMcpDisplayServer(server) ? [[server.serverIdentifier, server.config]] : []
      )
    )
  };
}
function accountCredentialFingerprint(display) {
  const byIdentifier = /* @__PURE__ */ new Map();
  for (const server of display.servers) {
    byIdentifier.set(server.serverIdentifier ?? `mcp-row-${server.id}`, [
      isWithheldMcpDisplayServer(server),
      server.hasDefaultSlotToken,
      server.hasStaticCredentialHeaders,
      [...server.accounts ?? []].map((slot) => [slot.accountKey, slot.hasToken]).sort(([left], [right]) => left.localeCompare(right))
    ]);
  }
  return JSON.stringify([...byIdentifier].sort(([left], [right]) => left.localeCompare(right)));
}
function validateMarketplacePluginId(rawPluginId) {
  const value = rawPluginId.trim();
  if (!/^\d+$/.test(value)) {
    throw new SandMcpConfigError(`Invalid marketplace plugin id "${rawPluginId}".`);
  }
  return value;
}
function pluginAttributionFromDisplayServer(server) {
  return {
    ...server.pluginId != null ? { pluginId: server.pluginId } : {},
    ...server.isRequired === true ? { isRequired: true } : {},
    ...server.managedByTeamPluginPolicy === true ? { managedByTeamPluginPolicy: true } : {},
    ...server.servedBy == null ? {} : { servedBy: server.servedBy },
    ...server.cursorScmProvider != null ? { cursorScmProvider: server.cursorScmProvider } : {}
  };
}
function statusFromBackendListStatus(status) {
  const read = parseMcpRawServerStatus(status);
  return read.kind === "known" ? statusFromMcpRawServerStatus(read.status) : { status: "error", statusDetail: { kind: "not_reported_by_backend" } };
}
function statusFromBoxListStatus(status, discoveryUnavailable = false, statusDetail) {
  const read = parseMcpRawServerStatus(status);
  if (read.kind === "known") return statusFromMcpRawServerStatus(read.status, statusDetail);
  return discoveryUnavailable ? { status: "error", statusDetail: { kind: "bot_computer_unreachable" } } : { status: "error", statusDetail: { kind: "not_reported_by_bot_computer" } };
}
