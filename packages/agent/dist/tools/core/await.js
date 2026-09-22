var __addDisposableResource30 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources30 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var logger78 = createLogger("await-tool");
var DEFAULT_BLOCK_UNTIL_MS = 3e4;
var SHELL_CHECK_SLICE_MS = 250;
var AWAIT_TOOL_MODEL_NAME_DEFAULT = "Await";
var AWAIT_TOOL_MODEL_NAME_SHELL_ONLY = "AwaitShell";
var WAITING_FOR_SUBAGENT_DESCRIPTION = "Set this to true if you are waiting for subagent(s) to complete. Remember you should NOT be doing this and instead end your turn or do parallel work.";
var WAITING_FOR_SUBAGENT_ERROR = "You should NOT wait for subagents to complete. End your turn instead; completions are queued, or do parallel work.";
function buildAwaitParametersSchema(args) {
  const { enableSubagentAwaiting, defaultBlockUntilMs, requireBlockUntilMs, useTrainingShellOnlyPrompt, includeWaitingForSubagentSignal } = args;
  const maxAwaitMinutes = Math.round(MAX_AWAIT_BLOCK_UNTIL_MS / 6e4);
  const blockUntilMsDescription = requireBlockUntilMs ? `Max sleep time to block before returning (in milliseconds). Required. Set to 0 for non-blocking status check. Must not exceed ${MAX_AWAIT_BLOCK_UNTIL_MS} (${maxAwaitMinutes} minutes).` : `Max sleep time to block before returning (in milliseconds). Defaults to ${defaultBlockUntilMs}ms. Set to 0 for non-blocking status check. Must not exceed ${MAX_AWAIT_BLOCK_UNTIL_MS} (${maxAwaitMinutes} minutes).`;
  const blockUntilMsNumberSchema = lenientNumber(external_exports.number().max(MAX_AWAIT_BLOCK_UNTIL_MS, `block_until_ms must be at most ${MAX_AWAIT_BLOCK_UNTIL_MS} (${maxAwaitMinutes} minutes)`));
  const blockUntilMsSchema = requireBlockUntilMs ? blockUntilMsNumberSchema.describe(blockUntilMsDescription) : blockUntilMsNumberSchema.optional().describe(blockUntilMsDescription);
  const idSchema = external_exports.preprocess((val) => typeof val === "number" ? String(val) : val, external_exports.string().optional()).describe(useTrainingShellOnlyPrompt ? "Optional shell id to poll. If omitted, this tool sleeps for the full block_until_ms duration and then returns. Required when block_until_ms is 0." : enableSubagentAwaiting ? "Optional shell or subagent id to poll. If omitted, this tool sleeps for the full block_until_ms duration and then returns. Required when block_until_ms is 0." : "Optional shell id to poll. If omitted, this tool sleeps for the full block_until_ms duration and then returns. Required when block_until_ms is 0.");
  const patternSchema = external_exports.string().optional().describe(enableSubagentAwaiting ? "Block until the regex matches stdout/stderr stream (or task completes). Matches anywhere in the shell output, not just new output. Will not match terminal file headers or footers, e.g. exit_code. Accepts JavaScript regex patterns (compiled with the multiline `m` flag). Not supported for awaiting subagents: you MUST leave this argument unset." : "Block until the regex matches stdout/stderr stream (or task completes). Matches anywhere in the shell output, not just new output. Will not match terminal file headers or footers, e.g. exit_code. Accepts JavaScript regex patterns (compiled with the multiline `m` flag).");
  if (!enableSubagentAwaiting && !useTrainingShellOnlyPrompt) {
    const baseParametersSchema4 = external_exports.object({
      shell_id: idSchema,
      block_until_ms: blockUntilMsSchema,
      pattern: patternSchema,
      ...includeWaitingForSubagentSignal ? {
        waiting_for_subagent: external_exports.boolean().optional().describe(WAITING_FOR_SUBAGENT_DESCRIPTION)
      } : {}
    });
    const parametersSchema29 = extendMachineIdParameter(baseParametersSchema4, args.machineIds, args.machineIdParameterSchema);
    return external_exports.preprocess((rawArgs) => {
      if (rawArgs === null || typeof rawArgs !== "object" || Array.isArray(rawArgs)) {
        return rawArgs;
      }
      const normalized = { ...rawArgs };
      if (normalized.shell_id === void 0 && normalized.task_id !== void 0) {
        normalized.shell_id = normalized.task_id;
      }
      return normalized;
    }, parametersSchema29.transform(({ shell_id, ...rest }) => ({
      task_id: shell_id,
      ...rest
    })));
  }
  const baseParametersSchema3 = external_exports.object({
    task_id: idSchema,
    block_until_ms: blockUntilMsSchema,
    pattern: patternSchema
  });
  return extendMachineIdParameter(baseParametersSchema3, args.machineIds, args.machineIdParameterSchema);
}
function normalizeAwaitArgsInput(rawArgs, args) {
  if (rawArgs === null || typeof rawArgs !== "object" || Array.isArray(rawArgs)) {
    return rawArgs;
  }
  if (!args.enableAwaitTerminalPathCompat) {
    return rawArgs;
  }
  const normalized = { ...rawArgs };
  const taskIdIsAlreadyPresent = typeof normalized.task_id === "string" && normalized.task_id.trim().length > 0 || typeof normalized.task_id === "number" && Number.isFinite(normalized.task_id) || typeof normalized.shell_id === "string" && normalized.shell_id.trim().length > 0 || typeof normalized.shell_id === "number" && Number.isFinite(normalized.shell_id);
  if (taskIdIsAlreadyPresent || normalized.path === void 0) {
    return normalized;
  }
  if (typeof normalized.path !== "string") {
    throw new Error("path must be a path to a terminal file");
  }
  const terminalId = extractTerminalId(normalized.path);
  if (terminalId === null) {
    throw new Error("path must be a path to a terminal file");
  }
  normalized.task_id = String(terminalId.id);
  return normalized;
}
function createAwaitToolCall(awaitTool) {
  return new ToolCall({
    tool: {
      case: "awaitToolCall",
      value: awaitTool
    }
  });
}
function toPositiveInt(value, fallback2) {
  if (value === void 0) {
    return fallback2;
  }
  if (!Number.isFinite(value)) {
    return fallback2;
  }
  if (value < 0) {
    return fallback2;
  }
  return Math.floor(value);
}
function isShellTaskId(taskId) {
  return /^[0-9]+$/.test(taskId.trim());
}
function normalizeAwaitTaskId(taskId) {
  const trimmed = taskId.trim();
  if (trimmed.length === 0 || trimmed.toLowerCase() === "none") {
    return "";
  }
  return trimmed;
}
function toNumberLike(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  const parsed2 = Number(String(value));
  return Number.isFinite(parsed2) ? parsed2 : 0;
}
function normalizeAwaitResult(result) {
  if (!result || result.case === void 0) {
    return { case: void 0 };
  }
  if (result.case === "success") {
    const nested = result.value.awaitResult;
    if (!nested || nested.case === void 0) {
      return { case: void 0 };
    }
    if (nested.case === "complete") {
      return { case: "complete", value: nested.value };
    }
    if (nested.case === "stillRunning") {
      return { case: "stillRunning", value: nested.value };
    }
    return { case: void 0 };
  }
  if (result.case === "error") {
    return { case: "error", value: result.value };
  }
  const legacyResult = result;
  if (legacyResult.case === "complete") {
    return {
      case: "complete",
      value: legacyResult.value
    };
  }
  if (legacyResult.case === "stillRunning") {
    return {
      case: "stillRunning",
      value: legacyResult.value
    };
  }
  if (legacyResult.case === "error") {
    return {
      case: "error",
      value: legacyResult.value
    };
  }
  return { case: void 0 };
}
function parseShellFooter(content) {
  const footerMatch = content.match(/\n---\n([\s\S]*?)\n---\s*$/);
  if (!footerMatch) {
    return { isComplete: false };
  }
  const footer = footerMatch[1] ?? "";
  const exitCodeLineMatch = footer.match(/(?:^|\n)exit_code:\s*([^\n]*)/);
  if (!exitCodeLineMatch) {
    return { isComplete: false };
  }
  const rawExitCode = (exitCodeLineMatch[1] ?? "").trim();
  const parsedExitCode = Number(rawExitCode);
  const exitCode = rawExitCode.length > 0 && Number.isInteger(parsedExitCode) && parsedExitCode >= -2147483648 && parsedExitCode <= 2147483647 ? parsedExitCode : void 0;
  const elapsedMatch = footer.match(/(?:^|\n)elapsed_ms:\s*(\d+)/);
  const runtimeMs = elapsedMatch ? Number(elapsedMatch[1]) : void 0;
  return {
    isComplete: true,
    runtimeMs,
    exitCode
  };
}
function parseShellRunningForMs(content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatterMatch) {
    return void 0;
  }
  const match2 = frontmatterMatch[1]?.match(/(?:^|\r?\n)running_for_ms:\s*(\d+)/);
  if (!match2) {
    return void 0;
  }
  const runningForMs = Number(match2[1]);
  return Number.isSafeInteger(runningForMs) ? runningForMs : void 0;
}
function parseShellFrontmatterStatus(content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatterMatch) {
    return void 0;
  }
  const match2 = frontmatterMatch[1]?.match(/(?:^|\r?\n)status:\s*([a-z]+)/);
  return match2?.[1];
}
function buildRegex(pattern) {
  if (!pattern) {
    return void 0;
  }
  if (pattern.trim().length === 0) {
    return void 0;
  }
  const compiled = RE2JS.compile(pattern, RE2JS.MULTILINE);
  return {
    find(input) {
      return compiled.matcher(input).find();
    },
    firstMatch(input) {
      const matcher = compiled.matcher(input);
      if (!matcher.find()) {
        return "";
      }
      return matcher.group() ?? "";
    }
  };
}
function getRegexMatch(compiled, content) {
  if (!compiled) {
    return { matched: false, firstMatch: "" };
  }
  const firstMatch = compiled.firstMatch(content);
  if (firstMatch.length === 0) {
    return { matched: false, firstMatch: "" };
  }
  return { matched: true, firstMatch };
}
function truncateMiddle2(value, sideChars = 500) {
  const maxPreserved = sideChars * 2;
  if (value.length <= maxPreserved) {
    return value;
  }
  return `${value.slice(0, sideChars)}...${value.slice(-sideChars)}`;
}
function extractShellBodyBetweenMetadataDelimiters(content) {
  let body = content;
  if (body.startsWith("---\n")) {
    const secondDelimiterIndex = body.indexOf("\n---\n", 4);
    if (secondDelimiterIndex >= 0) {
      body = body.slice(secondDelimiterIndex + 5);
    }
  }
  const footerMatch = body.match(/\n---\n[\s\S]*?\n---\s*$/);
  if (footerMatch?.index !== void 0) {
    body = body.slice(0, footerMatch.index);
  }
  return body;
}
function throwIfAborted(ctx) {
  if (ctx.signal.aborted) {
    throw new ToolCallAbortedError();
  }
}
var WAKE_REASON_CONTEXT_INJECTION = "context_injection";
async function sleepOrAbortOrSteerRelease(ctx, ms2, steerSignal) {
  throwIfAborted(ctx);
  if (steerSignal?.hasPendingUserInjections()) {
    return "steer_release";
  }
  return await new Promise((resolve29, reject2) => {
    let timeout2;
    let unsubscribe;
    function cleanup() {
      if (timeout2 !== void 0) {
        clearTimeout(timeout2);
        timeout2 = void 0;
      }
      ctx.signal.removeEventListener("abort", onAbort);
      unsubscribe?.();
      unsubscribe = void 0;
    }
    function onAbort() {
      cleanup();
      reject2(new ToolCallAbortedError());
    }
    ctx.signal.addEventListener("abort", onAbort, { once: true });
    timeout2 = setTimeout(() => {
      cleanup();
      resolve29("timeout");
    }, ms2);
    unsubscribe = steerSignal?.onUserInjectionAdmitted(() => {
      cleanup();
      resolve29("steer_release");
    });
  });
}
function normalizePathJoin(base, leaf) {
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${trimmedBase}/${leaf}`;
}
function findTranscriptInTree(root, targetFileName) {
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) {
      continue;
    }
    for (const file2 of node.childrenFiles) {
      if (file2.name === targetFileName) {
        return normalizePathJoin(node.absPath, file2.name);
      }
    }
    for (const child of node.childrenDirs) {
      stack.push(child);
    }
  }
  return void 0;
}
function isTimeoutLikeError(errorMessage6) {
  const message = errorMessage6.toLowerCase();
  return message.includes("timed out") || message.includes("timeout") || message.includes("aborted by the user") || message.includes("aborted");
}
function isNoRunningBackgroundSubagentError(errorMessage6) {
  const message = errorMessage6.toLowerCase();
  return message.includes("no running background subagent found") || message.includes("no background subagent found for id");
}
var snapshotReadSequence = 0;
async function readSnapshot(ctx, resourceAccessor, path31, toolCallId, machineId) {
  const readExecutor = resourceAccessor.get(readExecutorResource);
  const readResult = await readExecutor.execute(ctx, new ReadArgs({
    path: path31,
    toolCallId
  }), {
    execId: generateSeededUuid(`await-read-${toolCallId}-${snapshotReadSequence++}`),
    ...machineId !== void 0 ? { machineId } : {}
  });
  switch (readResult.result.case) {
    case "success": {
      const success2 = readResult.result.value;
      const content = success2.output.case === "content" ? success2.output.value : success2.output.case === "data" ? import_node_buffer2.Buffer.from(success2.output.value).toString("utf8") : "";
      const outputLength = Math.max(0, toNumberLike(success2.fileSize));
      return {
        exists: true,
        content,
        outputLength: outputLength > 0 ? outputLength : content.length
      };
    }
    case "fileNotFound":
      return { exists: false, content: "", outputLength: 0 };
    case "permissionDenied":
      throw new Error(`Permission denied reading ${path31}`);
    case "rejected":
      throw new Error(readResult.result.value.reason || `Read rejected for ${path31}`);
    case "invalidFile":
      throw new Error(readResult.result.value.reason || `Invalid file: ${path31}`);
    case "error":
      throw new Error(readResult.result.value.error || `Read failed for ${path31}`);
    case void 0:
      throw new Error(`Unknown read result for ${path31}`);
    default: {
      const _exhaustive = readResult.result;
      throw new Error(`Unhandled read result case: ${_exhaustive}`);
    }
  }
}
async function resolveSubagentTranscriptPath(ctx, resourceAccessor, taskId, transcriptsFolder, toolCallId, parentConversationId) {
  if (!transcriptsFolder) {
    return void 0;
  }
  const directCandidates = [
    normalizePathJoin(transcriptsFolder, `${taskId}.jsonl`),
    normalizePathJoin(transcriptsFolder, `${taskId}/${taskId}.jsonl`),
    ...parentConversationId ? [normalizePathJoin(transcriptsFolder, `${parentConversationId}/subagents/${taskId}.jsonl`)] : []
  ];
  for (const candidate of directCandidates) {
    const snapshot = await readSnapshot(ctx, resourceAccessor, candidate, toolCallId).catch(() => void 0);
    if (snapshot?.exists) {
      return candidate;
    }
  }
  const lsExecutor = resourceAccessor.get(lsExecutorResource);
  const lsResult = await lsExecutor.execute(ctx, new LsArgs({
    path: transcriptsFolder,
    toolCallId,
    timeoutMs: 2e3
  })).catch(() => void 0);
  if (!lsResult) {
    return void 0;
  }
  switch (lsResult.result.case) {
    case "success": {
      const root = lsResult.result.value.directoryTreeRoot;
      if (!root) {
        return void 0;
      }
      return findTranscriptInTree(root, `${taskId}.jsonl`);
    }
    case "timeout": {
      const root = lsResult.result.value.directoryTreeRoot;
      if (!root) {
        return void 0;
      }
      return findTranscriptInTree(root, `${taskId}.jsonl`);
    }
    default:
      return void 0;
  }
}
function buildLegacyAwaitDescription(args) {
  const { enableSubagentAwaiting, hasShell } = args;
  const idNoun = enableSubagentAwaiting ? "task id" : "shell id";
  const idArg = enableSubagentAwaiting ? "task_id" : "shell_id";
  const shellOnlyGuidance = hasShell ? `
- Shell only guidance:
  - Waiting until a regex matches the output can be useful for e.g. known startup/status/error logs.
  - HARD STOPPING CONSTRAINT: Don't stop polling until (a) job terminates, (b) the command reaches a healthy steady state (only for non-terminating command, e.g. dev server/watcher), or (c) command is hung - follow guidance below.
  - Output file header has \`pid\` and \`running_for_ms\` (updated every 5000ms).
  - When finished, footer with \`exit_code\` and \`elapsed_ms\` appears (regex only matches the body, not header/footer).
  - If taking longer than expected and the command seems like it is hung (use judgment based on type of command), kill the process if safe to do so using the pid that appears in the header. If possible, try to fix the hang and proceed.` : "";
  return `Poll a background ${enableSubagentAwaiting ? "shell or subagent" : "shell"} job. For work that does not have a ${idNoun}, you can omit the ${idArg} arg to sleep for the full \`block_until_ms\` duration (prefer this over sleeping in the shell, because it renders nicely to the user).

Monitor backgrounded jobs as follows:
- Never poll a task whose tool result says it was "manually backgrounded by the user".
- When you spawn a command directly into the background (\`block_until_ms: 0\`), check status immediately by reading the output file to confirm the command didn't fail to start.
- Poll repeatedly to monitor by using this tool between checks (set \`block_until_ms\` to control how long to wait). If the file gets large, read from the end of the file to capture the latest content.
- Pick your polling intervals using best guess/judgment based on any knowledge you have about the command and its expected runtime, and any output from monitoring the job. When no new output, exponential backoff is a good strategy (e.g. 2000ms, 4000ms, 8000ms, 16000ms...), using educated guess for min and max wait.${shellOnlyGuidance}`;
}
function buildNotifyFirstAwaitDescription(args) {
  const { enableSubagentAwaiting, hasShell, toolName, taskToolName, promptCacheTTLMs } = args;
  const jobNoun = enableSubagentAwaiting ? "shell or subagent" : "shell";
  const idNoun = enableSubagentAwaiting ? "task id" : "shell id";
  const idArg = enableSubagentAwaiting ? "task_id" : "shell_id";
  const promptCacheTTLWaitGuidance = promptCacheTTLMs === void 0 ? "When waiting further, avoid round 5-minute waits: prefer slices of 60\u2013270s (keeps prompt cache warm) or 1200s+ (one cache miss buys a long wait)." : formatPromptCacheTTLWaitGuidance(promptCacheTTLMs);
  const neverPollSubagentBullet = taskToolName !== void 0 && !enableSubagentAwaiting ? `
- NEVER USE THIS TO POLL OR WAIT VACUOUSLY FOR A SUBAGENT LAUNCHED WITH THE ${taskToolName} TOOL \u2014 rely on the end-of-turn completion notification instead (it is delivered as soon as the subagent finishes; guessing a wait time is inefficient).` : "";
  const subagentRule = enableSubagentAwaiting ? `
- Subagents: never wait on a subagent with ${toolName}. Subagents are always notify-on-completion \u2014 multitask on independent work (or respond to the user if there is nothing else productive to do) and wait to be woken up. The only valid use of ${toolName} on a subagent is a non-blocking status check (\`block_until_ms: 0\`); never use it to block on the subagent finishing.` : "";
  const shellGuidance = hasShell ? `
- Shell: only poll with ${toolName} when the command requires close monitoring. Close monitoring means a long-running job that can silently hang, degrade, or need a course correction before it completes \u2014 e.g. training runs, eval runs, deployments, long builds, datagen pipelines, DB migrations, large data transfers. For fire-and-forget commands (tests, installs, dev servers/watchers, short scripts, etc.) the completion notification is enough \u2014 start them, keep working, and only poll with ${toolName} later if you end up blocked on the result.
- Shell sanity check (regardless of close monitoring): when you spawn a command directly into the background (\`block_until_ms: 0\`), do a single status check by reading the output file to confirm the command didn't fail to start. This is a one-shot smoke check, not a polling loop.
- Shell close-monitoring guidance (only applies in the close-monitoring case above):
  - HARD STOPPING CONSTRAINT: once you've decided to actively poll, don't stop until (a) the job terminates, (b) the command reaches a healthy steady state (only for non-terminating commands, e.g. dev server/watcher), or (c) the command is hung \u2014 follow the hang guidance below.
  - Waiting until a regex matches the output can be useful for e.g. known startup/status/error logs.
  - Size \`block_until_ms\` to the command's expected runtime. ${promptCacheTTLWaitGuidance}
  - Output file header has \`pid\` and \`running_for_ms\` (updated every 5000ms).
  - When finished, footer with \`exit_code\` and \`elapsed_ms\` appears (regex only matches the body, not header/footer).
  - If the command is taking longer than expected and appears hung (use judgment based on command type), kill the process if safe to do so using the pid in the header. If possible, fix the hang and proceed.` : "";
  const closeMonitoringClause = enableSubagentAwaiting ? " Subagents are never a candidate for close monitoring." : "";
  const blockedBulletScope = enableSubagentAwaiting ? " (shell jobs only \u2014 never wait on a subagent)" : "";
  const positivePollBlock = hasShell ? `

Prefer NOT to poll reflexively with ${toolName}. Multitask on independent work while backgrounded jobs run, or finish your turn and rely on the end-of-turn completion notification. Poll with ${toolName} only when one of the following is true:
- Your very next step is blocked on this specific job's result and you have no other productive work to do${blockedBulletScope}, OR
- The task requires close monitoring (see shell guidance below).${closeMonitoringClause}` : `

Prefer NOT to poll reflexively with ${toolName}. Multitask on independent work while backgrounded jobs run, or finish your turn and rely on the end-of-turn completion notification.`;
  return `Check or poll a backgrounded ${jobNoun} job. For work that does not have a ${idNoun}, you can omit the ${idArg} arg to sleep for the full \`block_until_ms\` duration (prefer this over sleeping in the shell, because it renders nicely to the user). At the end of your turn, you will be notified about any unawaited jobs that completed. If you think a job completed (e.g. because you killed it), observe it with ${toolName} to skip the notification, because stale notifications can confuse the user.${positivePollBlock}
- Never poll a task whose tool result says it was "manually backgrounded by the user".${neverPollSubagentBullet}${subagentRule}${shellGuidance}`;
}
function formatPromptCacheTTLWaitGuidance(ms2) {
  const ttlSeconds = Math.round(ms2 / 1e3);
  const ttlMinutes = Math.round(ttlSeconds / 60);
  if (ttlMinutes === 1) {
    return `When waiting further, avoid round 1-minute waits: prefer slices of up to ${ttlSeconds - 30}s (keeps prompt cache warm) or ${ttlSeconds * 4}s+ (one cache miss buys a long wait).`;
  }
  if (ttlMinutes >= 1 && ttlMinutes <= 30) {
    return `When waiting further, avoid round ${ttlMinutes}-minute waits: prefer slices of 60\u2013${ttlSeconds - 30}s (keeps prompt cache warm) or ${ttlSeconds * 4}s+ (one cache miss buys a long wait).`;
  }
  if (ttlMinutes <= 6 * 60) {
    return `When waiting further, avoid waiting ${formatHoursForPrompt(ttlMinutes)}h or more: prefer slices of 60s-${ttlMinutes - 1}m (keeps prompt cache warm). Size slices based on expected progress; when progress is unclear, exponential backoff is useful.`;
  }
  return "When waiting further, size slices based on expected progress. When progress is unclear, exponential backoff is useful.";
}
function formatHoursForPrompt(minutes) {
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
}
var createAwaitTool = (resourceAccessor, options2, promptVersion) => {
  promptVersion = promptVersion ?? "latest";
  const baseEnableSubagentAwaiting = options2.enableSubagentAwaiting === true;
  const useTrainingShellOnlyPrompt = options2.useTrainingShellOnlyPrompt === true;
  const enableAwaitForSubagents = options2.enableAwaitForSubagents !== false;
  const enableSubagentAwaiting = baseEnableSubagentAwaiting && enableAwaitForSubagents && !useTrainingShellOnlyPrompt;
  const modelFacingToolName = !enableSubagentAwaiting && !useTrainingShellOnlyPrompt ? AWAIT_TOOL_MODEL_NAME_SHELL_ONLY : AWAIT_TOOL_MODEL_NAME_DEFAULT;
  const includeWaitingForSubagentSignal = options2.fixClaudeSubagentAwait === true && modelFacingToolName === AWAIT_TOOL_MODEL_NAME_SHELL_ONLY;
  const enableBoundedSubagentAwait = options2.enableBoundedSubagentAwait === true;
  const enableJobCompletionNotifications = options2.enableJobCompletionNotifications === true;
  const promptCacheTTLMs = options2.promptCacheTTLMs;
  const enableAwaitTerminalPathCompat = options2.enableAwaitTerminalPathCompat === true;
  const defaultBlockUntilMs = options2.defaultBlockUntilMs ?? DEFAULT_BLOCK_UNTIL_MS;
  const requireBlockUntilMs = options2.requireBlockUntilMs === true;
  const baseParametersSchema3 = buildAwaitParametersSchema({
    enableSubagentAwaiting,
    defaultBlockUntilMs,
    requireBlockUntilMs,
    useTrainingShellOnlyPrompt,
    includeWaitingForSubagentSignal,
    machineIds: options2.machineIds,
    machineIdParameterSchema: options2.machineIdParameterSchema
  });
  const parsingParametersSchema = external_exports.preprocess((rawArgs) => normalizeAwaitArgsInput(rawArgs, {
    // 0226-family composer prompts sometimes pass terminal-file paths
    // to Await instead of task ids, so keep this alias narrowly scoped.
    enableAwaitTerminalPathCompat
  }), baseParametersSchema3);
  const execute = async (parentCtx, interactionHandler, rawArgs, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource30(env_1, createSpan(parentCtx.withName("awaitExecute")), false);
      const ctx = spanCtxt.ctx;
      const machineId = resolveMachineIdArgument(options2.machineIds, rawArgs);
      const taskId = normalizeAwaitTaskId(rawArgs.task_id ?? rawArgs.shell_id ?? "");
      const blockUntilMs = toPositiveInt(rawArgs.block_until_ms, defaultBlockUntilMs);
      const args = new AwaitArgs({
        taskId,
        blockUntilMs,
        regex: rawArgs.pattern
      });
      const baseToolCall = new AwaitToolCall({ args, result: void 0 });
      return interactionHandler.executeToolCall(ctx, createAwaitToolCall(baseToolCall), meta.toolCallId, async (toolCtx) => {
        if (includeWaitingForSubagentSignal && rawArgs.waiting_for_subagent === true) {
          throw new ToolCallArgParseError(WAITING_FOR_SUBAGENT_ERROR);
        }
        const startMs = Date.now();
        const deadlineMs = startMs + blockUntilMs;
        const steerSignal = meta.contextInjectionSignal;
        if (!taskId) {
          if (blockUntilMs === 0) {
            throw new Error("Must pass a task id or wait for a nonzero duration.");
          }
          const sleepStartMs = Date.now();
          logger78.debug(ctx, "nal.await_stall.sleep_start", {
            blockUntilMs,
            callId: meta.toolCallId
          });
          const sleepOutcome = await sleepOrAbortOrSteerRelease(toolCtx, blockUntilMs, steerSignal);
          const actualSleepMs = Date.now() - sleepStartMs;
          logger78.debug(ctx, "nal.await_stall.sleep_completed", {
            blockUntilMs,
            actualSleepMs,
            sleepOutcome,
            callId: meta.toolCallId
          });
          const runtimeMs = sleepOutcome === "steer_release" ? actualSleepMs : blockUntilMs;
          return new AwaitResult({
            result: {
              case: "success",
              value: new AwaitSuccess({
                awaitResult: {
                  case: "complete",
                  value: new AwaitTaskComplete({
                    taskId: "",
                    runtimeMs: BigInt(runtimeMs),
                    outputFilePath: "",
                    outputLength: BigInt(0),
                    regexRequested: false,
                    regexMatch: void 0,
                    wakeReason: sleepOutcome === "steer_release" ? WAKE_REASON_CONTEXT_INJECTION : void 0
                  })
                }
              })
            }
          });
        }
        const regexRequested = rawArgs.pattern !== void 0 && rawArgs.pattern.trim().length > 0;
        const regex = buildRegex(rawArgs.pattern);
        if (!isShellTaskId(taskId)) {
          if (!enableSubagentAwaiting) {
            throw new ToolCallArgParseError(WAITING_FOR_SUBAGENT_ERROR);
          }
          if (regexRequested) {
            throw new ToolCallArgParseError("Regex awaiting is not available for subagents. Run Await without regex, or await a shell task id instead.");
          }
          const parentConversationId = getConversationId(toolCtx);
          if ((parentConversationId ?? "").trim().length === 0) {
            throw new Error("Awaiting subagent tasks requires a non-empty conversationId in the agent context");
          }
          let fallbackTranscriptPath;
          const getFallbackTranscriptPath = async () => {
            if (fallbackTranscriptPath !== void 0) {
              return fallbackTranscriptPath;
            }
            fallbackTranscriptPath = options2.agentTranscriptsFolder ? await resolveSubagentTranscriptPath(toolCtx, resourceAccessor, taskId, options2.agentTranscriptsFolder, meta.toolCallId, parentConversationId) : void 0;
            return fallbackTranscriptPath;
          };
          const readSubagentTranscriptSnapshot = async (path31) => path31 ? readSnapshot(toolCtx, resourceAccessor, path31, meta.toolCallId).catch(() => ({
            exists: false,
            content: "",
            outputLength: 0
          })) : { exists: false, content: "", outputLength: 0 };
          const buildSubagentAwaitSuccess = (awaitResult) => new AwaitResult({
            result: {
              case: "success",
              value: new AwaitSuccess({
                awaitResult
              })
            }
          });
          const [awaitCtx, cancelAwait] = toolCtx.withCancel();
          const rawSubagentAwaitPromise = (async () => {
            if (enableBoundedSubagentAwait) {
              const subagentAwaitExecutor = resourceAccessor.get(subagentAwaitExecutorResource);
              return await subagentAwaitExecutor.execute(awaitCtx, new SubagentAwaitArgs({
                agentId: taskId,
                timeoutMs: blockUntilMs
              }));
            }
            const subagentExecutor = (() => {
              try {
                return resourceAccessor.get(subagentExecutorResource);
              } catch {
                throw new Error("Awaiting subagent ids is not available in this environment (subagent executor resource is not registered).");
              }
            })();
            logger78.debug(toolCtx, "nal.await_stall.legacy_subagent_fallback", {
              taskId,
              blockUntilMs,
              callId: meta.toolCallId,
              reason: "bounded_await_disabled_for_client"
            });
            const legacyTimeoutMs = blockUntilMs === 0 ? 1 : blockUntilMs;
            const legacyCtx = toolCtx.withTimeout(legacyTimeoutMs);
            const legacyResult = await subagentExecutor.execute(legacyCtx, new SubagentArgs({
              toolCallId: meta.toolCallId,
              resumeAgentId: taskId,
              parentConversationId,
              prompt: "",
              readonly: true,
              runInBackground: false,
              subagentType: options2.defaultSubagentType ?? "generalPurpose",
              modelId: options2.defaultModelId ?? "default-model"
            }));
            switch (legacyResult.result.case) {
              case "success": {
                const success2 = legacyResult.result.value;
                return new SubagentAwaitResult({
                  result: {
                    case: "complete",
                    value: new SubagentAwaitComplete({
                      agentId: success2.agentId || taskId,
                      finalMessage: success2.finalMessage,
                      transcriptPath: await getFallbackTranscriptPath(),
                      toolCallCount: success2.toolCallCount
                    })
                  }
                });
              }
              case "error": {
                const subagentError = legacyResult.result.value;
                const errorMessage6 = subagentError.error || "";
                if (isTimeoutLikeError(errorMessage6)) {
                  return new SubagentAwaitResult({
                    result: {
                      case: "stillRunning",
                      value: new SubagentAwaitStillRunning({
                        agentId: subagentError.agentId || taskId,
                        transcriptPath: await getFallbackTranscriptPath()
                      })
                    }
                  });
                }
                if (isNoRunningBackgroundSubagentError(errorMessage6)) {
                  return new SubagentAwaitResult({
                    result: {
                      case: "notFound",
                      value: new SubagentAwaitNotFound({
                        agentId: subagentError.agentId || taskId
                      })
                    }
                  });
                }
                return new SubagentAwaitResult({
                  result: {
                    case: "error",
                    value: new SubagentAwaitError({
                      agentId: subagentError.agentId || taskId,
                      error: errorMessage6
                    })
                  }
                });
              }
              case void 0:
                return new SubagentAwaitResult({
                  result: {
                    case: "error",
                    value: new SubagentAwaitError({
                      agentId: taskId,
                      error: "Unknown legacy subagent await result"
                    })
                  }
                });
              default: {
                const _exhaustive = legacyResult.result;
                throw new Error(`Unhandled legacy subagent result case: ${_exhaustive}`);
              }
            }
          })();
          let subagentWaitSteerReleased = false;
          let subagentAwaitResult;
          {
            let unsubscribeSteer;
            const steerReleasePromise = new Promise((resolve29) => {
              if (steerSignal === void 0) {
                return;
              }
              if (steerSignal.hasPendingUserInjections()) {
                resolve29("steer_release");
                return;
              }
              unsubscribeSteer = steerSignal.onUserInjectionAdmitted(() => {
                resolve29("steer_release");
              });
            });
            try {
              const raced = await Promise.race([
                rawSubagentAwaitPromise.then((result) => ({ kind: "result", result }), (error42) => ({ kind: "error", error: error42 })),
                steerReleasePromise.then(() => ({
                  kind: "steer_release"
                }))
              ]);
              if (raced.kind === "error") {
                throw raced.error;
              }
              if (raced.kind === "steer_release") {
                subagentWaitSteerReleased = true;
                cancelAwait();
                rawSubagentAwaitPromise.catch(() => void 0);
                subagentAwaitResult = new SubagentAwaitResult({
                  result: {
                    case: "stillRunning",
                    value: new SubagentAwaitStillRunning({
                      agentId: taskId,
                      transcriptPath: await getFallbackTranscriptPath()
                    })
                  }
                });
              } else {
                subagentAwaitResult = raced.result;
              }
            } finally {
              unsubscribeSteer?.();
            }
          }
          throwIfAborted(toolCtx);
          switch (subagentAwaitResult.result.case) {
            case "complete": {
              const complete = subagentAwaitResult.result.value;
              const transcriptPath = complete.transcriptPath ?? await getFallbackTranscriptPath();
              const transcriptSnapshot = await readSubagentTranscriptSnapshot(transcriptPath);
              const runtimeMs = Math.max(0, Date.now() - startMs);
              return buildSubagentAwaitSuccess({
                case: "complete",
                value: new AwaitTaskComplete({
                  taskId,
                  runtimeMs: BigInt(runtimeMs),
                  outputFilePath: transcriptPath ?? "",
                  outputLength: BigInt(transcriptSnapshot.outputLength),
                  regexRequested: false,
                  regexMatch: void 0
                })
              });
            }
            case "stillRunning": {
              const stillRunning = subagentAwaitResult.result.value;
              const transcriptPath = stillRunning.transcriptPath ?? await getFallbackTranscriptPath();
              const transcriptSnapshot = await readSubagentTranscriptSnapshot(transcriptPath);
              const runtimeMs = Math.max(0, Date.now() - startMs);
              return buildSubagentAwaitSuccess({
                case: "stillRunning",
                value: new AwaitTaskStillRunning({
                  taskId,
                  runtimeMs: BigInt(runtimeMs),
                  outputFilePath: transcriptPath ?? "",
                  outputLength: BigInt(transcriptSnapshot.outputLength),
                  regexRequested: false,
                  regexMatch: void 0,
                  wakeReason: subagentWaitSteerReleased ? WAKE_REASON_CONTEXT_INJECTION : void 0
                })
              });
            }
            case "notFound": {
              const transcriptPath = await getFallbackTranscriptPath();
              const transcriptSnapshot = await readSubagentTranscriptSnapshot(transcriptPath);
              if (transcriptSnapshot.exists) {
                const runtimeMs = Math.max(0, Date.now() - startMs);
                return buildSubagentAwaitSuccess({
                  case: "complete",
                  value: new AwaitTaskComplete({
                    taskId,
                    runtimeMs: BigInt(runtimeMs),
                    outputFilePath: transcriptPath ?? "",
                    outputLength: BigInt(transcriptSnapshot.outputLength),
                    regexRequested: false,
                    regexMatch: void 0
                  })
                });
              }
              throw new Error("Subagent not found");
            }
            case "error": {
              const errorMessage6 = subagentAwaitResult.result.value.error || "";
              if (isTimeoutLikeError(errorMessage6) || isNoRunningBackgroundSubagentError(errorMessage6)) {
                throwIfAborted(toolCtx);
              }
              throw new Error(errorMessage6 || "Failed to await subagent task");
            }
            case void 0:
              throw new Error("Unknown subagent await result");
            default: {
              const _exhaustive = subagentAwaitResult.result;
              throw new Error(`Unhandled subagent await result case: ${_exhaustive}`);
            }
          }
        }
        const terminalsFolder = resolveTerminalsFolder({
          terminalsFolder: options2.terminalsFolder,
          machineId
        });
        const outputPath = terminalsFolder ? normalizePathJoin(terminalsFolder, `${taskId}.txt`) : "";
        if (!outputPath) {
          throw new Error("Cannot await shell task: terminals folder is unavailable");
        }
        let steerReleasedMidSleep = false;
        while (true) {
          throwIfAborted(toolCtx);
          const snapshot = await readSnapshot(toolCtx, resourceAccessor, outputPath, meta.toolCallId, machineId).catch((error42) => {
            throw new Error(error42 instanceof Error ? error42.message : "Failed to read shell output");
          });
          if (!snapshot.exists) {
            throw new Error(`No shell found for id ${taskId}`);
          }
          const footer = snapshot.exists ? parseShellFooter(snapshot.content) : {
            isComplete: false,
            runtimeMs: void 0,
            exitCode: void 0
          };
          const runningForMs = snapshot.exists ? parseShellRunningForMs(snapshot.content) : void 0;
          const runtimeMs = footer.runtimeMs ?? runningForMs ?? Math.max(0, Date.now() - startMs);
          const regexSearchContent = extractShellBodyBetweenMetadataDelimiters(snapshot.content);
          const shellRegexMatch = getRegexMatch(regex, regexSearchContent);
          const matchedRegex = snapshot.exists && shellRegexMatch.matched;
          const regexMatch = regexRequested && shellRegexMatch.matched ? truncateMiddle2(shellRegexMatch.firstMatch) : void 0;
          if (footer.isComplete) {
            const frontmatterStatus = parseShellFrontmatterStatus(snapshot.content);
            if (frontmatterStatus === "succeeded" || frontmatterStatus === "failed" || frontmatterStatus === "aborted") {
              const shellAborted = frontmatterStatus === "aborted";
              recordBackgroundShellExited(toolCtx, taskId, {
                exitCode: shellAborted ? null : footer.exitCode ?? null,
                aborted: shellAborted
              });
            }
            return new AwaitResult({
              result: {
                case: "success",
                value: new AwaitSuccess({
                  awaitResult: {
                    case: "complete",
                    value: new AwaitTaskComplete({
                      taskId,
                      runtimeMs: BigInt(Math.max(0, runtimeMs)),
                      outputFilePath: outputPath,
                      outputLength: BigInt(snapshot.outputLength),
                      regexRequested,
                      regexMatch,
                      exitCode: footer.exitCode
                    })
                  }
                })
              }
            });
          }
          if (matchedRegex) {
            return new AwaitResult({
              result: {
                case: "success",
                value: new AwaitSuccess({
                  awaitResult: {
                    case: "stillRunning",
                    value: new AwaitTaskStillRunning({
                      taskId,
                      runtimeMs: BigInt(Math.max(0, runtimeMs)),
                      outputFilePath: outputPath,
                      outputLength: BigInt(snapshot.outputLength),
                      regexRequested,
                      regexMatch
                    })
                  }
                })
              }
            });
          }
          const timedOut = blockUntilMs === 0 || Date.now() >= deadlineMs;
          const steerReleased = steerReleasedMidSleep || steerSignal?.hasPendingUserInjections() === true;
          if (timedOut || steerReleased) {
            return new AwaitResult({
              result: {
                case: "success",
                value: new AwaitSuccess({
                  awaitResult: {
                    case: "stillRunning",
                    value: new AwaitTaskStillRunning({
                      taskId,
                      runtimeMs: BigInt(Math.max(0, runtimeMs)),
                      outputFilePath: outputPath,
                      outputLength: BigInt(snapshot.outputLength),
                      regexRequested,
                      regexMatch,
                      wakeReason: steerReleased ? WAKE_REASON_CONTEXT_INJECTION : void 0
                    })
                  }
                })
              }
            });
          }
          const sliceOutcome = await sleepOrAbortOrSteerRelease(toolCtx, SHELL_CHECK_SLICE_MS, steerSignal);
          if (sliceOutcome === "steer_release") {
            steerReleasedMidSleep = true;
          }
        }
      }, (result) => createAwaitToolCall(new AwaitToolCall({ ...baseToolCall, result })));
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources30(env_1);
    }
  };
  const render2 = async (_ctx, output, _props) => {
    const formatSleepLine = (runtimeMs) => {
      const ms2 = toNumberLike(runtimeMs ?? BigInt(0));
      if (ms2 <= 0) {
        return "Slept briefly.";
      }
      const seconds = Math.max(1, Math.ceil(ms2 / 1e3));
      return `Slept for ${seconds}s.`;
    };
    const formatRegexLine = (value) => {
      if (!value.regexRequested) {
        return "";
      }
      if (value.regexMatch !== void 0 && value.regexMatch.length > 0) {
        return `Pattern matched: ${value.regexMatch ?? ""}`.trimEnd();
      }
      return "Pattern did NOT match.";
    };
    const normalizedResult = normalizeAwaitResult(output.result);
    switch (normalizedResult.case) {
      case "complete": {
        const value = normalizedResult.value;
        if (value.taskId.trim().length === 0) {
          const sleepLine = formatSleepLine(value.runtimeMs);
          return createStringResult(value.wakeReason === WAKE_REASON_CONTEXT_INJECTION ? `${sleepLine} Sleep released early: a new user message is arriving.` : sleepLine);
        }
        const regexLine = formatRegexLine(value);
        const shellExitCode = isShellTaskId(value.taskId) ? value.exitCode : void 0;
        let firstLine;
        if (isShellTaskId(value.taskId)) {
          const runtimeMs = (value.runtimeMs ?? BigInt(0)).toString();
          const exitCodeText = shellExitCode !== void 0 ? String(shellExitCode) : "unknown";
          firstLine = `Task completed in ${runtimeMs}ms with exit code: ${exitCodeText}.`;
        } else {
          firstLine = "Task complete.";
        }
        if (regexLine.length > 0) {
          firstLine = `${firstLine} ${regexLine}`;
        }
        return createStringResult(`${firstLine}
output_file_path: ${value.outputFilePath}
output_length: ${value.outputLength.toString()}`);
      }
      case "stillRunning": {
        const value = normalizedResult.value;
        const regexLine = formatRegexLine(value);
        let firstLine = isShellTaskId(value.taskId) ? `Task still running after ${(value.runtimeMs ?? BigInt(0)).toString()}ms...` : "Task still running.";
        if (value.wakeReason === WAKE_REASON_CONTEXT_INJECTION) {
          firstLine = `${firstLine} Wait released early: a new user message is arriving.`;
        }
        const firstLineWithRegex = regexLine.length > 0 ? `${firstLine} ${regexLine}` : firstLine;
        return createStringResult(`${firstLineWithRegex}
output_file_path: ${value.outputFilePath}
output_length: ${value.outputLength.toString()}`);
      }
      case "error":
        return createStringResult(`Error awaiting task: ${normalizedResult.value.error}`);
      case void 0:
        return createStringResult("Unknown error");
    }
  };
  function getDescription4(args) {
    const { version: version3, enableSubagentAwaiting: enableSubagentAwaiting2, hasShell, taskToolName, enableJobCompletionNotifications: enableJobCompletionNotifications2, promptCacheTTLMs: promptCacheTTLMs2 } = args;
    if (useTrainingShellOnlyPrompt) {
      return "Poll a background shell.";
    }
    switch (version3) {
      case "cursor-0226":
      case "dsv3-1205":
      case "dsv3-1018":
      case "gpt5-codex":
      case "codex-cloud":
      case "latest":
      case "haiku":
        return enableJobCompletionNotifications2 ? buildNotifyFirstAwaitDescription({
          enableSubagentAwaiting: enableSubagentAwaiting2,
          hasShell,
          toolName: modelFacingToolName,
          taskToolName,
          promptCacheTTLMs: promptCacheTTLMs2
        }) : buildLegacyAwaitDescription({
          enableSubagentAwaiting: enableSubagentAwaiting2,
          hasShell
        });
      default: {
        const _exhaustive = version3;
        throw new Error(`Unhandled version: ${_exhaustive}`);
      }
    }
  }
  return createZodAgentTool("AWAIT", {
    name: modelFacingToolName,
    contextType: {
      type: "dynamic",
      conciseStaticContext: "Use to sleep and check shell progress. Never sleep using shell."
    },
    descriptionGenerator: (props) => {
      const shellToolName = props.allTools.SHELL?.name;
      const taskToolName = props.allTools.TASK?.name;
      const mentionSubagents = enableSubagentAwaiting && taskToolName !== void 0;
      const hasShellTool = shellToolName !== void 0;
      const description9 = getDescription4({
        version: promptVersion,
        enableSubagentAwaiting: mentionSubagents,
        hasShell: hasShellTool,
        taskToolName,
        enableJobCompletionNotifications,
        promptCacheTTLMs
      });
      return description9;
    },
    parameters: baseParametersSchema3,
    execute: withSafeParsedArgs(parsingParametersSchema, execute, createAwaitToolCall(new AwaitToolCall())),
    render: render2,
    serializeError: (error42) => {
      const errorMessage6 = error42 instanceof Error ? error42.message : String(error42);
      return createAwaitToolCall(new AwaitToolCall({
        result: new AwaitResult({
          result: {
            case: "error",
            value: new AwaitError({
              error: errorMessage6
            })
          }
        })
      }));
    }
  });
};
