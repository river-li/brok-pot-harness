var import_promises55 = require("node:fs/promises");
var import_node_path111 = require("node:path");
init_dist();
init_errors();
async function readLocalHostVersion(versionPath = SAND_BOX_HOST_VERSION_PATH) {
  try {
    const raw = (await (0, import_promises55.readFile)(versionPath, "utf8")).trim();
    return raw.length > 0 ? raw : null;
  } catch (error41) {
    reportFallbackUnlessAbsent("host_bundle_upgrade", error41);
    return null;
  }
}
async function stageHostBundleUpgrade(args) {
  const dir = args.dir ?? SAND_SUPERVISOR_DIR;
  const stagedBundlePath = args.stagedBundlePath ?? SAND_SUPERVISOR_STAGED_BUNDLE_PATH;
  const commandPath = args.commandPath ?? SAND_SUPERVISOR_COMMAND_PATH;
  const command = buildSandSupervisorCommand({
    id: `upgrade-${args.version}`,
    kind: "upgrade",
    nowMs: args.nowMs ?? Date.now(),
    mode: "bundle",
    version: args.version,
    bundlePath: stagedBundlePath,
    sha256: args.sha256,
    reason: args.reason,
    forceNow: args.forceNow
  });
  await (0, import_promises55.mkdir)(dir, { recursive: true });
  await writeFileAtomic(stagedBundlePath, args.bytes);
  await writeFileAtomic(commandPath, serializeSandSupervisorCommand(command));
  return command;
}
async function fetchStageAndReportHostBundle(deps) {
  const { source, fromVersion, trigger: trigger2, state } = deps;
  let phase = "fetch";
  try {
    const bundle = await source.loadBundle();
    phase = "stage";
    await deps.stage(bundle);
    state.stagedVersion = source.version;
    state.lastFailedVersion = void 0;
    deps.log?.(
      "info",
      `host bundle update (${trigger2}): staged ${source.version}; supervisor swaps when idle`
    );
    return { ok: true };
  } catch (error41) {
    deps.log?.(
      "warn",
      `host bundle update (${trigger2}): ${phase} failed (box unchanged): ${errorLogTag(error41)}`
    );
    if (state.lastFailedVersion !== source.version) {
      state.lastFailedVersion = source.version;
      deps.reportUpgrade({
        outcome: "failed",
        phase,
        mode: "bundle",
        trigger: trigger2,
        from_version: fromVersion ?? void 0,
        to_version: source.version,
        error_class: error41 instanceof Error ? error41.constructor.name : "unknown"
      });
    }
    return { ok: false, error: error41, phase };
  }
}
var MAX_FAILED_SWAP_RESTAGE_RETRIES = 2;
var POST_SWAP_CRASH_LOOP_ERROR_CLASS = "post-swap-crash-loop";
function hostUpgradeAckFilename(id) {
  return id.replace(/[^a-zA-Z0-9_.-]/g, "_");
}
async function isHostVersionSwapVetoed(args) {
  const { version: version3, localVersion } = args;
  const acksDir = args.acksDir ?? SAND_SUPERVISOR_ACKS_DIR;
  if (version3.length === 0 || localVersion === version3) return false;
  const ackName = hostUpgradeAckFilename(`upgrade-${version3}`);
  try {
    await (0, import_promises55.access)((0, import_node_path111.join)(acksDir, ackName));
    return true;
  } catch (error41) {
    reportFallbackUnlessAbsent("host_bundle_upgrade", error41);
    return false;
  }
}
function noteFailedSwapMarkerForRetry(state, marker17, maxRetries = MAX_FAILED_SWAP_RESTAGE_RETRIES) {
  if (marker17.outcome !== "failed" || marker17.mode !== "bundle") return false;
  const toVersion = marker17.toVersion;
  if (toVersion == null || toVersion.length === 0) return false;
  if (marker17.swapError === POST_SWAP_CRASH_LOOP_ERROR_CLASS) return false;
  if (state.stagedVersion !== toVersion) return false;
  const attempts2 = state.swapRetryAttempts.get(toVersion) ?? 0;
  if (attempts2 >= maxRetries) return false;
  state.swapRetryAttempts.set(toVersion, attempts2 + 1);
  state.stagedVersion = null;
  return true;
}
function describeHostBundleErrorNode(err, seen) {
  const code = err.code;
  const codeSuffix = typeof code === "string" && code.length > 0 && !err.message.includes(code) ? ` (${code})` : "";
  let node = `${err.name}: ${err.message}${codeSuffix}`;
  const aggregate = err.errors;
  if (Array.isArray(aggregate) && aggregate.length > 0) {
    const inner = aggregate.filter((sub) => !seen.has(sub)).map((sub) => {
      if (sub instanceof Error) {
        seen.add(sub);
        return describeHostBundleErrorNode(sub, seen);
      }
      return String(sub);
    }).join("; ");
    if (inner.length > 0) node += ` [${inner}]`;
  }
  return node;
}
function describeHostBundleErrorDetail(error41, phase) {
  const parts = [];
  const seen = /* @__PURE__ */ new Set();
  let current = error41;
  while (current != null && !seen.has(current)) {
    seen.add(current);
    if (current instanceof Error) {
      parts.push(describeHostBundleErrorNode(current, seen));
      current = current.cause;
    } else {
      parts.push(String(current));
      break;
    }
  }
  const chain = parts.length > 0 ? parts.join(" \u2192 ") : String(error41);
  return phase != null ? `@phase:${phase} ${chain}` : chain;
}
var HOST_BUNDLE_WATCH_INTERVAL_MS = 24 * 60 * 6e4;
var HOST_BUNDLE_WATCH_JITTER_RATIO = 0.5;
var HOST_BUNDLE_WATCH_MIN_CONFIGURED_INTERVAL_MS = 10 * 6e4;
var HOST_BUNDLE_WATCH_MAX_CONFIGURED_INTERVAL_MS = 7 * 24 * 60 * 6e4;
function resolveHostBundleWatchIntervalMs(liveConfiguredMs, singleBoxDevOverride) {
  const singleBoxDevOverrideMs = Number.parseInt(singleBoxDevOverride ?? "", 10);
  if (Number.isInteger(singleBoxDevOverrideMs) && singleBoxDevOverrideMs > 0) {
    return singleBoxDevOverrideMs;
  }
  if (typeof liveConfiguredMs === "number" && Number.isFinite(liveConfiguredMs) && liveConfiguredMs > 0) {
    return Math.min(
      HOST_BUNDLE_WATCH_MAX_CONFIGURED_INTERVAL_MS,
      Math.max(HOST_BUNDLE_WATCH_MIN_CONFIGURED_INTERVAL_MS, Math.round(liveConfiguredMs))
    );
  }
  return HOST_BUNDLE_WATCH_INTERVAL_MS;
}
function clampWatchValue(value, lo2, hi2) {
  if (!Number.isFinite(value)) return lo2;
  return Math.min(hi2, Math.max(lo2, value));
}
function hostBundleWatchInitialDelayMs(baseMs, jitterRatio2, random = Math.random) {
  if (!(baseMs > 0) || !(jitterRatio2 > 0)) return 0;
  return Math.round(clampWatchValue(random(), 0, 1) * baseMs);
}
function hostBundleWatchNextDelayMs(baseMs, jitterRatio2, random = Math.random) {
  const base = baseMs > 0 ? baseMs : 0;
  const ratio = clampWatchValue(jitterRatio2, 0, 1);
  if (ratio === 0) return base;
  const delta = (clampWatchValue(random(), 0, 1) * 2 - 1) * base * ratio;
  return Math.max(0, Math.round(base + delta));
}
