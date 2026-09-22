/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/web-bot-auth-signed-lookup.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs100 = require("node:fs");
init_zod();
var webBotAuthSignedCacheSchema = external_exports.record(
  external_exports.object({
    signed: external_exports.boolean(),
    atMs: external_exports.number().finite(),
    source: external_exports.string().optional()
  })
).transform((entries) => new Map(Object.entries(entries)));
function parseWebBotAuthSignedCache(raw) {
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return void 0;
  }
  const cache3 = webBotAuthSignedCacheSchema.safeParse(parsed2);
  return cache3.success ? cache3.data : void 0;
}
function narrowSignatureSource(source) {
  for (const known of WEB_BOT_AUTH_SIGNATURE_SOURCES) {
    if (source === known) return known;
  }
  return void 0;
}
function lookupWebBotAuthSignedDetail(origin, options2 = {}) {
  if (origin.length === 0) return void 0;
  let raw;
  try {
    raw = (options2.readFile ?? readCacheFile)(options2.path ?? WEB_BOT_AUTH_SIGNED_CACHE_PATH);
  } catch {
    return void 0;
  }
  const entry = parseWebBotAuthSignedCache(raw)?.get(origin);
  if (entry === void 0) return void 0;
  const nowMs2 = options2.nowMs ?? Date.now();
  const ttlMs = options2.ttlMs ?? WEB_BOT_AUTH_SIGNED_TTL_MS;
  if (nowMs2 - entry.atMs > ttlMs) return void 0;
  const source = narrowSignatureSource(entry.source);
  return source === void 0 ? { signed: entry.signed } : { signed: entry.signed, source };
}
function readCacheFile(path31) {
  return (0, import_node_fs100.readFileSync)(path31, "utf8");
}

