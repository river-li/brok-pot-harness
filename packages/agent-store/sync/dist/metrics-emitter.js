var NOOP_METRICS_EMITTER = Object.freeze({
  onDiskFull() {
  },
  onSymlinkRefused() {
  },
  onNetworkError() {
  },
  onThrottled() {
  },
  onMintGateStateChanged() {
  },
  onRoundCompleted() {
  },
  onRoundLifecycle() {
  },
  onLockEvent() {
  },
  onResumeDetected() {
  },
  onDirtyPassiveStalled() {
  },
  onError() {
  },
  onConflict() {
  },
  recordMountOutcome() {
  },
  recordWriteBarrier() {
  },
  recordCitationStarted() {
  },
  recordCitationResolution() {
  },
  recordCitationStaleness() {
  },
  tokenMinted() {
  },
  tokenRefreshUnauthorized() {
  },
  tokenMintNegativeCached() {
  },
  tokenMintFailureCached() {
  },
  tokenMintRetried() {
  },
  tokenMintRetryDenied() {
  },
  tokenRefreshFailedKeptExisting() {
  }
});
function buildRoundCompletedEvent({ agentId, summary }) {
  var _a19, _b2, _c2, _d, _e2, _f, _g, _h, _j, _k;
  return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ agentId, durationMs: summary.durationMs, filesPushed: summary.filesPushed, filesPulled: summary.filesPulled, filesSkipped: summary.filesSkipped, bytesPushed: summary.bytesPushed, bytesPulled: summary.bytesPulled, refusals: summary.refusals, filesConflicted: summary.filesConflicted, identicalContentConflictsSuppressed: (_a19 = summary.identicalContentConflictsSuppressed) !== null && _a19 !== void 0 ? _a19 : 0, conflictProtectionDowngrades: summary.conflictProtectionDowngrades, legacyProbes: summary.legacyProbes, pushEntriesParked: summary.pushEntriesParked, pullsDeferred: summary.pullsDeferred, pullsSkippedPendingDelete: summary.pullsSkippedPendingDelete, filesDeletedRemote: summary.filesDeletedRemote, filesDeletedLocal: summary.filesDeletedLocal }, summary.tombstonesReceived !== void 0 ? { tombstonesReceived: summary.tombstonesReceived } : {}), summary.tombstoneCursorAdvancedMs !== void 0 ? { tombstoneCursorAdvancedMs: summary.tombstoneCursorAdvancedMs } : {}), summary.absenceDeletesApplied !== void 0 ? { absenceDeletesApplied: summary.absenceDeletesApplied } : {}), summary.absenceDeletesSkippedModified !== void 0 ? { absenceDeletesSkippedModified: summary.absenceDeletesSkippedModified } : {}), { deleteConflicts: summary.deleteConflicts, scanDeletesJournaled: summary.scanDeletesJournaled, rmdirPushed: (_b2 = summary.rmdirPushed) !== null && _b2 !== void 0 ? _b2 : 0, removedDirsApplied: (_c2 = summary.removedDirsApplied) !== null && _c2 !== void 0 ? _c2 : 0, recoveryDisarms: summary.recoveryDisarms, identityRecoveryWipeFailed: summary.identityRecoveryWipeFailed, legacyRowsRestored: summary.legacyRowsRestored, listingComplete: summary.listingComplete, errorCount: summary.errors.length, failed: summary.errors.length > 0, walkMs: (_d = summary.walkMs) !== null && _d !== void 0 ? _d : 0, hashMs: (_e2 = summary.hashMs) !== null && _e2 !== void 0 ? _e2 : 0, presignMs: (_f = summary.presignMs) !== null && _f !== void 0 ? _f : 0, uploadMs: (_g = summary.uploadMs) !== null && _g !== void 0 ? _g : 0, listMs: (_h = summary.listMs) !== null && _h !== void 0 ? _h : 0, downloadMs: (_j = summary.downloadMs) !== null && _j !== void 0 ? _j : 0, scope: (_k = summary.scope) !== null && _k !== void 0 ? _k : "full" });
}
