function isWithheldMcpDisplayServer(server) {
  return server.disabledByTeamAdminPolicy || server.needsGrant === true;
}
function mergeUnresolvedAccountServers(display, cached2) {
  if (cached2 == null || !display.unresolvedServerIds?.length) return display;
  const unresolvedIds = new Set(display.unresolvedServerIds);
  const freshById = new Map(display.servers.map((server) => [server.id, server]));
  const cachedIds = new Set(cached2.servers.map((server) => server.id));
  return {
    ...display,
    servers: [
      ...cached2.servers.flatMap((server) => {
        const fresh = freshById.get(server.id);
        if (fresh != null) return [fresh];
        if (unresolvedIds.has(server.id)) return [server];
        return [];
      }),
      ...display.servers.filter((server) => !cachedIds.has(server.id))
    ]
  };
}
