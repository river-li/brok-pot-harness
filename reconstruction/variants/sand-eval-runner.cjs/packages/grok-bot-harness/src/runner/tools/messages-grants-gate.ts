/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/messages-grants-gate.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto38 = require("node:crypto");
init_dist();

// @recovered-fragment 2/2
var logger102 = createLogger("sand:messages-grants-gate");
function messagesGrantsAskKey(ctx) {
  const toolCallId = ctx.get(sandLocalToolScopeKey)?.toolCallId;
  if (toolCallId === void 0) return (0, import_node_crypto38.randomUUID)();
  return `messages-grants:${toolCallId}`;
}
async function refusingAbortedTransport(ctx, run) {
  try {
    return await run();
  } catch (error3) {
    if (ctx.signal.aborted) {
      throw new SandLocalToolPermissionDeniedError(SAND_LOCAL_TOOLS_ASK_CANCELLED_MESSAGE);
    }
    throw error3;
  }
}
function gateMessagesOnGrants(messages, grants, report) {
  const note = (ctx, row) => {
    try {
      report?.(row);
    } catch (error3) {
      logger102.warn(ctx, `Messages grants report failed (${errorLogTag(error3)})`);
    }
  };
  const probe = async (ctx, needed) => missingMessagesGrants(await messages.run(ctx, { kind: "check-permissions" }), needed);
  return {
    enabled: () => messages.enabled(),
    run: async (ctx, op, display) => {
      const needed = MESSAGES_OP_GRANTS[op.kind];
      if (needed.length === 0) return await messages.run(ctx, op, display);
      const missing = await probe(ctx, needed);
      if (missing.length === 0) {
        note(ctx, { op: op.kind, requested: [], outcome: "already-granted", waitedMs: 0 });
        return await messages.run(ctx, op, display);
      }
      if (grants === void 0) {
        note(ctx, {
          op: op.kind,
          requested: missing,
          outcome: "refused",
          reason: "no-desktop",
          waitedMs: 0
        });
        throw new SandLocalToolPermissionDeniedError(
          messagesGrantsMissingMessage(missing),
          "messages_grants_no_desktop"
        );
      }
      const askedAt = performance.now();
      const outcome = await refusingAbortedTransport(
        ctx,
        () => grants.request({
          requestId: messagesGrantsAskKey(ctx),
          grants: missing,
          signal: ctx.signal
        })
      );
      const waitedMs = performance.now() - askedAt;
      if (outcome.kind === "refused" && outcome.reason !== "unavailable") {
        note(ctx, {
          op: op.kind,
          requested: missing,
          outcome: outcome.reason === "aborted" ? "cancelled" : "refused",
          reason: outcome.reason,
          waitedMs
        });
        throw new SandLocalToolPermissionDeniedError(
          outcome.message,
          outcome.reason === "no-desktop" ? "messages_grants_no_desktop" : void 0
        );
      }
      const still = await refusingAbortedTransport(ctx, () => probe(ctx, needed));
      if (still.length > 0) {
        note(ctx, { op: op.kind, requested: missing, outcome: "still-missing", waitedMs });
        throw new SandLocalToolPermissionDeniedError(
          messagesGrantsMissingMessage(still),
          "messages_grants_missing"
        );
      }
      note(ctx, { op: op.kind, requested: missing, outcome: "granted-after-ask", waitedMs });
      return await messages.run(ctx, op, display);
    }
  };
}

