/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/agent-identity/identity-backfill.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises25 = require("node:fs/promises");
var import_node_path34 = require("node:path");
init_dist3();
init_system_errno();
init_unknown_record();
var SENTINEL_VERSION = 3;
function parseRefusalReason(value) {
  return value === "tombstoned" || value === "already_taken" ? value : void 0;
}
async function readIdentityBackfillState(path31) {
  let raw;
  try {
    raw = (await (0, import_promises25.readFile)(path31)).toString();
  } catch (error42) {
    if (findSystemErrno(error42) === "ENOENT") return void 0;
    throw error42;
  }
  const parsed2 = attemptSync(() => JSON.parse(raw));
  if (!parsed2.ok || !isUnknownRecord(parsed2.value)) return void 0;
  if (parsed2.value.version !== SENTINEL_VERSION || !isUnknownRecord(parsed2.value.refused) || parsed2.value.sweptAt !== void 0 && typeof parsed2.value.sweptAt !== "string") {
    return void 0;
  }
  const refused2 = /* @__PURE__ */ new Map();
  for (const [agentId, value] of Object.entries(parsed2.value.refused)) {
    const reason = parseRefusalReason(value);
    if (reason === void 0) return void 0;
    refused2.set(agentId, reason);
  }
  return {
    sweptAt: parsed2.value.sweptAt,
    refused: refused2
  };
}
async function writeIdentityBackfillState(path31, state) {
  await writeFileAtomic(
    path31,
    JSON.stringify({
      version: SENTINEL_VERSION,
      ...state.sweptAt === void 0 ? {} : { sweptAt: state.sweptAt },
      refused: Object.fromEntries(state.refused)
    })
  );
}
var IDENTITY_BACKFILL_RESWEEP_AFTER_MS = 24 * 60 * 60 * 1e3;
async function requestIdentityResweep(path31) {
  const state = await readIdentityBackfillState(path31);
  if (state?.sweptAt === void 0) return;
  await writeIdentityBackfillState(path31, { sweptAt: void 0, refused: state.refused });
}
async function hasSweptWithin(path31, maxAgeMs, now = Date.now()) {
  const sweptAt = (await readIdentityBackfillState(path31))?.sweptAt;
  if (sweptAt === void 0) return false;
  const sweptAtMs = Date.parse(sweptAt);
  return Number.isFinite(sweptAtMs) && now - sweptAtMs < maxAgeMs;
}
function recencyMs(summary) {
  return summary.lastActivityAt || summary.updatedAt;
}
function isIdentityBackfillCandidate(summary) {
  return summary.origin === "user" && summary.purpose == null && isLocalBotAgent(summary);
}
function selectIdentityBackfillOrder(summaries) {
  return summaries.filter(isIdentityBackfillCandidate).sort((a, b2) => recencyMs(b2) - recencyMs(a) || a.id.localeCompare(b2.id)).map((summary) => summary.id);
}
function countUnstampedCandidates(root, candidates, refused2) {
  let mintable = 0;
  let refusedCount = 0;
  for (const agentId of candidates) {
    const profilePath = getSandProfilePath((0, import_node_path34.join)(root, agentId));
    if (readSandProfileServerId(profilePath) !== null) continue;
    if (refused2.has(agentId)) refusedCount += 1;
    else if (readSandProfileFile(profilePath) !== null) mintable += 1;
  }
  return { mintable, refused: refusedCount };
}
async function getHarnessMigrationIdentityCoverage(deps) {
  if (!await deps.isWriteEnabled()) return "pending";
  const summaries = await deps.listAgents();
  const state = await readIdentityBackfillState(deps.sentinelPath);
  const unstamped = countUnstampedCandidates(
    deps.getAgentsRootDir(),
    selectIdentityBackfillOrder(summaries),
    state?.refused ?? /* @__PURE__ */ new Map()
  );
  if (unstamped.refused > 0) return "blocked";
  return unstamped.mintable > 0 ? "pending" : "complete";
}
var MAX_CONSECUTIVE_FAILURES_BEFORE_BLAMING_THE_BOX = 3;
async function runIdentityBackfill(deps) {
  const startedAt = performance.now();
  const root = deps.getAgentsRootDir();
  let summaries;
  try {
    summaries = await deps.listAgents();
  } catch (error42) {
    deps.report("warn", { op: "backfill_sweep", outcome: "roster_failed" });
    throw error42;
  }
  let minted = 0;
  let skipped2 = 0;
  let refused2 = 0;
  let failed2 = 0;
  let stopped2;
  let consecutiveFailures = 0;
  const previousState = await readIdentityBackfillState(deps.sentinelPath);
  const refusedAgents = new Map(previousState?.refused ?? []);
  const candidates = selectIdentityBackfillOrder(summaries);
  const candidateIds = new Set(candidates);
  let refusalStateChanged = false;
  for (const agentId of refusedAgents.keys()) {
    if (!candidateIds.has(agentId)) {
      refusedAgents.delete(agentId);
      refusalStateChanged = true;
    }
  }
  if (refusalStateChanged) {
    await writeIdentityBackfillState(deps.sentinelPath, {
      sweptAt: void 0,
      refused: refusedAgents
    });
  } else if (previousState?.sweptAt !== void 0 && countUnstampedCandidates(root, candidates, refusedAgents).mintable === 0) {
    return "already_swept";
  }
  try {
    for (const agentId of candidates) {
      if (deps.isHostStopping()) {
        stopped2 = "host_stopping";
        break;
      }
      if (readSandProfileServerId(getSandProfilePath((0, import_node_path34.join)(root, agentId))) !== null) {
        if (refusedAgents.delete(agentId)) refusalStateChanged = true;
        skipped2 += 1;
        continue;
      }
      if (refusedAgents.has(agentId)) {
        refused2 += 1;
        continue;
      }
      const outcome = await deps.mintAgent(agentId);
      if (outcome === "writes_off") {
        stopped2 = outcome;
        break;
      }
      if (outcome === "error" || outcome === "unparseable") failed2 += 1;
      else if (outcome === "minted") minted += 1;
      else if (outcome === "tombstoned" || outcome === "already_taken") {
        if (deps.isMintPending?.(agentId) === true || readSandProfileServerId(getSandProfilePath((0, import_node_path34.join)(root, agentId))) !== null) {
          skipped2 += 1;
        } else {
          refused2 += 1;
          refusedAgents.set(agentId, outcome);
          refusalStateChanged = true;
          await writeIdentityBackfillState(deps.sentinelPath, {
            sweptAt: void 0,
            refused: refusedAgents
          });
        }
      } else skipped2 += 1;
      consecutiveFailures = outcome === "error" ? consecutiveFailures + 1 : 0;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES_BEFORE_BLAMING_THE_BOX) {
        stopped2 = "failing";
        break;
      }
    }
    if (stopped2 === void 0 && failed2 === 0) {
      await writeIdentityBackfillState(deps.sentinelPath, {
        sweptAt: (/* @__PURE__ */ new Date()).toISOString(),
        refused: refusedAgents
      });
    } else if (refusalStateChanged) {
      await writeIdentityBackfillState(deps.sentinelPath, {
        sweptAt: void 0,
        refused: refusedAgents
      });
    }
  } catch (error42) {
    stopped2 = "aborted";
    throw error42;
  } finally {
    deps.report(stopped2 === void 0 && failed2 === 0 ? "info" : "warn", {
      op: "backfill_sweep",
      outcome: stopped2 ?? (failed2 > 0 ? "partial" : "ok"),
      minted: String(minted),
      skipped: String(skipped2),
      refused: String(refused2),
      failed: String(failed2),
      duration_ms: String(Math.round(performance.now() - startedAt))
    });
  }
  return { minted, skipped: skipped2, refused: refused2, failed: failed2, stopped: stopped2 };
}

