/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/reactivate-paused-goal.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
async function reactivatePausedGoalForTurn(ctx, stateHandler, onStateUpdate) {
  const current = stateHandler.goalState;
  if (current === void 0 || current.status !== GoalStatus.PAUSED) {
    return;
  }
  const resumed = current.clone();
  resumed.status = GoalStatus.ACTIVE;
  resumed.idleContinuationsWithoutToolCalls = 0;
  Object.assign(resumed, goalClockOnActivation(resumed, Date.now()));
  stateHandler.setGoalState(resumed);
  await onStateUpdate(ctx, await stateHandler.computeNewStructure(ctx));
}

