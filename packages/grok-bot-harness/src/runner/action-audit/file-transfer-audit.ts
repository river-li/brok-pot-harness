function createFileTransferAudit(auditor, identity) {
  if (auditor === void 0) return () => {
  };
  return (ctx, observation) => {
    const { toolCallId, ...transfer } = observation;
    auditor.record({
      agentId: identity.agentId,
      ...turnAttributionFromContext(ctx, identity.agentId),
      boxId: identity.resolveBoxId(),
      toolCallId,
      occurredAtMs: Date.now(),
      action: { kind: "fileTransfer", ...transfer }
    });
  };
}
function bindFileTransferAudit(audit, ctx, call) {
  return (result) => audit?.(ctx, { ...call, ...result });
}
var DAEMON_REFUSAL_CODES = /* @__PURE__ */ new Set([
  "local_tools_disabled",
  "permission_denied"
]);
function isLocalToolRefusal(error42) {
  return error42 instanceof SandLocalToolPermissionDeniedError || isMessagesDecline(error42) || DAEMON_REFUSAL_CODES.has(sandMessagesErrorCode(error42));
}
function readOutputByteLength(output) {
  switch (output.case) {
    case "content":
      return Buffer.byteLength(output.value);
    case "data":
      return output.value.byteLength;
    case void 0:
      return 0;
  }
}
function readFileTransferResult(result) {
  const outcome = result.result;
  switch (outcome.case) {
    case "success":
      return { outcome: "success", byteCount: readOutputByteLength(outcome.value.output) };
    case "permissionDenied":
    case "rejected":
      return { outcome: "denied" };
    case "fileNotFound":
      return { outcome: "error", errorCategory: "source_missing" };
    case "invalidFile":
      return { outcome: "error", errorCategory: "invalid_file" };
    case "error":
    case void 0:
      return { outcome: "error", errorCategory: "read_failed" };
  }
}
function wrapReadExecutorForFileTransferAudit(inner, audit, resolveMachineId) {
  return {
    execute: async (ctx, args, options2) => {
      const record2 = bindFileTransferAudit(audit, ctx, {
        ...args.toolCallId.length > 0 ? { toolCallId: args.toolCallId } : {},
        direction: "read",
        target: "user_machine",
        machineId: resolveMachineId(options2)
      });
      let result;
      try {
        result = await inner.execute(ctx, args, options2);
      } catch (error42) {
        record2(failedFileTransferResult(error42));
        throw error42;
      }
      record2(readFileTransferResult(result));
      return result;
    }
  };
}
function failedFileTransferResult(error42) {
  let innermost = error42;
  while (innermost instanceof Error) {
    if (isLocalToolRefusal(innermost)) return { outcome: "denied" };
    if (!(innermost.cause instanceof Error)) break;
    innermost = innermost.cause;
  }
  if (error42 instanceof BoxTransferError) return { outcome: "error", errorCategory: error42.code };
  return {
    outcome: "error",
    errorCategory: findSystemErrno(error42) ?? (innermost instanceof Error ? innermost.name : typeof innermost)
  };
}
