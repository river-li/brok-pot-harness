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
function lookupWebBotAuthSignedDetailFromRaw(args) {
  if (args.origin.length === 0) return void 0;
  const entry = parseWebBotAuthSignedCache(args.raw)?.get(args.origin);
  if (entry === void 0) return void 0;
  const nowMs2 = args.nowMs ?? Date.now();
  const ttlMs = args.ttlMs ?? WEB_BOT_AUTH_SIGNED_TTL_MS;
  if (nowMs2 - entry.atMs > ttlMs) return void 0;
  const source = narrowSignatureSource(entry.source);
  return source === void 0 ? { signed: entry.signed } : { signed: entry.signed, source };
}
function lookupWebBotAuthSignedDetail(origin, options2 = {}) {
  let raw;
  try {
    raw = (options2.readFile ?? readCacheFile)(options2.path ?? WEB_BOT_AUTH_SIGNED_CACHE_PATH);
  } catch {
    return void 0;
  }
  return lookupWebBotAuthSignedDetailFromRaw({
    origin,
    raw,
    nowMs: options2.nowMs,
    ttlMs: options2.ttlMs
  });
}
var WEB_BOT_AUTH_SIGNED_CACHE_MAX_BYTES = 64e3;
function readWebBotAuthSignedCacheRaw(options2 = {}) {
  let raw;
  try {
    raw = (options2.readFile ?? readCacheFile)(options2.path ?? WEB_BOT_AUTH_SIGNED_CACHE_PATH);
  } catch {
    return void 0;
  }
  const maxBytes = options2.maxBytes ?? WEB_BOT_AUTH_SIGNED_CACHE_MAX_BYTES;
  return raw.length > maxBytes ? void 0 : raw;
}
function readCacheFile(path31) {
  return (0, import_node_fs25.readFileSync)(path31, "utf8");
}
