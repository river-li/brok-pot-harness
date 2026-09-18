var import_node_crypto80 = require("node:crypto");
init_dist3();
init_errors();
var logger104 = createLogger("sand:messages-grants-gate");
function messagesGrantsAskKey(ctx) {
  const toolCallId = ctx.get(sandLocalToolScopeKey)?.toolCallId;
  if (toolCallId === void 0) return (0, import_node_crypto80.randomUUID)();
  return `messages-grants:${toolCallId}`;
}
async function refusingAbortedTransport(ctx, run) {
  try {
    return await run();
  } catch (error41) {
    if (ctx.signal.aborted) {
      throw new SandLocalToolPermissionDeniedError(SAND_LOCAL_TOOLS_ASK_CANCELLED_MESSAGE);
    }
    throw error41;
  }
}
function gateMessagesOnGrants(messages2, grants, report) {
  const note = (ctx, row) => {
    try {
      report?.(row);
    } catch (error41) {
      logger104.warn(ctx, `Messages grants report failed (${errorLogTag(error41)})`);
    }
  };
  const probe = async (ctx, needed) => missingMessagesGrants(await messages2.run(ctx, { kind: "check-permissions" }), needed);
  return {
    enabled: () => messages2.enabled(),
    run: async (ctx, op, display) => {
      const needed = MESSAGES_OP_GRANTS[op.kind];
      if (needed.length === 0) return await messages2.run(ctx, op, display);
      const missing = await probe(ctx, needed);
      if (missing.length === 0) {
        note(ctx, { op: op.kind, requested: [], outcome: "already-granted", waitedMs: 0 });
        return await messages2.run(ctx, op, display);
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
      return await messages2.run(ctx, op, display);
    }
  };
}
