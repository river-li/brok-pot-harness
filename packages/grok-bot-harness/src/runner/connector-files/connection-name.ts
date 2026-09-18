function serviceKey(name17) {
  return name17.trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
function resolveConnectorConnectionName(requested, available) {
  const exact = available.find((candidate) => candidate.connection === requested);
  if (exact !== void 0) return { kind: "resolved", connection: exact.connection };
  const key = serviceKey(requested);
  if (key.length > 0) {
    const byService = available.filter((candidate) => serviceKey(candidate.service) === key);
    if (byService.length === 1) {
      return { kind: "resolved", connection: byService[0].connection };
    }
    if (byService.length > 1) {
      return {
        kind: "ambiguous",
        service: byService[0].service,
        candidates: byService.map((candidate) => candidate.connection)
      };
    }
  }
  return { kind: "unknown", available };
}
function describeConnectorConnections(available) {
  return available.map(
    (candidate) => candidate.connection === candidate.service ? candidate.connection : `${candidate.connection} (${candidate.service})`
  ).join(", ");
}
function describeAmbiguousConnectorConnection(requested, resolution) {
  return `${JSON.stringify(requested)} matches several connected ${resolution.service} accounts: ${resolution.candidates.join(", ")}. Pass one of those identifiers as connection (GetMcpServerStatus shows which account each one is) so the right account is used.`;
}
