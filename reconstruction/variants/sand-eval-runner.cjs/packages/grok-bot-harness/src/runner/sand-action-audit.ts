/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-action-audit.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function turnAttributionFromContext(ctx, agentId) {
  const turnId = ctx.get(requestIdKey);
  return {
    turnId,
    rootTurnId: getRootParentRequestId(ctx) ?? turnId,
    subagentId: subagentIdFromTurnContext(ctx, agentId)
  };
}
function mcpAuditStatus(result) {
  if (result.result.case === "success") {
    return result.result.value.isError ? "error" : "ok";
  }
  return result.result.case === "approved" ? "ok" : "error";
}
function wrapMcpExecutorForAudit(inner, deps) {
  return {
    execute: async (ctx, args, options2) => {
      const startedAtMs = Date.now();
      const turn = turnAttributionFromContext(ctx, deps.agentId);
      const sequence = deps.sequencer.next(turn.turnId);
      const execCtx = ctx.with(sandAuditEventSequenceKey, sequence);
      const transportPromise = deps.resolveTransport(args.providerIdentifier).catch(() => "unknown");
      const report = (status) => {
        const durationMs = Date.now() - startedAtMs;
        void transportPromise.then((transport) => {
          deps.auditor.record({
            agentId: deps.agentId,
            ...turn,
            sequence,
            occurredAtMs: startedAtMs,
            action: {
              kind: "mcpToolCall",
              toolCallId: args.toolCallId ?? "",
              serverIdentifier: args.providerIdentifier,
              serverName: args.providerIdentifier,
              toolName: args.name,
              transport,
              status,
              durationMs
            }
          });
        }).catch((error3) => {
          process.stderr.write(
            `sand.action_audit.mcp_record_failed error_class=${errorLogTag(error3)}
`
          );
        });
      };
      try {
        const result = await inner.execute(execCtx, args, options2);
        report(mcpAuditStatus(result));
        return result;
      } catch (error3) {
        report("error");
        throw error3;
      }
    }
  };
}
var NAVIGATION_PROBE_CDP_BASE_PORT = 9222;
function navigationProbeCommand(displayNumber) {
  const port = NAVIGATION_PROBE_CDP_BASE_PORT + displayNumber;
  return `curl -sf --max-time 2 "http://127.0.0.1:${port}/json/list"`;
}
var CURL_EXIT_CONNECTION_REFUSED = 7;
function classifyNavigationProbeResult(result, captureAborted) {
  const outcome = result.result;
  if (outcome.case !== "success" && outcome.case !== "failure") {
    return { kind: "capture-failed" };
  }
  if (outcome.case === "success" && outcome.value.exitCode === 0) {
    return { kind: "pages", stdout: outcome.value.stdout };
  }
  const terminatedNormally = outcome.case === "success" || outcome.value.aborted === false && outcome.value.abortReason === void 0;
  if (terminatedNormally && outcome.value.exitCode === CURL_EXIT_CONNECTION_REFUSED && outcome.value.signal === "" && !captureAborted) {
    return { kind: "chrome-unreachable" };
  }
  return { kind: "capture-failed" };
}
var NAVIGATION_PROBE_MIN_INTERVAL_MS = 2e3;
var IGNORED_URL_PREFIXES = [
  "about:",
  "chrome://",
  "chrome-extension://",
  "chrome-untrusted://",
  "devtools://"
];
function normalizeNavigationUrl(rawUrl) {
  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) return void 0;
  for (const prefix of IGNORED_URL_PREFIXES) {
    if (trimmed.startsWith(prefix)) return void 0;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.origin === "null") return void 0;
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return void 0;
  }
}
function parseNavigationProbeOutput(stdout) {
  const targets = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < stdout.length; i++) {
    const char = stdout[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === "[" || char === "{") {
      if (depth === 0 && char === "[") start = i;
      depth += 1;
    } else if (char === "]" || char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        try {
          const parsed = JSON.parse(stdout.slice(start, i + 1));
          if (Array.isArray(parsed)) {
            const entries = parsed;
            for (const entry of entries) {
              if (entry !== null && typeof entry === "object") {
                targets.push(entry);
              }
            }
          }
        } catch (error3) {
          process.stderr.write(
            `sand.action_audit.navigation_probe_output_unparseable error_class=${errorLogTag(error3)}
`
          );
        }
        start = -1;
      }
      if (depth < 0) depth = 0;
    }
  }
  return targets;
}
function subagentIdFromTurnContext(ctx, agentId) {
  const acting = ctx.get(conversationIdKey);
  return acting !== void 0 && acting.length > 0 && acting !== agentId ? acting : void 0;
}
function createSandNavigationProbe(deps) {
  const now = deps.now ?? Date.now;
  const lastUrlByPageId = /* @__PURE__ */ new Map();
  let lastProbeAtMs = 0;
  let inFlight = false;
  let inFlightPromise;
  let trailingScheduled = false;
  let baselineInFlight = false;
  let queuedDuringBaseline = null;
  let lastRequestedTurn = {};
  let reportGeneration = 0;
  const runProbe = async (ctx, remoteAccessor, displayNumber, mode, generation) => {
    if (!Number.isInteger(displayNumber) || displayNumber < 0) return;
    const shell = remoteAccessor.get(shellExecutorResource);
    const result = await shell.execute(
      ctx,
      deps.buildShellArgs({
        command: navigationProbeCommand(displayNumber),
        name: "curl",
        workingDirectory: "/workspace",
        toolCallId: "sand-navigation-probe"
      })
    );
    if (result.result.case !== "success" || result.result.value.exitCode !== 0) {
      return;
    }
    const occurredAtMs = now();
    for (const target of parseNavigationProbeOutput(result.result.value.stdout)) {
      if (target.type !== "page") continue;
      const pageId = typeof target.id === "string" ? target.id : "";
      if (pageId.length === 0) continue;
      const url2 = normalizeNavigationUrl(typeof target.url === "string" ? target.url : "");
      if (url2 === void 0) continue;
      if (lastUrlByPageId.get(pageId) === url2) continue;
      if (mode === "baseline") {
        lastUrlByPageId.set(pageId, url2);
        continue;
      }
      if (generation !== reportGeneration) continue;
      lastUrlByPageId.set(pageId, url2);
      deps.auditor.record({
        agentId: deps.agentId,
        ...lastRequestedTurn,
        boxId: deps.getBoxId?.(),
        occurredAtMs,
        action: {
          kind: "browserNavigation",
          url: url2,
          pageTitle: typeof target.title === "string" ? target.title : "",
          pageId
        }
      });
    }
  };
  const requestProbe = (ctx, remoteAccessor, displayNumber, generation = reportGeneration) => {
    if (baselineInFlight) {
      queuedDuringBaseline = { ctx, remoteAccessor, displayNumber, generation };
      return;
    }
    const at2 = now();
    if (inFlight || at2 - lastProbeAtMs < NAVIGATION_PROBE_MIN_INTERVAL_MS) {
      if (!trailingScheduled) {
        trailingScheduled = true;
        void delay2(NAVIGATION_PROBE_MIN_INTERVAL_MS).then(() => {
          trailingScheduled = false;
          requestProbe(ctx, remoteAccessor, displayNumber, generation);
        });
      }
      return;
    }
    lastProbeAtMs = at2;
    inFlight = true;
    inFlightPromise = runProbe(ctx, remoteAccessor, displayNumber, "report", generation).catch((error3) => {
      process.stderr.write(
        `sand.turn.navigation_probe_failed error_class=${errorLogTag(error3)}
`
      );
    }).finally(() => {
      inFlight = false;
      inFlightPromise = void 0;
    });
  };
  const probeTargetsByDisplay = /* @__PURE__ */ new Map();
  const probe = (ctx, remoteAccessor, displayNumber) => {
    lastRequestedTurn = turnAttributionFromContext(ctx, deps.agentId);
    probeTargetsByDisplay.set(displayNumber, { ctx: ctx.withDetached(), remoteAccessor });
    requestProbe(ctx, remoteAccessor, displayNumber);
  };
  const flush = async () => {
    const generation = reportGeneration;
    if (probeTargetsByDisplay.size === 0) return;
    if (baselinePromise !== void 0) await baselinePromise;
    if (inFlightPromise !== void 0) await inFlightPromise;
    lastProbeAtMs = now();
    inFlight = true;
    inFlightPromise = Promise.all(
      [...probeTargetsByDisplay.entries()].map(
        ([displayNumber, target]) => runProbe(target.ctx, target.remoteAccessor, displayNumber, "report", generation).catch(
          (error3) => {
            process.stderr.write(
              `sand.turn.navigation_probe_flush_failed error_class=${errorLogTag(error3)}
`
            );
          }
        )
      )
    ).finally(() => {
      inFlight = false;
      inFlightPromise = void 0;
    });
    await inFlightPromise;
  };
  const abandonPendingReports = () => {
    reportGeneration++;
  };
  let baselinePromise;
  const captureBaseline = (ctx, remoteAccessor, displayNumber) => {
    if (baselinePromise !== void 0) return baselinePromise;
    inFlight = true;
    baselineInFlight = true;
    baselinePromise = runProbe(ctx, remoteAccessor, displayNumber, "baseline", reportGeneration).catch((error3) => {
      process.stderr.write(
        `sand.turn.navigation_baseline_probe_failed error_class=${errorLogTag(error3)}
`
      );
    }).finally(() => {
      inFlight = false;
      baselineInFlight = false;
      const queued = queuedDuringBaseline;
      queuedDuringBaseline = null;
      if (queued !== null) {
        requestProbe(queued.ctx, queued.remoteAccessor, queued.displayNumber, queued.generation);
      }
    });
    return baselinePromise;
  };
  return { probe, captureBaseline, flush, abandonPendingReports };
}
function computerUseAuditKind(actionCase) {
  switch (actionCase) {
    case "screenshot":
      return "screenshot";
    case "click":
      return "click";
    case "mouseMove":
      return "mouse_move";
    case "drag":
      return "drag";
    case "type":
      return "type";
    case "key":
      return "key";
    case "scroll":
      return "scroll";
    case "wait":
      return "wait";
    default:
      return void 0;
  }
}
function computerUseSessionAuditRecord(args) {
  const actionCounts = {};
  let actionCount = 0;
  for (const [kind, count] of args.actionCounts) {
    actionCounts[kind] = count;
    actionCount += count;
  }
  return {
    agentId: args.agentId,
    turnId: args.lineage?.parentRequestId,
    rootTurnId: args.lineage?.rootParentRequestId ?? args.lineage?.parentRequestId,
    subagentId: args.subagentId,
    boxId: args.boxId,
    initiatedBy: "subagent",
    occurredAtMs: args.startedAtMs,
    action: {
      kind: "computerUseSession",
      toolCallId: args.toolCallId,
      actionCount,
      actionCounts,
      durationMs: Math.max(0, Date.now() - args.startedAtMs),
      screenshotCount: actionCounts["screenshot"] ?? 0
    }
  };
}

