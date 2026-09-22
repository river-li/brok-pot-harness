/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/local-tool-permission/local-tool-permission-resolution.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandLocalToolPermissionResolutionError = class extends SandDomainError {
  name = "SandLocalToolPermissionResolutionError";
};
async function settleLocalToolPermissionCard(deps, args) {
  try {
    return await deps.transcript.widgetResponses.settleStaleLocalToolPermissionCard(args);
  } catch (error42) {
    deps.onCardWriteFailure?.();
    throw error42;
  }
}
async function resolveLocalToolPermissionAsk(deps, args) {
  const staleError = new Error(
    "That local-tool permission request is no longer waiting for an answer."
  );
  if (!isSandLocalToolPermissionResolution(args.resolution)) {
    throw new SandLocalToolPermissionResolutionError("Unknown local-tool permission resolution.");
  }
  const pending = deps.asks.getPendingRequestById(args.requestId);
  if (pending === void 0) {
    const remembered = deps.asks.settledStatus(args.requestId);
    const settle = await settleLocalToolPermissionCard(deps, {
      agentId: args.agentId,
      entryId: args.entryId,
      requestId: args.requestId,
      ...remembered === void 0 ? {} : { status: remembered }
    });
    if (settle !== false) {
      if (settle === "retired") deps.onStrandedRetirement?.();
      return;
    }
    if (deps.asks.wasSettled(args.requestId)) return;
    throw staleError;
  }
  if (pending.agentId !== args.agentId) {
    throw staleError;
  }
  const settled = deps.asks.resolveRequest(args.requestId, args.resolution);
  if (settled === void 0 || settled.status === "pending") {
    throw staleError;
  }
  await settleLocalToolPermissionCard(deps, {
    agentId: args.agentId,
    entryId: args.entryId,
    requestId: args.requestId,
    status: settled.status
  });
}

