/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/pending-card-sweeps.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function expirePendingCardEntries(kind, db, options2) {
  const expiredRequestIds = [];
  const onlyRequestId = options2?.onlyRequestId;
  const ifPendingBeforeMs = options2?.ifPendingBeforeMs;
  const unlessRequestId = options2?.unlessRequestId;
  const status = options2?.status ?? kind.sweepDefaultStatus;
  for (const entry of db.getTranscriptEntries()) {
    if (entry.kind !== "send-message") continue;
    const pending = kind.pendingOf(entry.message);
    if (pending == null) continue;
    if (ifPendingBeforeMs != null && entry.timestampMs != null && entry.timestampMs >= ifPendingBeforeMs) {
      continue;
    }
    const requestId2 = kind.requestIdOf(pending);
    if (unlessRequestId?.(requestId2) === true) continue;
    const settled = settlePendingCardEntry(kind, entry, status, onlyRequestId ?? requestId2);
    if (settled == null) continue;
    db.updateTranscriptEntry(entry.id, () => settled);
    expiredRequestIds.push(requestId2);
  }
  return expiredRequestIds;
}
function expirePendingAutoReviewApprovalEntries(db, onlyRequestId) {
  return expirePendingCardEntries(SAND_AUTO_REVIEW_APPROVAL_CARD, db, { onlyRequestId });
}
function expirePendingLocalToolPermissionAskEntries(db, options2) {
  return expirePendingCardEntries(SAND_LOCAL_TOOL_PERMISSION_ASK_CARD, db, options2);
}
function expirePendingCookieOriginApprovalEntries(db, options2) {
  return expirePendingCardEntries(SAND_COOKIE_ORIGIN_APPROVAL_CARD, db, options2);
}
function expirePendingVirtualCardApprovalEntries(db, options2) {
  return expirePendingCardEntries(SAND_VIRTUAL_CARD_APPROVAL_CARD, db, options2);
}
function settleVirtualCardApprovalEntry(db, args) {
  for (const entry of db.getTranscriptEntries()) {
    const retired = settlePendingVirtualCardApprovalEntry(entry, args.status, args.requestId, {
      ...args.spendRequestId === void 0 ? {} : { spendRequestId: args.spendRequestId },
      ...args.failureReason === void 0 ? {} : { failureReason: args.failureReason }
    });
    if (retired == null) continue;
    const settled = args.wakeOutcomeUnseen === true && retired.kind === "send-message" ? { ...retired, wakeOutcomeUnseen: true } : retired;
    db.updateTranscriptEntry(entry.id, () => settled);
    return settled;
  }
  return null;
}

