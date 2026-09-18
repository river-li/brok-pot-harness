init_coordinator_tools_pb();
function toRedactedGetAgentStatusArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    agentIds: msg.agentIds
  };
}
function fromRedactedGetAgentStatusArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetAgentStatusArgs({
    toolCallId: msg.toolCallId,
    agentIds: msg.agentIds
  });
}
function toRedactedGetAgentStatusWorker(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    bcId: msg.bcId,
    name: createRedactedString(msg.name, DataClassification.CODE, "name", privacyMode),
    lifecycle: msg.lifecycle,
    turnInFlight: msg.turnInFlight,
    lastTerminalTurnStatus: msg.lastTerminalTurnStatus,
    prUrl: msg.prUrl,
    lastActivityAtMs: msg.lastActivityAtMs
  };
}
function fromRedactedGetAgentStatusWorker(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetAgentStatusWorker({
    bcId: msg.bcId,
    name: msg.name.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    lifecycle: msg.lifecycle,
    turnInFlight: msg.turnInFlight,
    lastTerminalTurnStatus: msg.lastTerminalTurnStatus,
    prUrl: msg.prUrl,
    lastActivityAtMs: msg.lastActivityAtMs
  });
}
function toRedactedGetAgentStatusSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    workers: msg.workers.map((v2) => toRedactedGetAgentStatusWorker(v2, privacyMode)),
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedGetAgentStatusSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetAgentStatusSuccess({
    workers: msg.workers.map((v2) => fromRedactedGetAgentStatusWorker(v2, purpose, opts)),
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGetAgentStatusError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedGetAgentStatusError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetAgentStatusError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGetAgentStatusResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedGetAgentStatusResult_result(msg.result, privacyMode)
  };
}
function toRedactedGetAgentStatusResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedGetAgentStatusSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedGetAgentStatusError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedGetAgentStatusResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetAgentStatusResult({
    result: fromRedactedGetAgentStatusResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedGetAgentStatusResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedGetAgentStatusSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedGetAgentStatusError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedGetAgentStatusToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedGetAgentStatusArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedGetAgentStatusResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedGetAgentStatusToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetAgentStatusToolCall({
    args: msg.args !== void 0 ? fromRedactedGetAgentStatusArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedGetAgentStatusResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedSendToAgentArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    agentId: msg.agentId,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode),
    delivery: msg.delivery,
    title: createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode)
  };
}
function fromRedactedSendToAgentArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToAgentArgs({
    toolCallId: msg.toolCallId,
    agentId: msg.agentId,
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    delivery: msg.delivery,
    title: msg.title.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendToAgentSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    workerBcId: msg.workerBcId,
    deliveredAs: msg.deliveredAs,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedSendToAgentSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToAgentSuccess({
    workerBcId: msg.workerBcId,
    deliveredAs: msg.deliveredAs,
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendToAgentError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedSendToAgentError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToAgentError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendToAgentResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedSendToAgentResult_result(msg.result, privacyMode)
  };
}
function toRedactedSendToAgentResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedSendToAgentSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedSendToAgentError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSendToAgentResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToAgentResult({
    result: fromRedactedSendToAgentResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedSendToAgentResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedSendToAgentSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedSendToAgentError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSendToAgentToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedSendToAgentArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedSendToAgentResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedSendToAgentToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToAgentToolCall({
    args: msg.args !== void 0 ? fromRedactedSendToAgentArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedSendToAgentResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedReadAgentTranscriptArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    agentId: msg.agentId,
    mode: msg.mode,
    maxTurns: msg.maxTurns
  };
}
function fromRedactedReadAgentTranscriptArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadAgentTranscriptArgs({
    toolCallId: msg.toolCallId,
    agentId: msg.agentId,
    mode: msg.mode,
    maxTurns: msg.maxTurns
  });
}
function toRedactedReadAgentTranscriptSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    transcript: createRedactedString(msg.transcript, DataClassification.CODE, "transcript", privacyMode),
    truncated: msg.truncated
  };
}
function fromRedactedReadAgentTranscriptSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadAgentTranscriptSuccess({
    transcript: msg.transcript.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    truncated: msg.truncated
  });
}
function toRedactedReadAgentTranscriptError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedReadAgentTranscriptError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadAgentTranscriptError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReadAgentTranscriptResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedReadAgentTranscriptResult_result(msg.result, privacyMode)
  };
}
function toRedactedReadAgentTranscriptResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedReadAgentTranscriptSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedReadAgentTranscriptError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedReadAgentTranscriptResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadAgentTranscriptResult({
    result: fromRedactedReadAgentTranscriptResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedReadAgentTranscriptResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedReadAgentTranscriptSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedReadAgentTranscriptError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedReadAgentTranscriptToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedReadAgentTranscriptArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedReadAgentTranscriptResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedReadAgentTranscriptToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadAgentTranscriptToolCall({
    args: msg.args !== void 0 ? fromRedactedReadAgentTranscriptArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedReadAgentTranscriptResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedCreateAgentArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    prompt: createRedactedString(msg.prompt, DataClassification.CODE, "prompt", privacyMode),
    name: msg.name !== void 0 ? createRedactedString(msg.name, DataClassification.CODE, "name", privacyMode) : void 0,
    model: msg.model,
    baseBranch: msg.baseBranch !== void 0 ? createRedactedString(msg.baseBranch, DataClassification.CODE, "base_branch", privacyMode) : void 0,
    machineType: msg.machineType,
    workerId: msg.workerId,
    pool: msg.pool !== void 0 ? createRedactedString(msg.pool, DataClassification.CODE, "pool", privacyMode) : void 0,
    labels: new Map(Object.entries(msg.labels).map(([k2, v2]) => [createRedactedString(k2, DataClassification.CODE, "labels", privacyMode), createRedactedString(v2, DataClassification.CODE, "labels", privacyMode)])),
    environmentBuildId: msg.environmentBuildId
  };
}
function fromRedactedCreateAgentArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateAgentArgs({
    toolCallId: msg.toolCallId,
    prompt: msg.prompt.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    name: msg.name?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    model: msg.model,
    baseBranch: msg.baseBranch?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    machineType: msg.machineType,
    workerId: msg.workerId,
    pool: msg.pool?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    labels: Object.fromEntries(Array.from(msg.labels.entries()).map(([k2, v2]) => [k2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }), v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })])),
    environmentBuildId: msg.environmentBuildId
  });
}
function toRedactedCreateAgentSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    agentId: msg.agentId,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedCreateAgentSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateAgentSuccess({
    agentId: msg.agentId,
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedCreateAgentError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode),
    placementApprovalState: msg.placementApprovalState
  };
}
function fromRedactedCreateAgentError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateAgentError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    placementApprovalState: msg.placementApprovalState
  });
}
function toRedactedCreateAgentResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedCreateAgentResult_result(msg.result, privacyMode)
  };
}
function toRedactedCreateAgentResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedCreateAgentSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedCreateAgentError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedCreateAgentResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateAgentResult({
    result: fromRedactedCreateAgentResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedCreateAgentResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedCreateAgentSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedCreateAgentError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedCreateAgentToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedCreateAgentArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedCreateAgentResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedCreateAgentToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateAgentToolCall({
    args: msg.args !== void 0 ? fromRedactedCreateAgentArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedCreateAgentResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedStopAgentArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    agentId: msg.agentId
  };
}
function fromRedactedStopAgentArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StopAgentArgs({
    toolCallId: msg.toolCallId,
    agentId: msg.agentId
  });
}
function toRedactedStopAgentSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    workerBcId: msg.workerBcId,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedStopAgentSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StopAgentSuccess({
    workerBcId: msg.workerBcId,
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedStopAgentError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedStopAgentError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StopAgentError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedStopAgentResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedStopAgentResult_result(msg.result, privacyMode)
  };
}
function toRedactedStopAgentResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedStopAgentSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedStopAgentError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedStopAgentResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StopAgentResult({
    result: fromRedactedStopAgentResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedStopAgentResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedStopAgentSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedStopAgentError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedStopAgentToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedStopAgentArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedStopAgentResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedStopAgentToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StopAgentToolCall({
    args: msg.args !== void 0 ? fromRedactedStopAgentArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedStopAgentResult(msg.result, purpose, opts) : void 0
  });
}
