/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/goals/goals.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_goal_tool_pb();
init_zod();
var GOAL_STATUSES = ["active", "complete"];
var goalStatusByName = {
  active: GoalStatus.ACTIVE,
  complete: GoalStatus.COMPLETE
};
var goalStatusNameByValue = new Map(GOAL_STATUSES.map((status) => [goalStatusByName[status], status]));
var createGoalSchema = external_exports.object({
  objective: external_exports.string().trim().min(1)
});
var updateGoalSchema = external_exports.object({
  status: external_exports.enum(GOAL_STATUSES)
});

