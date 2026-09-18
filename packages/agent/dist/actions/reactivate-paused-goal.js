init_goal_tool_pb();
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
