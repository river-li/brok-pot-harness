init_computer_use_tool_pb();
function toRedactedCoordinate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    x: msg.x,
    y: msg.y
  };
}
function fromRedactedCoordinate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new Coordinate({
    x: msg.x,
    y: msg.y
  });
}
function toRedactedComputerUseArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    actions: msg.actions.map((v2) => toRedactedComputerUseAction(v2, privacyMode)),
    description: msg.description !== void 0 ? createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode) : void 0,
    bindUnmappedCharacters: msg.bindUnmappedCharacters,
    desktopLeaseActorId: msg.desktopLeaseActorId
  };
}
function fromRedactedComputerUseArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ComputerUseArgs({
    toolCallId: msg.toolCallId,
    actions: msg.actions.map((v2) => fromRedactedComputerUseAction(v2, purpose, opts)),
    description: msg.description?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    bindUnmappedCharacters: msg.bindUnmappedCharacters,
    desktopLeaseActorId: msg.desktopLeaseActorId
  });
}
function toRedactedComputerUseAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    action: toRedactedComputerUseAction_action(msg.action, privacyMode)
  };
}
function toRedactedComputerUseAction_action(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "mouseMove":
      return { case: "mouseMove", value: toRedactedMouseMoveAction(oneof.value, privacyMode) };
    case "click":
      return { case: "click", value: toRedactedClickAction(oneof.value, privacyMode) };
    case "mouseDown":
      return { case: "mouseDown", value: toRedactedMouseDownAction(oneof.value, privacyMode) };
    case "mouseUp":
      return { case: "mouseUp", value: toRedactedMouseUpAction(oneof.value, privacyMode) };
    case "drag":
      return { case: "drag", value: toRedactedDragAction(oneof.value, privacyMode) };
    case "scroll":
      return { case: "scroll", value: toRedactedScrollAction(oneof.value, privacyMode) };
    case "type":
      return { case: "type", value: toRedactedTypeAction(oneof.value, privacyMode) };
    case "key":
      return { case: "key", value: toRedactedKeyAction(oneof.value, privacyMode) };
    case "wait":
      return { case: "wait", value: toRedactedWaitAction(oneof.value, privacyMode) };
    case "screenshot":
      return { case: "screenshot", value: toRedactedScreenshotAction(oneof.value, privacyMode) };
    case "cursorPosition":
      return { case: "cursorPosition", value: toRedactedCursorPositionAction(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedComputerUseAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ComputerUseAction({
    action: fromRedactedComputerUseAction_action(msg.action, purpose, opts)
  });
}
function fromRedactedComputerUseAction_action(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "mouseMove":
      return { case: "mouseMove", value: fromRedactedMouseMoveAction(oneof.value, purpose, opts) };
    case "click":
      return { case: "click", value: fromRedactedClickAction(oneof.value, purpose, opts) };
    case "mouseDown":
      return { case: "mouseDown", value: fromRedactedMouseDownAction(oneof.value, purpose, opts) };
    case "mouseUp":
      return { case: "mouseUp", value: fromRedactedMouseUpAction(oneof.value, purpose, opts) };
    case "drag":
      return { case: "drag", value: fromRedactedDragAction(oneof.value, purpose, opts) };
    case "scroll":
      return { case: "scroll", value: fromRedactedScrollAction(oneof.value, purpose, opts) };
    case "type":
      return { case: "type", value: fromRedactedTypeAction(oneof.value, purpose, opts) };
    case "key":
      return { case: "key", value: fromRedactedKeyAction(oneof.value, purpose, opts) };
    case "wait":
      return { case: "wait", value: fromRedactedWaitAction(oneof.value, purpose, opts) };
    case "screenshot":
      return { case: "screenshot", value: fromRedactedScreenshotAction(oneof.value, purpose, opts) };
    case "cursorPosition":
      return { case: "cursorPosition", value: fromRedactedCursorPositionAction(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedMouseMoveAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    coordinate: msg.coordinate !== void 0 ? toRedactedCoordinate(msg.coordinate, privacyMode) : void 0
  };
}
function fromRedactedMouseMoveAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new MouseMoveAction({
    coordinate: msg.coordinate !== void 0 ? fromRedactedCoordinate(msg.coordinate, purpose, opts) : void 0
  });
}
function toRedactedClickAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    coordinate: msg.coordinate !== void 0 ? toRedactedCoordinate(msg.coordinate, privacyMode) : void 0,
    button: msg.button,
    count: msg.count,
    modifierKeys: msg.modifierKeys
  };
}
function fromRedactedClickAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ClickAction({
    coordinate: msg.coordinate !== void 0 ? fromRedactedCoordinate(msg.coordinate, purpose, opts) : void 0,
    button: msg.button,
    count: msg.count,
    modifierKeys: msg.modifierKeys
  });
}
function toRedactedMouseDownAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    button: msg.button
  };
}
function fromRedactedMouseDownAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new MouseDownAction({
    button: msg.button
  });
}
function toRedactedMouseUpAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    button: msg.button
  };
}
function fromRedactedMouseUpAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new MouseUpAction({
    button: msg.button
  });
}
function toRedactedDragAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: msg.path.map((v2) => toRedactedCoordinate(v2, privacyMode)),
    button: msg.button,
    modifierKeys: msg.modifierKeys
  };
}
function fromRedactedDragAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DragAction({
    path: msg.path.map((v2) => fromRedactedCoordinate(v2, purpose, opts)),
    button: msg.button,
    modifierKeys: msg.modifierKeys
  });
}
function toRedactedScrollAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    coordinate: msg.coordinate !== void 0 ? toRedactedCoordinate(msg.coordinate, privacyMode) : void 0,
    direction: msg.direction,
    amount: msg.amount,
    modifierKeys: msg.modifierKeys
  };
}
function fromRedactedScrollAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ScrollAction({
    coordinate: msg.coordinate !== void 0 ? fromRedactedCoordinate(msg.coordinate, purpose, opts) : void 0,
    direction: msg.direction,
    amount: msg.amount,
    modifierKeys: msg.modifierKeys
  });
}
function toRedactedTypeAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode)
  };
}
function fromRedactedTypeAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TypeAction({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedKeyAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    key: msg.key,
    holdDurationMs: msg.holdDurationMs
  };
}
function fromRedactedKeyAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new KeyAction({
    key: msg.key,
    holdDurationMs: msg.holdDurationMs
  });
}
function toRedactedWaitAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    durationMs: msg.durationMs
  };
}
function fromRedactedWaitAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WaitAction({
    durationMs: msg.durationMs
  });
}
function toRedactedScreenshotAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedScreenshotAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ScreenshotAction({});
}
function toRedactedCursorPositionAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedCursorPositionAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorPositionAction({});
}
function toRedactedComputerUseResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedComputerUseResult_result(msg.result, privacyMode)
  };
}
function toRedactedComputerUseResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedComputerUseSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedComputerUseError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedComputerUseResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ComputerUseResult({
    result: fromRedactedComputerUseResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedComputerUseResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedComputerUseSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedComputerUseError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedComputerUseSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    actionCount: msg.actionCount,
    durationMs: msg.durationMs,
    screenshot: msg.screenshot !== void 0 ? createRedactedString(msg.screenshot, DataClassification.CODE, "screenshot", privacyMode) : void 0,
    log: msg.log !== void 0 ? createRedactedString(msg.log, DataClassification.CODE, "log", privacyMode) : void 0,
    screenshotPath: msg.screenshotPath !== void 0 ? createRedactedString(msg.screenshotPath, DataClassification.PATH, "screenshot_path", privacyMode) : void 0,
    cursorPosition: msg.cursorPosition !== void 0 ? toRedactedCoordinate(msg.cursorPosition, privacyMode) : void 0
  };
}
function fromRedactedComputerUseSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ComputerUseSuccess({
    actionCount: msg.actionCount,
    durationMs: msg.durationMs,
    screenshot: msg.screenshot?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    log: msg.log?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    screenshotPath: msg.screenshotPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    cursorPosition: msg.cursorPosition !== void 0 ? fromRedactedCoordinate(msg.cursorPosition, purpose, opts) : void 0
  });
}
function toRedactedComputerUseError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode),
    actionCount: msg.actionCount,
    durationMs: msg.durationMs,
    log: msg.log !== void 0 ? createRedactedString(msg.log, DataClassification.CODE, "log", privacyMode) : void 0,
    screenshot: msg.screenshot !== void 0 ? createRedactedString(msg.screenshot, DataClassification.CODE, "screenshot", privacyMode) : void 0,
    screenshotPath: msg.screenshotPath !== void 0 ? createRedactedString(msg.screenshotPath, DataClassification.PATH, "screenshot_path", privacyMode) : void 0
  };
}
function fromRedactedComputerUseError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ComputerUseError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    actionCount: msg.actionCount,
    durationMs: msg.durationMs,
    log: msg.log?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    screenshot: msg.screenshot?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    screenshotPath: msg.screenshotPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedComputerUseToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedComputerUseArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedComputerUseResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedComputerUseToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ComputerUseToolCall({
    args: msg.args !== void 0 ? fromRedactedComputerUseArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedComputerUseResult(msg.result, purpose, opts) : void 0
  });
}
