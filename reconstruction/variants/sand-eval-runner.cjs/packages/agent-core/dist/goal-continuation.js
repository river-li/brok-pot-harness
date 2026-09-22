/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-core/dist/goal-continuation.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GOAL_STATUS_ACTIVE = 1;
function goalWorkedMs(goalState) {
  var _a20;
  return Number((_a20 = goalState === null || goalState === void 0 ? void 0 : goalState.activeDurationMs) !== null && _a20 !== void 0 ? _a20 : BigInt(0));
}
function goalElapsedMsFrom(accruedMs, accrualAnchorMs, nowMs) {
  if (accrualAnchorMs === void 0) {
    return accruedMs;
  }
  return accruedMs + Math.max(0, nowMs - accrualAnchorMs);
}
function goalElapsedMs(goalState, nowMs) {
  const anchorMs = goalState === null || goalState === void 0 ? void 0 : goalState.lastAccruedAtMs;
  return goalElapsedMsFrom(goalWorkedMs(goalState), anchorMs === void 0 ? void 0 : Number(anchorMs), nowMs);
}
function goalClockOnActivation(goalState, nowMs) {
  var _a20;
  return {
    activeDurationMs: (_a20 = goalState === null || goalState === void 0 ? void 0 : goalState.activeDurationMs) !== null && _a20 !== void 0 ? _a20 : BigInt(0),
    lastAccruedAtMs: BigInt(nowMs)
  };
}
function goalClockOnDeactivation(goalState, nowMs) {
  return {
    activeDurationMs: BigInt(goalElapsedMs(goalState, nowMs)),
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

