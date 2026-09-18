function createToolCallIdentity(host) {
  const modelToolNamesByCallId = /* @__PURE__ */ new Map();
  const surfaceUnresolvedPendingByCallId = /* @__PURE__ */ new Map();
  function stashSurfaceUnresolvedPending(callId, update) {
    if (surfaceUnresolvedPendingByCallId.size >= 128) {
      const oldest = surfaceUnresolvedPendingByCallId.keys().next().value;
      if (oldest != null) surfaceUnresolvedPendingByCallId.delete(oldest);
    }
    surfaceUnresolvedPendingByCallId.set(callId, update);
  }
  function recordModelToolName(toolCallId, name17) {
    if (modelToolNamesByCallId.size >= 128) {
      const oldest = modelToolNamesByCallId.keys().next().value;
      if (oldest != null) modelToolNamesByCallId.delete(oldest);
    }
    modelToolNamesByCallId.set(toolCallId, name17);
    const held = surfaceUnresolvedPendingByCallId.get(toolCallId);
    if (held != null) {
      surfaceUnresolvedPendingByCallId.delete(toolCallId);
      host.emitUpdate({ ...held, name: name17 });
    }
  }
  function resolveModelToolName(event, callId, outlineName) {
    const recorded = modelToolNamesByCallId.get(callId);
    if (event === "toolCallCompleted") {
      modelToolNamesByCallId.delete(callId);
      surfaceUnresolvedPendingByCallId.delete(callId);
    }
    return recorded ?? outlineName;
  }
  return {
    recordModelToolName,
    resolveModelToolName,
    stashSurfaceUnresolvedPending
  };
}
