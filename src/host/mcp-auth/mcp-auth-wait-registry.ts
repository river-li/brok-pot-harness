/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/mcp-auth/mcp-auth-wait-registry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var DEFAULT_MCP_AUTH_WAIT_TTL_MS = 60 * 60 * 1e3;
function normalizeConnectorName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}
var McpAuthWaitRegistry = class {
  waits = /* @__PURE__ */ new Map();
  ttlMs;
  now;
  constructor(options2) {
    this.ttlMs = options2?.ttlMs ?? DEFAULT_MCP_AUTH_WAIT_TTL_MS;
    this.now = options2?.now ?? (() => Date.now());
  }
  register(event) {
    this.prune();
    const serverId = event.serverId != null && event.serverId.length > 0 ? event.serverId : null;
    const nameKey = normalizeConnectorName(event.connector);
    let key = null;
    if (nameKey.length > 0) {
      key = nameKey;
    } else if (serverId != null) {
      key = `id:${serverId}`;
    }
    if (key == null) return;
    this.waits.set(key, {
      agentId: event.agentId,
      serverId,
      expiresAtMs: this.now() + this.ttlMs
    });
  }
  take(completion) {
    this.prune();
    const nameKey = normalizeConnectorName(completion.serverName);
    let byServerId = null;
    let byName = null;
    for (const [key, entry] of [...this.waits]) {
      const idMatch = entry.serverId != null && entry.serverId === completion.serverId;
      const nameMatch = entry.serverId == null && nameKey.length > 0 && key === nameKey;
      if (!idMatch && !nameMatch) continue;
      this.waits.delete(key);
      if (idMatch) byServerId = entry;
      else byName = entry;
    }
    return (byServerId ?? byName)?.agentId ?? null;
  }
  prune() {
    const now = this.now();
    for (const [key, entry] of [...this.waits]) {
      if (entry.expiresAtMs <= now) this.waits.delete(key);
    }
  }
};

