var SandDiskPressureLedgerError = class extends SandDomainError {
  name = "SandDiskPressureLedgerError";
};
function hasErrorCode(error42, code) {
  return isUnknownRecord(error42) && error42.code === code;
}
function createDiskPressureReminderEpisodes(options2) {
  const filePath = options2.rootDir === void 0 ? void 0 : (0, import_node_path110.join)(options2.rootDir, SAND_DISK_PRESSURE_REMINDERS_FILE_NAME);
  let activeEpisodeId = null;
  let restoredEpisodeAwaitingPressure = false;
  let activeEpisodePersistencePending = false;
  const handledAgentIds = /* @__PURE__ */ new Set();
  const pendingEpisodeIds = /* @__PURE__ */ new Map();
  const enqueue = (agentId, episodeId) => {
    const pending = pendingEpisodeIds.get(agentId) ?? [];
    if (pending.includes(episodeId)) return false;
    pendingEpisodeIds.set(agentId, [...pending, episodeId]);
    return true;
  };
  if (filePath !== void 0) {
    try {
      const parsed2 = JSON.parse((0, import_node_fs62.readFileSync)(filePath, "utf8"));
      if (!isUnknownRecord(parsed2) || parsed2.version !== 1) {
        throw new SandDiskPressureLedgerError("invalid disk-pressure reminder ledger");
      }
      activeEpisodeId = typeof parsed2.activeEpisodeId === "string" ? parsed2.activeEpisodeId : null;
      restoredEpisodeAwaitingPressure = activeEpisodeId !== null;
      if (activeEpisodeId !== null && Array.isArray(parsed2.handledAgentIds)) {
        for (const agentId of parsed2.handledAgentIds) {
          if (typeof agentId === "string") handledAgentIds.add(agentId);
        }
      }
      if (Array.isArray(parsed2.pending)) {
        for (const entry of parsed2.pending) {
          if (isUnknownRecord(entry) && typeof entry.agentId === "string" && typeof entry.episodeId === "string") {
            enqueue(entry.agentId, entry.episodeId);
          }
        }
      }
    } catch (error42) {
      if (!hasErrorCode(error42, "ENOENT")) options2.onLedgerError?.(error42);
    }
  }
  const claims = /* @__PURE__ */ new Map();
  const { createEpisodeId } = options2;
  const persist = () => {
    if (filePath === void 0) return true;
    try {
      if (activeEpisodeId === null && pendingEpisodeIds.size === 0) {
        (0, import_node_fs62.rmSync)(filePath, { force: true });
        return true;
      }
      const ledger = {
        version: 1,
        activeEpisodeId,
        handledAgentIds: activeEpisodeId === null ? [] : [...handledAgentIds],
        pending: [...pendingEpisodeIds].flatMap(
          ([agentId, episodeIds]) => episodeIds.map((episodeId) => ({ agentId, episodeId }))
        )
      };
      writeFileAtomicSync(filePath, JSON.stringify(ledger));
      return true;
    } catch (error42) {
      options2.onLedgerError?.(error42);
      return false;
    }
  };
  return {
    claim({ agentId, claimId }) {
      const existing = claims.get(agentId);
      if (existing !== void 0) {
        return existing.claimId === claimId ? existing.episodeId : null;
      }
      if (activeEpisodeId !== null && !handledAgentIds.has(agentId)) {
        if (enqueue(agentId, activeEpisodeId)) persist();
      }
      const episodeId = pendingEpisodeIds.get(agentId)?.[0];
      if (episodeId === void 0) return null;
      claims.set(agentId, { claimId, episodeId });
      return episodeId;
    },
    release({ agentId, claimId }) {
      if (claims.get(agentId)?.claimId === claimId) claims.delete(agentId);
    },
    enroll(agentIds) {
      if (activeEpisodeId === null) return;
      let changed = false;
      for (const agentId of agentIds) {
        if (!handledAgentIds.has(agentId)) {
          changed = enqueue(agentId, activeEpisodeId) || changed;
        }
      }
      if (changed) persist();
    },
    commit({ agentId, claimId }) {
      const claim = claims.get(agentId);
      if (claim?.claimId !== claimId) return false;
      const pending = pendingEpisodeIds.get(agentId);
      if (pending?.[0] !== claim.episodeId) return false;
      const remaining = pending.slice(1);
      if (remaining.length === 0) {
        pendingEpisodeIds.delete(agentId);
      } else {
        pendingEpisodeIds.set(agentId, remaining);
      }
      const alreadyHandled = handledAgentIds.has(agentId);
      if (activeEpisodeId === claim.episodeId) handledAgentIds.add(agentId);
      if (!persist()) {
        pendingEpisodeIds.set(agentId, pending);
        if (!alreadyHandled) handledAgentIds.delete(agentId);
        return false;
      }
      claims.delete(agentId);
      return true;
    },
    forgetAgent(agentId) {
      claims.delete(agentId);
      const removedPending = pendingEpisodeIds.delete(agentId);
      const removedHandled = handledAgentIds.delete(agentId);
      if (removedPending || removedHandled) persist();
    },
    observePressure(level, complete = true) {
      if (level === "healthy") {
        if (activeEpisodeId === null || !complete && restoredEpisodeAwaitingPressure) {
          return;
        }
      } else if (activeEpisodeId !== null) {
        restoredEpisodeAwaitingPressure = false;
        if (activeEpisodePersistencePending && persist()) {
          activeEpisodePersistencePending = false;
        }
        return;
      }
      const previousActiveEpisodeId = activeEpisodeId;
      const previousRestoredEpisodeAwaitingPressure = restoredEpisodeAwaitingPressure;
      const previousHandledAgentIds = [...handledAgentIds];
      activeEpisodeId = level === "healthy" ? null : createEpisodeId();
      restoredEpisodeAwaitingPressure = false;
      handledAgentIds.clear();
      if (persist()) {
        activeEpisodePersistencePending = false;
        return;
      }
      if (level !== "healthy") {
        activeEpisodePersistencePending = true;
        return;
      }
      activeEpisodeId = previousActiveEpisodeId;
      restoredEpisodeAwaitingPressure = previousRestoredEpisodeAwaitingPressure;
      handledAgentIds.clear();
      for (const agentId of previousHandledAgentIds) {
        handledAgentIds.add(agentId);
      }
    }
  };
}
function startDiskPressureWatch(deps) {
  const listeners2 = /* @__PURE__ */ new Set();
  let level = null;
  let guard;
  let polling;
  const reminderEpisodes = createDiskPressureReminderEpisodes({
    rootDir: deps.isInBox ? getSandRootDir() : void 0,
    createEpisodeId: () => (0, import_node_crypto49.randomUUID)(),
    onLedgerError: (error42) => deps.log(`disk-pressure reminder ledger failed: ${errorLogTag(error42)}`)
  });
  if (deps.isInBox) {
    guard = createDiskPressureGuard({
      readVolumes: () => readDiskVolumeSnapshots([
        { volume: "workspace", path: "/workspace" },
        { volume: "sand_data", path: getSandRootDir() },
        { volume: "temp", path: "/tmp" }
      ]),
      report: deps.report,
      onPressureChange: (next) => {
        level = next;
        for (const listener of [...listeners2]) listener(next);
      },
      onSuccessfulSample: (next, complete) => reminderEpisodes.observePressure(next, complete),
      log: deps.log
    });
    polling = deps.polling.start(async () => {
      guard?.onTick();
    });
  }
  return {
    get level() {
      return level;
    },
    reminderEpisodes,
    subscribe(listener) {
      listeners2.add(listener);
      return () => listeners2.delete(listener);
    },
    dispose() {
      polling?.dispose();
      polling = void 0;
      guard?.dispose();
      guard = void 0;
      listeners2.clear();
    }
  };
}
