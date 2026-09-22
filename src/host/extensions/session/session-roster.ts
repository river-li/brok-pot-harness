/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/session-roster.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_promises68 = require("node:fs/promises");

// @recovered-fragment 2/2
init_errors();
async function listAgents(host, activeAgentId) {
  let entries;
  try {
    entries = await (0, import_promises68.readdir)(host.rootDir, { withFileTypes: true });
  } catch (error42) {
    if (error42.code === "ENOENT") return [];
    throw error42;
  }
  const summaries = await Promise.all(
    entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
      if (host.isAgentBeingDeleted(entry.name)) return null;
      const dbPath = getAgentDbPath(host.rootDir, entry.name);
      const dbStats = await statIfExists(dbPath);
      if (dbStats == null) {
        try {
          return await host.recoverAgentWithMissingDb({
            dbPath,
            dirName: entry.name,
            activeAgentId
          });
        } catch (error42) {
          reportSessionDiagnostic({
            family: "summary_build",
            kind: "recovery_build_failed",
            agentId: entry.name,
            errorClass: errorLogTag(error42)
          });
          return minimalAgentSummary({
            dirName: entry.name,
            dbPath,
            dbStats: void 0,
            activeAgentId
          });
        }
      }
      try {
        const extras = await host.loadCachedExtras({
          dirName: entry.name,
          dbPath,
          dbStats
        });
        if (host.isAgentBeingDeleted(entry.name)) return null;
        return await buildSummary({
          extras,
          dbPath,
          dirName: entry.name,
          dbStats,
          activeAgentId,
          includeBlank: false,
          agentHasMemory: (candidate) => host.memory.agentHasContent(candidate)
        });
      } catch (error42) {
        if (host.isAgentBeingDeleted(entry.name)) return null;
        reportSessionDiagnostic({
          family: "summary_build",
          kind: "degraded",
          agentId: entry.name,
          errorClass: errorLogTag(error42)
        });
        try {
          return await buildSummary({
            extras: null,
            dbPath,
            dirName: entry.name,
            dbStats,
            activeAgentId,
            includeBlank: true,
            agentHasMemory: (candidate) => host.memory.agentHasContent(candidate)
          });
        } catch (fallbackError) {
          reportSessionDiagnostic({
            family: "summary_build",
            kind: "degraded_failed",
            agentId: entry.name,
            errorClass: errorLogTag(fallbackError)
          });
          return minimalAgentSummary({
            dirName: entry.name,
            dbPath,
            dbStats,
            activeAgentId
          });
        }
      }
    })
  );
  host.pruneExtrasCache(new Set(entries.map((entry) => entry.name)));
  return summaries.filter((summary) => summary != null).sort(compareAgentSummaries);
}
async function summarizeAgentById(host, agentId, activeAgentId) {
  if (host.isAgentBeingDeleted(agentId)) return null;
  const dbPath = getAgentDbPath(host.rootDir, agentId);
  const dbStats = await statIfExists(dbPath);
  if (dbStats == null) {
    return await host.recoverAgentWithMissingDb({
      dbPath,
      dirName: agentId,
      activeAgentId
    });
  }
  const extras = await host.loadCachedExtras({ dirName: agentId, dbPath, dbStats });
  if (host.isAgentBeingDeleted(agentId)) return null;
  return await buildSummary({
    extras,
    dbPath,
    dirName: agentId,
    dbStats,
    activeAgentId,
    includeBlank: true,
    agentHasMemory: (candidate) => host.memory.agentHasContent(candidate)
  });
}

