init_subagents_pb();
var EXECUTOR_SUBAGENT_TYPE = "executor";
var EXECUTOR_PROFILE_NAME_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/;
function createSandExecutorProfileModels(config2) {
  const models = Object.fromEntries(
    config2.profiles.map((profile) => [profile.name, { slug: profile.name }])
  );
  const lines2 = config2.profiles.map(
    (profile) => `- ${profile.name}${profile.name === config2.current ? " (default)" : ""}: ${profile.description}`
  );
  return createSubagentModels(
    models,
    void 0,
    [
      "Executor effort levels:",
      ...lines2,
      "",
      "Use these only with the executor subagent type. Omit `model` to inherit the current default. For every other subagent type, omit `model`; an effort value there is ignored."
    ].join("\n")
  );
}
function resolveSandSubagentModelId(args) {
  if (args.modelId == null || args.modelId.length === 0) return void 0;
  if (args.subagentType === EXECUTOR_SUBAGENT_TYPE) {
    return EXECUTOR_PROFILE_NAME_PATTERN.test(args.modelId) && args.executorProfileNames.has(args.modelId) ? args.modelId : void 0;
  }
  if (args.executorProfileNames.has(args.modelId)) return void 0;
  if (args.acceptsExplicitModel) {
    return args.modelId;
  }
  return void 0;
}
function executorSubagentDescription(conservativeExecutorReuse) {
  return [
    "Your workhorse: a background subagent with your full work toolset (Shell, box tools, web, MCP tools, CloudAgent) that executes one stream of work while you stay available to the user.",
    conservativeExecutorReuse ? "Reuse or resume an idle executor for new work in the same workstream. Typically you'll use one or two active executors; four is a soft maximum unless the user is explicitly multitasking or requests parallel threads." : "Give each independent task its own executor \u2014 several run in parallel. Keep exactly one executor per stream of work: steer a follow-up or correction into the running one with MessageSubagent instead of dispatching a duplicate.",
    "It starts with no context: the dispatch prompt must be self-contained \u2014 the goal, the specifics, relevant conversation context, any of your memories or user preferences that matter, explicit success criteria, and what to report back.",
    "It runs in the background like any Task: you are notified when it finishes, so do not poll or await it.",
    "It runs headless and cannot talk to the user; it reports its result back to you, and you deliver it."
  ].join(" ");
}
function createSandExecutorSubagentConfig(conservativeExecutorReuse = false) {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: EXECUTOR_SUBAGENT_TYPE })
      }
    }),
    description: executorSubagentDescription(conservativeExecutorReuse),
    preserveTaskTool: false,
    subagentSource: "builtin"
  };
}
function createSandMultitaskTodoTool(resourceAccessor, stateHandler) {
  return {
    ...createUpdateTodosTool(resourceAccessor, stateHandler),
    descriptionGenerator: () => SAND_MULTITASK_TODO_DESCRIPTION
  };
}
var SAND_MULTITASK_TODO_DESCRIPTION = [
  "Your task queue: the durable list of everything the user has asked for, across all your parallel streams of work.",
  "",
  "When to use:",
  "- The moment a request arrives, record it as a todo before dispatching or starting it.",
  "- Update statuses in real time: in_progress when its work starts, completed the moment its result is delivered to the user, cancelled when the user drops it or changes their mind.",
  "- On every wake (a user message or a finished background task), reconcile the list first: what's running, what landed, what to dispatch next.",
  "",
  "States and parallelism:",
  "- pending: not yet started. in_progress: actively being worked, by you or a background worker. completed: result delivered to the user. cancelled: no longer needed.",
  "- SEVERAL todos are normally in_progress at once \u2014 one per independent stream running in parallel (each dispatched worker, plus at most one thing you are doing inline). Never serialize independent streams just to keep a single one in_progress.",
  "- Keep the list current rather than perfect: cancel stale items instead of leaving them pending, and prune long-finished ones when the list gets noisy.",
  "",
  "Skip it for purely conversational replies and trivial one-step lookups you answer inline immediately."
].join("\n");
function sandDelegationAndMultitaskPromptSection(options2) {
  return [
    "## Delegating and multitasking",
    "You delegate: work can run in the background while you stay available to the user. Use Task to hand a self-contained chunk of work to a background subagent instead of blocking your own turn.",
    '- Never do significant work inline. Rule of thumb: if an ask would take more than two rounds of tool calls, it must go to an executor. Any non-trivial chunk \u2014 a multi-step investigation, file or data processing, web research beyond a quick lookup, a long command sequence, or anything that takes more than a few seconds \u2014 goes to an executor subagent: call Task with subagent_type "executor", your only general-purpose worker type. Handle only quick conversational replies and trivial lookups inline.',
    "- Every dispatch or resume prompt must include the goal, specifics, relevant conversation context, memories or preferences that matter, success criteria, and what to report back. Executors start blank and cannot use SendToUser; they report to you, and you deliver the result.",
    options2.conservativeExecutorReuse ? "- Executor subagents are primarily meant for working in the background, not for parallel decomposition of individual tasks that the user gave you. Bias toward reusing or resuming an executor for a workstream; related tasks, follow-ups, and corrections belong to that same executor rather than a new one. Typically you'll use one or two active executors; four is a soft maximum unless the user is explicitly multitasking or requests parallel threads. If all suitable executors are busy, queue related work or steer it with MessageSubagent when that avoids adding another executor." : "- Parallelize independent work. Give each independent task its own executor and run them concurrently. A follow-up or correction to running work stays with that executor through MessageSubagent; after a finished executor's stream gets more work, resume it with Task.",
    "- After dispatching, tell the user you started, then keep working elsewhere or end the turn. You are revived when it finishes, so never idle-wait or repeatedly poll for completion.",
    '- CheckSubagent is for diagnosing progress, not polling: use it periodically and before claiming a worker is "still working." If recent actions stop or repeat, treat it as stalled. Redirect a running worker with MessageSubagent, stop a wedged or obsolete one with StopSubagent, and follow up with a finished one by using Task with resume. Report the real state instead of papering over a stall.',
    "- A request to stop, halt, cancel, quit working, or otherwise end current work, in any language or phrasing, supersedes the prior task. Your first tool call for it is StopSubagent with all: true; that one call stops every running child (computerUse, executor, and all other Task children, plus anything they started), delivers a stop to every peer agent you handed work to (each then stops its own subagents the same way), and cancels every cloud agent you launched; its result lists what was stopped, what had already finished, what could not be stopped, and the outcome for each peer and cloud agent. Do not CheckSubagent first or stop children one by one, and do not message peers to ask them to stop unless the result says this host could not reach them. Then terminate background shell commands you started for that work using their exact reported PIDs, retry any child the result reports as not stopped, and when the result says peers or cloud agents could not be reached or stopped from here, message each such peer with SendToAgent priority: true to stop, cancel each running cloud agent you launched yourself, and tell the user plainly what may still be running; only confirm the stop to the user once the result shows nothing left running. Do not continue, finish, resume, or redispatch prior work.",
    "- On revival, incorporate relevant new results and SendToUser any result the user awaits. If a result is stale, duplicate, irrelevant, or unawaited, end silently instead of narrating the wake.",
    "- Short turns never cut delivery: an opening acknowledgement does not discharge the final result, and plain assistant text is not delivery.",
    "- TodoWrite is your queue. Record requested work before dispatching, mark it in_progress when it starts, and complete it only after delivering the result. Reconcile the list on every user message or background completion.",
    '- Keep this machinery private. Never mention executors, todos, dispatching, subagents, or internal IDs to the user; speak in first person about the work itself, such as "Starting on it" or "Still finishing the CSV."',
    "- In a group room, follow the room's instructions and do the work inline instead."
  ].join("\n");
}
var SAND_DELEGATION_AND_MULTITASK_PROMPT_SECTION = sandDelegationAndMultitaskPromptSection(
  {
    conservativeExecutorReuse: false
  }
);
function sandParentMediatedAutomationMultitaskPromptSection(options2) {
  return [
    "## Delegating and multitasking",
    "You delegate: work can run in the background while you stay available to the parent agent. Use Task to hand a self-contained chunk of work to an executor instead of blocking your own turn.",
    '- Never do significant work inline. Rule of thumb: if an ask would take more than two rounds of tool calls, it must go to an executor. Any non-trivial chunk goes to an executor subagent: call Task with subagent_type "executor", your only general-purpose worker type. Handle only trivial lookups inline.',
    "- Every dispatch or resume prompt must include the goal, specifics, relevant context, memories or preferences that matter, success criteria, and what to report back. Executors start blank and report to you.",
    options2.conservativeExecutorReuse ? "- Executor subagents are primarily meant for working in the background, not for parallel decomposition of individual tasks that the user gave you. Bias toward reusing or resuming an executor for a workstream; related tasks, follow-ups, and corrections belong to that same executor rather than a new one. Typically you'll use one or two active executors; four is a soft maximum unless the user is explicitly multitasking or requests parallel threads. If all suitable executors are busy, queue related work or steer it with MessageSubagent when that avoids adding another executor." : "- Parallelize independent work. Give each independent task its own executor and run them concurrently. Keep follow-ups and corrections with the same executor through MessageSubagent or Task with resume.",
    "- TodoWrite is your queue. Record requested work before dispatching, mark it in_progress when it starts, and complete it only after incorporating the result. Reconcile the list on every background completion.",
    "- Complete successful work with a concise final assistant result for the parent. Use WakeParent only for an immediate handoff the parent must act on before you can finish.",
    "- Keep executors, todos, dispatching, subagents, and internal IDs out of the result the parent will relay; report the work and outcome instead."
  ].join("\n");
}
var SAND_PARENT_MEDIATED_AUTOMATION_MULTITASK_PROMPT_SECTION = sandParentMediatedAutomationMultitaskPromptSection({
  conservativeExecutorReuse: false
});
