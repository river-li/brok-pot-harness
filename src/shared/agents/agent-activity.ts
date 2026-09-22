/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/agent-activity.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function areAwaitingStatesEqual(left, right) {
  if (left === right) return true;
  if (left == null || right == null) return false;
  return left.tabId === right.tabId && left.reason === right.reason && left.since === right.since;
}
function areBoxHandoffsEqual(left, right) {
  if (left === right) return true;
  if (left == null || right == null) return false;
  return left.requestId === right.requestId && left.instruction === right.instruction;
}
function liveOverlayRunningTurn(live) {
  return live.isRunningTurn ?? live.isRunning;
}
function withoutBoxAwaitingForTemporal(summary) {
  if (summary.harness !== "temporal" || summary.awaitingUserResponse === null) return summary;
  return { ...summary, awaitingUserResponse: null };
}
function liveOverlaidSummaryOf(summary, live) {
  const isRunningTurn = liveOverlayRunningTurn(live);
  if (summary.isRunning === live.isRunning && (summary.isRunningTurn ?? false) === isRunningTurn && summary.isComposingMessage === live.isComposingMessage && (summary.isRetrying ?? false) === live.isRetrying && areAgentActivitiesEqual(summary.currentActivity, live.currentActivity) && areAwaitingStatesEqual(summary.awaitingUserResponse, live.awaitingUserResponse) && areBoxHandoffsEqual(summary.boxHandoff ?? null, live.boxHandoff ?? null) && areSessionIdListsEqual(summary.runningSessionIds, live.runningSessionIds) && summary.activeGroupMemberId === live.activeGroupMemberId && areGroupTurnListsEqual(summary.groupTurns, live.groupTurns)) {
    return summary;
  }
  const {
    currentActivity: _replaced,
    runningSessionIds: _replacedSessions,
    activeGroupMemberId: _member,
    groupTurns: _replacedGroupTurns,
    ...rest
  } = summary;
  return {
    ...rest,
    isRunning: live.isRunning,
    isRunningTurn,
    isComposingMessage: live.isComposingMessage,
    isRetrying: live.isRetrying,
    ...live.currentActivity === void 0 ? {} : { currentActivity: live.currentActivity },
    ...live.runningSessionIds === void 0 ? {} : { runningSessionIds: live.runningSessionIds },
    awaitingUserResponse: live.awaitingUserResponse,
    boxHandoff: live.boxHandoff ?? null,
    ...live.activeGroupMemberId === void 0 ? {} : { activeGroupMemberId: live.activeGroupMemberId },
    ...live.groupTurns === void 0 ? {} : { groupTurns: live.groupTurns }
  };
}
function areGroupTurnListsEqual(left, right) {
  if (left === right) return true;
  if (left === void 0 || right === void 0) return false;
  return left.length === right.length && left.every((turn, index) => {
    const other = right[index];
    return other !== void 0 && turn.roomId === other.roomId && turn.isComposingMessage === other.isComposingMessage && areAgentActivitiesEqual(turn.currentActivity, other.currentActivity);
  });
}
function areSessionIdListsEqual(left, right) {
  if (left === right) return true;
  if (left === void 0 || right === void 0) return false;
  return left.length === right.length && left.every((id, index) => id === right[index]);
}
function clientOverlaidSummaryOf(summary, client) {
  if (summary.hasUnread === client.hasUnread && (summary.unreadCount ?? 0) === client.unreadCount && (client.lastViewedAt === void 0 || summary.lastViewedAt === client.lastViewedAt) && (client.lastActivityAt === void 0 || summary.lastActivityAt === client.lastActivityAt && summary.updatedAt >= client.lastActivityAt) && (client.newestEntryId === void 0 || summary.newestEntryId === client.newestEntryId) && (client.lastMessageId === void 0 || summary.lastMessageId === client.lastMessageId) && (client.lastMessagePreview === void 0 || summary.lastMessagePreview === client.lastMessagePreview) && (client.isHiddenFromSidebar === void 0 || (summary.isHiddenFromSidebar ?? false) === client.isHiddenFromSidebar)) {
    return summary;
  }
  return {
    ...summary,
    hasUnread: client.hasUnread,
    unreadCount: client.unreadCount,
    ...client.isHiddenFromSidebar === void 0 ? {} : { isHiddenFromSidebar: client.isHiddenFromSidebar },
    ...client.lastViewedAt === void 0 ? {} : { lastViewedAt: client.lastViewedAt },
    ...client.lastActivityAt === void 0 ? {} : {
      lastActivityAt: client.lastActivityAt,
      updatedAt: Math.max(summary.updatedAt, client.lastActivityAt)
    },
    ...client.newestEntryId === void 0 ? {} : { newestEntryId: client.newestEntryId },
    ...client.lastMessageId === void 0 ? {} : { lastMessageId: client.lastMessageId },
    ...client.lastMessagePreview === void 0 ? {} : {
      lastMessagePreview: client.lastMessagePreview,
      lastEntry: { kind: "text", text: client.lastMessagePreview }
    }
  };
}
function overlaidAgentSummaryOf(summary, overlay2) {
  let next = summary;
  if (overlay2.live != null) next = liveOverlaidSummaryOf(next, overlay2.live);
  if (overlay2.client != null) next = clientOverlaidSummaryOf(next, overlay2.client);
  return next;
}

