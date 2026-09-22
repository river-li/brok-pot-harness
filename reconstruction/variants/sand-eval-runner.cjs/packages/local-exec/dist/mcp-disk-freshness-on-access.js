/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/mcp-disk-freshness-on-access.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();

// @recovered-fragment 2/2
var logger15 = createLogger("local-exec:mcp-disk-freshness-on-access");
var MCP_PATH_SEGMENT = "/mcps/";
var DISK_MCPS_FRESHNESS_DEBOUNCE_MS = 2e3;
var mcpDiscoveryFreshnessCheck = createCounter("mcp.discovery_freshness.check", {
  description: "MCP discovery surface freshness comparison outcome against canonical live tools",
  labelNames: ["surface", "outcome"]
});
var mcpDiscoveryFreshnessMissingTools = createHistogram("mcp.discovery_freshness.missing_tools", {
  description: "Number of tools present in canonical live state but missing from the observed discovery surface",
  labelNames: ["surface"]
});
var mcpDiscoveryFreshnessExtraTools = createHistogram("mcp.discovery_freshness.extra_tools", {
  description: "Number of tools present on the observed discovery surface but absent from canonical live state",
  labelNames: ["surface"]
});
var mcpDiscoveryFreshnessSymmetricDifference = createHistogram("mcp.discovery_freshness.symmetric_difference", {
  description: "Total symmetric difference between canonical live tools and the observed discovery surface",
  labelNames: ["surface"]
});
var diskFreshnessDebounceTimers = /* @__PURE__ */ new Map();
function normalizePathForMcpsLayout(filePath) {
  const norm = filePath.replace(/\\/g, "/");
  if (norm.endsWith("/mcps")) {
    return `${norm}/`;
  }
  return norm;
}
function isMcpDirectoryPath(path30) {
  if (path30 === void 0) {
    return false;
  }
  return normalizePathForMcpsLayout(path30).includes(MCP_PATH_SEGMENT);
}
function parseMcpsPath(filePath) {
  const norm = normalizePathForMcpsLayout(filePath);
  const idx = norm.indexOf(MCP_PATH_SEGMENT);
  if (idx === -1) {
    return void 0;
  }
  const projectDir = norm.slice(0, idx);
  const rest = norm.slice(idx + MCP_PATH_SEGMENT.length);
  const parts = rest.split("/").filter(Boolean);
  if (projectDir.length === 0) {
    return void 0;
  }
  if (parts.length === 0) {
    return { projectDir, kind: "mcps_root" };
  }
  return {
    projectDir,
    kind: "server",
    sanitizedServerFolder: parts[0]
  };
}
function emitDiskMcpDiscoveryFreshness({ ctx, serverIdentifier, canonicalToolNames, observedToolNames }) {
  const observedToolSet = new Set(observedToolNames);
  const canonicalToolSet = new Set(canonicalToolNames);
  const missingTools = canonicalToolNames.filter((toolName) => !observedToolSet.has(toolName));
  const extraTools = observedToolNames.filter((toolName) => !canonicalToolSet.has(toolName));
  const outcome = missingTools.length === 0 && extraTools.length === 0 ? "match" : "mismatch";
  const tags = { surface: "disk" };
  mcpDiscoveryFreshnessCheck.increment(ctx, 1, {
    ...tags,
    outcome
  });
  mcpDiscoveryFreshnessMissingTools.histogram(ctx, missingTools.length, tags);
  mcpDiscoveryFreshnessExtraTools.histogram(ctx, extraTools.length, tags);
  mcpDiscoveryFreshnessSymmetricDifference.histogram(ctx, missingTools.length + extraTools.length, tags);
  if (outcome === "mismatch") {
    logger15.warn(ctx, "mcp_disk_discovery_freshness_mismatch", {
      server_identifier: serverIdentifier,
      missing_tool_count: missingTools.length,
      extra_tool_count: extraTools.length
    });
  }
}
async function runDiskMcpDiscoveryFreshness({ ctx, mcpStateAccessor, projectDir, sanitizedServerFolder, readDiskCatalog, state: providedState }) {
  let state = providedState;
  if (state === void 0) {
    try {
      state = await mcpStateAccessor.getState(ctx);
    } catch (err) {
      logger15.warn(ctx, "mcp_disk_state_read_failed", {
        error_type: err instanceof Error ? err.name : typeof err
      });
      return;
    }
  }
  const server = state.servers.find((candidate) => sanitizeServerName(candidate.serverIdentifier) === sanitizedServerFolder);
  if (server === void 0) {
    return;
  }
  let diskResult;
  try {
    diskResult = await readDiskCatalog(projectDir, server.serverIdentifier);
  } catch (err) {
    logger15.warn(ctx, "mcp_disk_catalog_read_failed", {
      error_type: err instanceof Error ? err.name : typeof err
    });
    return;
  }
  if (!diskResult.toolsDirExists) {
    return;
  }
  const canonicalToolNames = server.tools.map((tool) => tool.toolName).filter((toolName) => toolName.length > 0).sort((a, b2) => a.localeCompare(b2));
  emitDiskMcpDiscoveryFreshness({
    ctx,
    serverIdentifier: server.serverIdentifier,
    canonicalToolNames,
    observedToolNames: diskResult.toolNames
  });
}
function scheduleDiskMcpDiscoveryFreshnessOnMcpsPathAccess(ctx, mcpStateAccessor, filePath, readDiskCatalog = readMcpDiskCatalogToolNamesForProjectDir) {
  if (filePath === void 0 || !isMcpDirectoryPath(filePath)) {
    return;
  }
  const parsed = parseMcpsPath(filePath);
  if (parsed === void 0) {
    return;
  }
  let key;
  let serverFolderForRun;
  const isMcpsRoot = parsed.kind === "mcps_root";
  if (parsed.kind === "mcps_root") {
    key = `${parsed.projectDir}\0__mcps_root__`;
    serverFolderForRun = void 0;
  } else {
    key = `${parsed.projectDir}\0${parsed.sanitizedServerFolder}`;
    serverFolderForRun = parsed.sanitizedServerFolder;
  }
  const existing = diskFreshnessDebounceTimers.get(key);
  if (existing !== void 0) {
    clearTimeout(existing);
  }
  const freshnessCtx = ctx;
  const timer2 = setTimeout(() => {
    diskFreshnessDebounceTimers.delete(key);
    const runFreshnessCheck = async () => {
      if (isMcpsRoot) {
        const state = await mcpStateAccessor.getState(freshnessCtx);
        for (const server of state.servers) {
          const folder = sanitizeServerName(server.serverIdentifier);
          await runDiskMcpDiscoveryFreshness({
            ctx: freshnessCtx,
            mcpStateAccessor,
            projectDir: parsed.projectDir,
            sanitizedServerFolder: folder,
            readDiskCatalog,
            state
          });
        }
        return;
      }
      if (serverFolderForRun !== void 0) {
        await runDiskMcpDiscoveryFreshness({
          ctx: freshnessCtx,
          mcpStateAccessor,
          projectDir: parsed.projectDir,
          sanitizedServerFolder: serverFolderForRun,
          readDiskCatalog
        });
      }
    };
    void runFreshnessCheck().catch((err) => {
      logger15.warn(freshnessCtx, "mcp_disk_discovery_freshness_schedule_failed", {
        error_type: err instanceof Error ? err.name : typeof err
      });
    });
  }, DISK_MCPS_FRESHNESS_DEBOUNCE_MS);
  diskFreshnessDebounceTimers.set(key, timer2);
}

