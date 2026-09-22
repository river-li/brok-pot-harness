/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/multitask-action-prompt.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_agent_pb();
function synthesizeMultitaskActionPrompt(simulatedMsgReason, { taskToolName, resolvedMode } = {}) {
  if (simulatedMsgReason === SimulatedMsgReason.MULTITASK) {
    const subagentToolText = taskToolName !== void 0 ? `using the ${taskToolName} tool` : "using your subagent tool";
    return `<system_reminder>
The user clicked Start Multitasking.

Create exactly one async subagent forked from yourself ${subagentToolText} with run_in_background set to true and resume set to "self". Use the prompt "You are the forked subagent; continue executing your task."

NOTE: If you receive the exact prompt "You are the forked subagent; continue executing your task.", then continue executing your task. Do NOT fork yourself again.

Otherwise, if you do not receive that prompt, immediately stop. Do not continue planning or coordinating, do not perform additional foreground work, and do not send a user-visible response after forking yourself into that subagent.
</system_reminder>`;
  }
  if (simulatedMsgReason === SimulatedMsgReason.BUILD_IN_PARALLEL) {
    const isMultitaskTurn = resolvedMode === void 0 || resolvedMode === AgentMode.MULTITASK;
    const modeStatement = isMultitaskTurn ? "By clicking Build in Parallel, the user has entered **Multitask Mode** and has expressed a desire for parallel execution." : "By clicking Build in Parallel, the user has expressed a desire for parallel execution.";
    const followUpStatement = isMultitaskTurn ? "For the plan execution and all follow-ups until the user exits multitask mode, follow your multitask mode instructions." : "These parallelization instructions apply for the plan execution and its follow-ups.";
    return `<system_reminder>
The user clicked Build in Parallel.

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.
Todos from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the todos.

<build_with_multitask_instructions>
${modeStatement}

Rules for multitask plan execution:

When starting subagent(s) for plan execution, DO NOT repeat the plan in your prompt to the subagents. Just reference the plan file in your prompt, specify which steps of the plan the agent should execute, and include any required context which is not self-evident from the plan file.

For each Todo in your plan, decide which other Todos must be completed first. Then, flatten the dependency chains into one or more build phases. Execute each build phase as its own asynchronous (top-level) subagent. Whenever possible, execute independent build phases in parallel. If later Todos can be parallelized after the completion of earlier Todo(s), execute the blocking steps as an initial build phase, then launch parallel build phases after it completes.

IMPORTANT: If your plan includes dedicated testing steps at the end AND you are parallelizing across multiple implementation agents, instruct earlier subagents to not conduct end-to-end testing and use later testing subagents to test the full implementation. On the other hand, if just one agent is implementing, that agent should also do the testing.

${followUpStatement} For the extent of plan execution, these parallelization instructions take precedence over any other instructions about avoiding top-level sibling subagent parallelization.
</build_with_multitask_instructions>
</system_reminder>`;
  }
  return void 0;
}

