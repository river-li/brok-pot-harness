var import_node_crypto61 = require("node:crypto");
init_scheduling();
init_grok_bot_connect();
init_esm2();
init_esm3();
init_errors();
var ServerTranscriptTailDisabledError = class extends SandDomainError {
  name = "ServerTranscriptTailDisabledError";
};
var ServerTranscriptBlobReadError = class extends SandDomainError {
  name = "ServerTranscriptBlobReadError";
};
var LIST_TIMEOUT_MS = 15e3;
var PRESIGN_TIMEOUT_MS = 15e3;
var BLOB_READ_TIMEOUT_MS = 3e4;
var BLOB_KEY_PREFIX = "blobs/";
var BLOB_READ_MAX_CONCURRENT = 8;
var ACCESS_CACHE_MS = 5e3;
var blobReadDeadline = createDeadlinePolicy({
  name: "server-transcript-blob-read",
  timeoutMs: BLOB_READ_TIMEOUT_MS
});
async function fetchBlobFromUrl(url2, signal) {
  return await blobReadDeadline.run(async (deadline) => {
    const response = await fetch(url2, { signal: deadline });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new ServerTranscriptBlobReadError(`transcript blob read failed: ${response.status}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  }, signal);
}
function createServerTranscriptClient(deps) {
  const fetchBlob = deps.fetchBlob ?? fetchBlobFromUrl;
  const now = deps.now ?? (() => Date.now());
  const accessCacheMs = deps.accessCacheMs ?? ACCESS_CACHE_MS;
  let cachedAccess = null;
  let promiseClient = null;
  const resolveAccess = async () => {
    const at2 = now();
    if (cachedAccess != null && at2 - cachedAccess.at < accessCacheMs) return cachedAccess.access;
    const access5 = await deps.resolveAccess();
    cachedAccess = { access: access5, at: at2 };
    return access5;
  };
  const requireAccess = async () => {
    const access5 = await resolveAccess();
    if (!access5.enabled) {
      throw new ServerTranscriptTailDisabledError("server transcript tail is not enabled");
    }
    return access5;
  };
  const requireRouteAccess = async ({ agentId }) => {
    const access5 = await requireAccess();
    const required2 = agentId === void 0 ? (deps.requiredAgents?.size ?? 0) > 0 : deps.requiredAgents?.has(agentId) === true;
    if (access5.legacyEnabled === false && !required2) {
      throw new ServerTranscriptTailDisabledError("server transcript tail is not enabled");
    }
    return access5;
  };
  const headerInterceptor = (next) => async (req) => {
    const access5 = await requireAccess();
    for (const [name17, value] of Object.entries(access5.headers)) req.header.set(name17, value);
    if (req.header.get("x-request-id") == null) req.header.set("x-request-id", (0, import_node_crypto61.randomUUID)());
    return await next(req);
  };
  const clientFor = (access5) => {
    if (promiseClient != null && promiseClient.baseUrl === access5.baseUrl) {
      return promiseClient.client;
    }
    const transport = (deps.createTransport ?? createConnectTransport)({
      baseUrl: access5.baseUrl,
      httpVersion: "1.1",
      interceptors: [headerInterceptor]
    });
    const client = createPromiseClient(GrokBotService, transport);
    promiseClient = { baseUrl: access5.baseUrl, client };
    return client;
  };
  return {
    async isEnabled() {
      const access5 = await resolveAccess();
      return access5.enabled && access5.legacyEnabled !== false;
    },
    async *watch(request3, signal) {
      const client = clientFor(await requireRouteAccess({}));
      yield* client.watchGrokBotTranscripts(request3, { signal });
    },
    async list(request3, signal) {
      const client = clientFor(await requireRouteAccess({ agentId: request3.agentId ?? "" }));
      return await client.listGrokBotTranscriptEntries(request3, {
        timeoutMs: LIST_TIMEOUT_MS,
        ...signal === void 0 ? {} : { signal }
      });
    },
    async readBlobs(hashes, signal) {
      const bodies = /* @__PURE__ */ new Map();
      if (hashes.length === 0) return bodies;
      const client = clientFor(await requireRouteAccess({}));
      const presigned = await client.presignSandBoxStoreReads(
        { relPaths: hashes.map((hash) => `${BLOB_KEY_PREFIX}${hash}`) },
        {
          timeoutMs: PRESIGN_TIMEOUT_MS,
          ...signal === void 0 ? {} : { signal }
        }
      );
      const instructions = presigned.instructions.filter(
        (instruction) => instruction.relPath.startsWith(BLOB_KEY_PREFIX)
      );
      for (let index = 0; index < instructions.length; index += BLOB_READ_MAX_CONCURRENT) {
        const batch = instructions.slice(index, index + BLOB_READ_MAX_CONCURRENT);
        const reads = await Promise.allSettled(
          batch.map(async (instruction) => ({
            hash: instruction.relPath.slice(BLOB_KEY_PREFIX.length),
            body: await fetchBlob(instruction.url, signal)
          }))
        );
        for (const read of reads) {
          if (read.status !== "fulfilled" || read.value.body == null) continue;
          bodies.set(read.value.hash, read.value.body);
        }
      }
      return bodies;
    }
  };
}
