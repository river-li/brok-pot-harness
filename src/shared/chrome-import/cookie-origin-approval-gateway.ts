/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/chrome-import/cookie-origin-approval-gateway.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_v4();
var sandCookieOriginApprovalHelloSchema = external_exports2.object({
  kind: external_exports2.literal("hello"),
  computerId: external_exports2.string().optional(),
  label: external_exports2.string().optional()
});
var sandCookieOriginApprovalPingSchema = external_exports2.object({ kind: external_exports2.literal("ping") });
var sandCookieOriginApprovalListedSchema = external_exports2.object({
  kind: external_exports2.literal("listed"),
  requestId: external_exports2.string(),
  items: external_exports2.array(external_exports2.unknown())
});
var sandCookieOriginApprovalResolvedSchema = external_exports2.object({
  kind: external_exports2.literal("resolved"),
  requestId: external_exports2.string(),
  decision: external_exports2.enum(COOKIE_ORIGIN_APPROVAL_DECISIONS),
  grants: external_exports2.array(external_exports2.unknown()),
  cookies: external_exports2.array(external_exports2.unknown()),
  auto: external_exports2.boolean().optional(),
  items: external_exports2.array(external_exports2.unknown()).optional()
});
var sandCookieOriginApprovalFailedSchema = external_exports2.object({
  kind: external_exports2.literal("failed"),
  requestId: external_exports2.string(),
  stage: external_exports2.union([external_exports2.literal("enumerate"), external_exports2.literal("collect")]),
  errorClass: external_exports2.string(),
  decision: external_exports2.enum(COOKIE_ORIGIN_GRANTING_DECISIONS),
  grants: external_exports2.array(external_exports2.unknown()),
  auto: external_exports2.boolean().optional(),
  items: external_exports2.array(external_exports2.unknown()).optional()
});
var sandCookieOriginApprovalRefusedSchema = external_exports2.object({
  kind: external_exports2.literal("refused"),
  requestId: external_exports2.string(),
  message: external_exports2.string(),
  reason: external_exports2.unknown().optional()
});
var KNOWN_RESPONSE_FRAME_KINDS2 = /* @__PURE__ */ new Set([
  "hello",
  "listed",
  "resolved",
  "failed",
  "refused",
  "ping"
]);
function parseItems(raw) {
  const items = [];
  for (const entry of raw) {
    const item = parseCookieOriginApprovalItem(entry);
    if (item !== null) items.push(item);
  }
  return items;
}
function parseResponseFrame(raw) {
  if (hasUnknownKind(raw, KNOWN_RESPONSE_FRAME_KINDS2)) return null;
  const hello = sandCookieOriginApprovalHelloSchema.safeParse(raw);
  if (hello.success) return hello.data;
  const ping = sandCookieOriginApprovalPingSchema.safeParse(raw);
  if (ping.success) return ping.data;
  const listed = sandCookieOriginApprovalListedSchema.safeParse(raw);
  if (listed.success) {
    return {
      kind: "listed",
      requestId: listed.data.requestId,
      items: parseItems(listed.data.items)
    };
  }
  const resolved = sandCookieOriginApprovalResolvedSchema.safeParse(raw);
  if (resolved.success) {
    const cookies = [];
    for (const entry of resolved.data.cookies) {
      const cookie = parseChromeCookieRecord(entry);
      if (cookie !== null) cookies.push(cookie);
    }
    return {
      kind: "resolved",
      requestId: resolved.data.requestId,
      decision: resolved.data.decision,
      grants: parseCookieOriginGrants(resolved.data.grants),
      cookies,
      ...resolved.data.auto === void 0 ? {} : { auto: resolved.data.auto },
      ...resolved.data.items === void 0 ? {} : { items: parseItems(resolved.data.items) }
    };
  }
  const failed2 = sandCookieOriginApprovalFailedSchema.safeParse(raw);
  if (failed2.success) {
    return {
      kind: "failed",
      requestId: failed2.data.requestId,
      stage: failed2.data.stage,
      errorClass: failed2.data.errorClass,
      decision: failed2.data.decision,
      grants: parseCookieOriginGrants(failed2.data.grants),
      ...failed2.data.auto === void 0 ? {} : { auto: failed2.data.auto },
      ...failed2.data.items === void 0 ? {} : { items: parseItems(failed2.data.items) }
    };
  }
  const refused2 = sandCookieOriginApprovalRefusedSchema.safeParse(raw);
  if (refused2.success) {
    const reason = parseCookieOriginApprovalRefusalReason(refused2.data.reason);
    return {
      kind: "refused",
      requestId: refused2.data.requestId,
      message: refused2.data.message,
      ...reason === void 0 ? {} : { reason }
    };
  }
  return null;
}
var sandCookieOriginApprovalResponseBatchSchema = external_exports2.object({
  providerId: external_exports2.string().optional(),
  frames: external_exports2.array(external_exports2.unknown())
});
function parseSandCookieOriginApprovalResponseBatch(u2) {
  const result = sandCookieOriginApprovalResponseBatchSchema.safeParse(u2);
  if (!result.success) {
    throw new SandWireParseError(
      `cookie origin approval response batch: ${describeZodIssues(result.error)}`
    );
  }
  const frames = [];
  for (const frame of result.data.frames) {
    const parsed2 = parseResponseFrame(frame);
    if (parsed2 !== null) frames.push(parsed2);
  }
  return result.data.providerId === void 0 ? { frames } : { providerId: result.data.providerId, frames };
}

