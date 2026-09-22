/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/transcript/spend-initiation.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
init_unknown_record();
var opaqueId = external_exports.string().min(1).max(256).regex(/^\S+$/);
var timestamp2 = external_exports.number().int().positive().safe();
var entrySchema = external_exports.object({
  kind: external_exports.literal("spend-initiation"),
  version: external_exports.literal(1),
  id: opaqueId,
  agentId: opaqueId,
  requestId: opaqueId,
  timestampMs: timestamp2,
  initiation: external_exports.discriminatedUnion("type", [
    external_exports.object({
      type: external_exports.literal("message"),
      id: opaqueId,
      timestampMs: timestamp2,
      initiatingMessageCount: external_exports.number().int().positive().safe().optional()
    }),
    external_exports.object({
      type: external_exports.literal("wake"),
      id: opaqueId,
      timestampMs: timestamp2,
      automationName: external_exports.string().trim().min(1).max(80).optional().catch(void 0)
    })
  ])
});
function parseSandSpendInitiationEntry(raw) {
  const parsed2 = entrySchema.safeParse(parseJsonOrUndefined(raw));
  return parsed2.success ? parsed2.data : null;
}
function createSandSpendInitiationEntry(args) {
  return {
    ...args,
    kind: entrySchema.shape.kind.value,
    version: entrySchema.shape.version.value,
    id: `spend-initiation:${args.requestId}`
  };
}

