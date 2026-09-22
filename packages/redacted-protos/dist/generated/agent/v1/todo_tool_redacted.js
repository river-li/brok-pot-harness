/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/todo_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_todo_tool_pb();
function toRedactedTodoItem(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: msg.id,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    status: msg.status,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    dependencies: msg.dependencies
  };
}
function fromRedactedTodoItem(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TodoItem({
    id: msg.id,
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    status: msg.status,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    dependencies: msg.dependencies
  });
}
function toRedactedUpdateTodosToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedUpdateTodosArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedUpdateTodosResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedUpdateTodosToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateTodosToolCall({
    args: msg.args !== void 0 ? fromRedactedUpdateTodosArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedUpdateTodosResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedUpdateTodosArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    todos: msg.todos.map((v2) => toRedactedTodoItem(v2, privacyMode)),
    merge: msg.merge
  };
}
function fromRedactedUpdateTodosArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateTodosArgs({
    todos: msg.todos.map((v2) => fromRedactedTodoItem(v2, purpose, opts)),
    merge: msg.merge
  });
}
function toRedactedUpdateTodosResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedUpdateTodosResult_result(msg.result, privacyMode)
  };
}
function toRedactedUpdateTodosResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedUpdateTodosSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedUpdateTodosError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedUpdateTodosResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateTodosResult({
    result: fromRedactedUpdateTodosResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedUpdateTodosResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedUpdateTodosSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedUpdateTodosError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedUpdateTodosSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    todos: msg.todos.map((v2) => toRedactedTodoItem(v2, privacyMode)),
    totalCount: msg.totalCount,
    wasMerge: msg.wasMerge
  };
}
function fromRedactedUpdateTodosSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateTodosSuccess({
    todos: msg.todos.map((v2) => fromRedactedTodoItem(v2, purpose, opts)),
    totalCount: msg.totalCount,
    wasMerge: msg.wasMerge
  });
}
function toRedactedUpdateTodosError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedUpdateTodosError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateTodosError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReadTodosToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedReadTodosArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedReadTodosResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedReadTodosToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadTodosToolCall({
    args: msg.args !== void 0 ? fromRedactedReadTodosArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedReadTodosResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedReadTodosArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    statusFilter: msg.statusFilter,
    idFilter: msg.idFilter
  };
}
function fromRedactedReadTodosArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadTodosArgs({
    statusFilter: msg.statusFilter,
    idFilter: msg.idFilter
  });
}
function toRedactedReadTodosResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedReadTodosResult_result(msg.result, privacyMode)
  };
}
function toRedactedReadTodosResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedReadTodosSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedReadTodosError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedReadTodosResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadTodosResult({
    result: fromRedactedReadTodosResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedReadTodosResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedReadTodosSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedReadTodosError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedReadTodosSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    todos: msg.todos.map((v2) => toRedactedTodoItem(v2, privacyMode)),
    totalCount: msg.totalCount
  };
}
function fromRedactedReadTodosSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadTodosSuccess({
    todos: msg.todos.map((v2) => fromRedactedTodoItem(v2, purpose, opts)),
    totalCount: msg.totalCount
  });
}
function toRedactedReadTodosError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedReadTodosError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadTodosError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

