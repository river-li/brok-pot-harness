/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/send_message_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_send_message_tool_pb();
function toRedactedSendMessageText(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode)
  };
}
function fromRedactedSendMessageText(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendMessageText({
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendMessageAttachment(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    url: createRedactedString(msg.url, DataClassification.PATH, "url", privacyMode),
    alt: msg.alt !== void 0 ? createRedactedString(msg.alt, DataClassification.CODE, "alt", privacyMode) : void 0
  };
}
function fromRedactedSendMessageAttachment(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendMessageAttachment({
    url: msg.url.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    alt: msg.alt?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendMessageArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: toRedactedSendMessageArgs_message(msg.message, privacyMode)
  };
}
function toRedactedSendMessageArgs_message(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "text":
      return { case: "text", value: toRedactedSendMessageText(oneof.value, privacyMode) };
    case "attachment":
      return { case: "attachment", value: toRedactedSendMessageAttachment(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSendMessageArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendMessageArgs({
    message: fromRedactedSendMessageArgs_message(msg.message, purpose, opts)
  });
}
function fromRedactedSendMessageArgs_message(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "text":
      return { case: "text", value: fromRedactedSendMessageText(oneof.value, purpose, opts) };
    case "attachment":
      return { case: "attachment", value: fromRedactedSendMessageAttachment(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSendMessageSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    timestamp: msg.timestamp,
    messageId: msg.messageId
  };
}
function fromRedactedSendMessageSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendMessageSuccess({
    timestamp: msg.timestamp,
    messageId: msg.messageId
  });
}
function toRedactedSendMessageError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedSendMessageError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendMessageError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendMessageResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedSendMessageResult_result(msg.result, privacyMode)
  };
}
function toRedactedSendMessageResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedSendMessageSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedSendMessageError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSendMessageResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendMessageResult({
    result: fromRedactedSendMessageResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedSendMessageResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedSendMessageSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedSendMessageError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSendMessageToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedSendMessageArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedSendMessageResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedSendMessageToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendMessageToolCall({
    args: msg.args !== void 0 ? fromRedactedSendMessageArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedSendMessageResult(msg.result, purpose, opts) : void 0
  });
}

