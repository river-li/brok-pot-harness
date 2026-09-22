/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/local-exec/local-exec-gateway.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_v4();

// @recovered-fragment 2/2
var SAND_NO_LOCAL_MACHINE_MESSAGE = "Your local machine isn't connected right now (the Grok Bot desktop app must be open and online to run commands on it). Try again once it's reachable.";
var COMPUTER_UNAVAILABLE_SUFFIX = "is unavailable \u2014 it looks disconnected. Reconnect it (or focus the computer you want commands to run on) and try again.";
var SAND_COMPUTER_UNAVAILABLE_MESSAGE = `Your computer ${COMPUTER_UNAVAILABLE_SUFFIX}`;
var COMPUTER_TEMPORARILY_UNREACHABLE_SUFFIX = "is temporarily unreachable. Retry the request in a moment.";
var SAND_COMPUTER_TEMPORARILY_UNREACHABLE_MESSAGE = `Your computer ${COMPUTER_TEMPORARILY_UNREACHABLE_SUFFIX}`;
var MESSAGES_UNSUPPORTED_SUFFIX = "is connected, but its Grok Bot desktop app doesn't support the Messages tools; the user needs to update the app on that computer before you try again.";
var SAND_MESSAGES_UNSUPPORTED_MESSAGE = `Your computer ${MESSAGES_UNSUPPORTED_SUFFIX}`;
var SAND_LOCAL_EXEC_UNSUPPORTED_FRAME_MESSAGE = "This computer's local-exec daemon does not understand that request frame; update the desktop app.";
var SAND_LOCAL_EXEC_UNSUPPORTED_RESULT_MESSAGE = "This computer answered with a Messages result this host could not read; the desktop app and the agent are on incompatible versions.";
var sandLocalExecRequestFrameSchema = union([
  object2({
    kind: literal("exec"),
    requestId: string2(),
    serverMessage: unknown(),
    approvalId: string2().optional()
  }),
  object2({
    kind: literal("upload"),
    requestId: string2(),
    path: string2(),
    bytesBase64: string2(),
    approvalId: string2().optional()
  }),
  object2({
    kind: literal("download"),
    requestId: string2(),
    path: string2(),
    approvalId: string2().optional()
  }),
  object2({ kind: literal("retire-approval"), requestId: string2(), approvalId: string2() }),
  object2({ kind: literal("cancel"), requestId: string2() }),
  object2({ kind: literal("welcome"), providerId: string2() }),
  object2({
    kind: literal("messages-op"),
    requestId: string2(),
    op: messagesOpSchema,
    approvalId: string2().optional()
  })
]);
var sandLocalExecResponseFrameSchema = union([
  object2({
    kind: literal("hello"),
    localRoot: string2(),
    terminalsFolder: string2(),
    computerId: string2().optional(),
    label: string2().optional(),
    supervised: boolean2().optional(),
    variant: string2().optional(),
    capabilities: object2({
      messagesOp: boolean2().optional(),
      messagesOpGeneration: number2().int().positive().optional()
    }).optional()
  }),
  object2({ kind: literal("client"), requestId: string2(), message: unknown() }),
  object2({
    kind: literal("control"),
    requestId: string2(),
    message: unknown(),
    cwdState: _enum(LOCAL_EXEC_CWD_STATES).optional()
  }),
  object2({ kind: literal("file"), requestId: string2(), bytesBase64: string2().optional() }),
  object2({ kind: literal("file-error"), requestId: string2(), error: string2() }),
  object2({
    kind: literal("messages-result"),
    requestId: string2(),
    result: messagesResultSchema2
  }),
  object2({ kind: literal("messages-error"), requestId: string2(), error: string2() }),
  object2({ kind: literal("ping"), supervised: boolean2().optional() })
]);
var KNOWN_RESPONSE_FRAME_KINDS = /* @__PURE__ */ new Set([
  "hello",
  "client",
  "control",
  "file",
  "file-error",
  "messages-result",
  "messages-error",
  "ping"
]);
function degradeInvalidResponseFrame(frame) {
  if (typeof frame !== "object" || frame === null) return void 0;
  const kind = "kind" in frame ? frame.kind : void 0;
  if (kind !== "messages-result" && kind !== "messages-error") return void 0;
  const requestId = "requestId" in frame ? frame.requestId : void 0;
  if (typeof requestId !== "string" || requestId.length === 0) return void 0;
  return {
    kind: "messages-error",
    requestId,
    error: SAND_LOCAL_EXEC_UNSUPPORTED_RESULT_MESSAGE
  };
}
var sandLocalExecResponseBatchSchema = object2({
  providerId: string2().optional(),
  frames: array(unknown()).transform((frames) => {
    const known = [];
    for (const frame of frames) {
      if (hasUnknownKind(frame, KNOWN_RESPONSE_FRAME_KINDS)) continue;
      const result = sandLocalExecResponseFrameSchema.safeParse(frame);
      if (!result.success) {
        const degraded = degradeInvalidResponseFrame(frame);
        if (degraded !== void 0) known.push(degraded);
        continue;
      }
      known.push(result.data);
    }
    return known;
  })
});

