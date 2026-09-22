/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/webauthn/webauthn-gateway.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_v4();

// @recovered-fragment 2/2
var GATEWAY_WEBAUTHN_REQUESTS_PATH = "/webauthn/requests";
var GATEWAY_WEBAUTHN_RESPONSES_PATH = "/webauthn/responses";
var SAND_NO_WEBAUTHN_MACHINE_MESSAGE = "Your computer isn't connected right now, so the security key can't be reached. Open Grok Bot on the machine your key is plugged into and try again.";
var SAND_WEBAUTHN_MACHINE_UNAVAILABLE_MESSAGE = "Your computer looks disconnected, so the security key can't be reached. Reconnect it and try again.";
var SAND_WEBAUTHN_HEARTBEAT_INTERVAL_MS = 1e4;
var SAND_WEBAUTHN_LIVENESS_WINDOW_MS = 3e4;
var SAND_WEBAUTHN_MISSED_HEARTBEATS_BEFORE_RECONNECT = Math.ceil(
  SAND_WEBAUTHN_LIVENESS_WINDOW_MS / SAND_WEBAUTHN_HEARTBEAT_INTERVAL_MS
);
var SAND_WEBAUTHN_CEREMONY_TIMEOUT_MS = 12e4;
var SAND_WEB_AUTHN_CEREMONY_KINDS = ["get", "create"];
var sandWebAuthnRequestFrameSchema = discriminatedUnion("kind", [
  object({
    kind: literal("ceremony"),
    requestId: string2(),
    ceremony: object({
      kind: union([literal("get"), literal("create")]),
      origin: string2(),
      optionsJson: string2()
    })
  }),
  object({ kind: literal("cancel"), requestId: string2() }),
  object({ kind: literal("welcome"), providerId: string2() })
]);
function sandWebAuthnOriginClass(origin) {
  let hostname3;
  try {
    hostname3 = new URL(origin).hostname;
  } catch {
    return "external";
  }
  if (hostname3 === "cursor.com") {
    return "cursor_com";
  }
  return hostname3.endsWith(".cursor.com") ? "subdomain" : "external";
}
var sandWebAuthnResponseFrameSchema = union([
  object({
    kind: literal("hello"),
    computerId: string2().optional(),
    label: string2().optional()
  }),
  object({
    kind: literal("stage"),
    requestId: string2(),
    stage: literal("grant"),
    outcome: union([literal("ok"), literal("declined"), literal("failed")])
  }),
  object({
    kind: literal("stage"),
    requestId: string2(),
    stage: literal("sign"),
    outcome: union([literal("ok"), literal("failed")])
  }),
  object({ kind: literal("result"), requestId: string2(), credentialJson: string2() }),
  object({
    kind: literal("error"),
    requestId: string2(),
    name: string2(),
    message: string2(),
    code: string2().optional()
  }),
  object({ kind: literal("ping") })
]);
var KNOWN_RESPONSE_FRAME_KINDS = /* @__PURE__ */ new Set(["hello", "stage", "result", "error", "ping"]);
var sandWebAuthnResponseBatchSchema = object({
  providerId: string2().optional(),
  frames: array(unknown()).transform((frames, ctx) => {
    const known = [];
    for (const [index, frame] of frames.entries()) {
      if (hasUnknownKind(frame, KNOWN_RESPONSE_FRAME_KINDS)) continue;
      const result = sandWebAuthnResponseFrameSchema.safeParse(frame);
      if (!result.success) {
        ctx.addIssue({
          code: ZodIssueCode2.custom,
          path: [index],
          message: describeZodIssues(result.error)
        });
        continue;
      }
      known.push(result.data);
    }
    return known;
  })
});
function parseSandWebAuthnResponseBatch(u2) {
  const result = sandWebAuthnResponseBatchSchema.safeParse(u2);
  if (!result.success) {
    throw new SandWireParseError(`webauthn response batch: ${describeZodIssues(result.error)}`);
  }
  return result.data;
}

