var GOAL_STATUS_ACTIVE = 1;
function goalWorkedMs(goalState) {
  var _a19;
  return Number((_a19 = goalState === null || goalState === void 0 ? void 0 : goalState.activeDurationMs) !== null && _a19 !== void 0 ? _a19 : BigInt(0));
}
function goalElapsedMsFrom(accruedMs, accrualAnchorMs, nowMs2) {
  if (accrualAnchorMs === void 0) {
    return accruedMs;
  }
  return accruedMs + Math.max(0, nowMs2 - accrualAnchorMs);
}
function goalElapsedMs(goalState, nowMs2) {
  const anchorMs = goalState === null || goalState === void 0 ? void 0 : goalState.lastAccruedAtMs;
  return goalElapsedMsFrom(goalWorkedMs(goalState), anchorMs === void 0 ? void 0 : Number(anchorMs), nowMs2);
}
function goalClockOnActivation(goalState, nowMs2) {
  var _a19;
  return {
    activeDurationMs: (_a19 = goalState === null || goalState === void 0 ? void 0 : goalState.activeDurationMs) !== null && _a19 !== void 0 ? _a19 : BigInt(0),
    lastAccruedAtMs: BigInt(nowMs2)
  };
}
function goalClockOnDeactivation(goalState, nowMs2) {
  return {
    activeDurationMs: BigInt(goalElapsedMs(goalState, nowMs2)),
    lastAccruedAtMs: void 0
  };
}
var GOAL_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isGoalStateShapeValid(goalState, identity) {
  return goalState !== void 0 && isGoalIdentityValid(goalState, identity) && goalState.status === GOAL_STATUS_ACTIVE && GOAL_ID_PATTERN.test(goalState.goalId);
}
function isGoalIdentityValid(goalState, identity) {
  return goalState.agentSessionId === void 0 ? goalState.conversationId === identity.conversationId : isGoalOwnerValid(goalState, identity.agentSessionId);
}
function isGoalOwnerValid(goalState, agentSessionId) {
  if (goalState.agentSessionId === void 0) {
    return true;
  }
  return goalState.agentSessionId.length > 0 && agentSessionId !== void 0 && agentSessionId.length > 0 && goalState.agentSessionId === agentSessionId;
}
