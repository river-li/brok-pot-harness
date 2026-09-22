/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/mac-rpc-protocol.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var MacRPCProtocolError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "MacRPCProtocolError";
  }
};
var RESPONSE_MAX_BYTES = 32 * 1024 * 1024;
var serviceStateSchema = external_exports.object({
  rpcSocketPath: external_exports.string().min(1).optional(),
  appControlSocketPath: external_exports.string().min(1).optional()
}).passthrough();
var toolImageSchema = external_exports.object({
  data: external_exports.string(),
  mimeType: external_exports.string().min(1)
}).strip();
var toolResultSchema = external_exports.object({
  message: external_exports.string(),
  screenshot: toolImageSchema.optional(),
  screenshotBefore: toolImageSchema.optional(),
  structuredContent: external_exports.unknown().optional(),
  isError: external_exports.boolean()
}).strip();
var permissionStatusSchema = external_exports.object({
  accessibilityTrusted: external_exports.boolean(),
  screenRecordingGranted: external_exports.boolean()
}).strip();
var responseSchema = external_exports.union([
  external_exports.object({
    id: external_exports.number().int(),
    result: toolResultSchema,
    ok: external_exports.never().optional(),
    error: external_exports.never().optional(),
    errorCode: external_exports.never().optional(),
    permissionStatus: external_exports.never().optional(),
    sessionId: external_exports.never().optional()
  }).strip(),
  // `control/start` must precede the bare `ok` variant: the sidecar sends
  // `{ id, ok: true, sessionId }`, and the bare variant rejects `sessionId`.
  external_exports.object({
    id: external_exports.number().int(),
    sessionId: external_exports.string().min(1),
    ok: external_exports.literal(true).optional(),
    result: external_exports.never().optional(),
    error: external_exports.never().optional(),
    errorCode: external_exports.never().optional(),
    permissionStatus: external_exports.never().optional()
  }).strip(),
  external_exports.object({
    id: external_exports.number().int(),
    ok: external_exports.literal(true),
    result: external_exports.never().optional(),
    error: external_exports.never().optional(),
    errorCode: external_exports.never().optional(),
    permissionStatus: external_exports.never().optional(),
    sessionId: external_exports.never().optional()
  }).strip(),
  external_exports.object({
    id: external_exports.number().int().nullable().optional(),
    error: external_exports.string().min(1),
    errorCode: external_exports.string().min(1).optional(),
    result: external_exports.never().optional(),
    ok: external_exports.never().optional(),
    permissionStatus: external_exports.never().optional(),
    sessionId: external_exports.never().optional()
  }).strip(),
  external_exports.object({
    id: external_exports.number().int(),
    permissionStatus: permissionStatusSchema,
    result: external_exports.never().optional(),
    ok: external_exports.never().optional(),
    error: external_exports.never().optional(),
    errorCode: external_exports.never().optional(),
    sessionId: external_exports.never().optional()
  }).strip()
]);
function parseJSON(raw, description9) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new MacRPCProtocolError(`local-cua ${description9} is not valid JSON`);
  }
}
var MacRPCProtocol = {
  responseMaxBytes: RESPONSE_MAX_BYTES,
  parseServiceState(raw) {
    const parsed = serviceStateSchema.safeParse(parseJSON(raw, "service state"));
    const socketPath = parsed.success ? parsed.data.rpcSocketPath ?? parsed.data.appControlSocketPath : void 0;
    if (!parsed.success || socketPath === void 0) {
      throw new MacRPCProtocolError("local-cua service state is malformed");
    }
    return { ...parsed.data, rpcSocketPath: socketPath };
  },
  parseResponse({ line, expectedID }) {
    const parsed = responseSchema.safeParse(parseJSON(line.toString("utf8"), "RPC response"));
    if (!parsed.success) {
      throw new MacRPCProtocolError("local-cua RPC response is malformed");
    }
    if (parsed.data.id !== void 0 && parsed.data.id !== null && parsed.data.id !== expectedID) {
      throw new MacRPCProtocolError("local-cua RPC response ID did not match");
    }
    return parsed.data;
  }
};

