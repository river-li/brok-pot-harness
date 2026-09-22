var ServerTranscriptTailDisabledError = class extends SandDomainError {
  name = "ServerTranscriptTailDisabledError";
};
var ServerTranscriptBlobReadError = class extends SandDomainError {
  name = "ServerTranscriptBlobReadError";
};
var BACKEND_PROBE_TIMEOUT_MS = 2e3;
var BACKEND_PROBE_ROUTE = `${GrokBotService.typeName}/${GrokBotService.methods.watchGrokBotTranscripts.name}`;
var BACKEND_UNAVAILABLE_STATUSES = /* @__PURE__ */ new Set([
  502,
  503,
  504,
  520,
  521,
  522,
  523,
  524,
  525,
  526,
  527,
  530
]);
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
var backendProbeDeadline = createDeadlinePolicy({
  name: "server-transcript-backend-probe",
  timeoutMs: BACKEND_PROBE_TIMEOUT_MS
});
async function fetchBackendRouteStatusFromUrl(url2, signal) {
  return await backendProbeDeadline.run(async (deadline) => {
    const response = await fetch(url2, { signal: deadline });
    await response.body?.cancel();
    return response.status;
  }, signal);
}
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
  const fetchBackendRouteStatus = deps.fetchBackendRouteStatus ?? fetchBackendRouteStatusFromUrl;
  const now = deps.now ?? (() => Date.now());
  const accessCacheMs = deps.accessCacheMs ?? ACCESS_CACHE_MS;
  let cachedAccess = null;
  let promiseClient = null;
  let lastBaseUrl = null;
  const resolveAccess = async () => {
    const at2 = now();
    if (cachedAccess != null && at2 - cachedAccess.at < accessCacheMs) return cachedAccess.access;
    const access5 = await deps.resolveAccess();
    cachedAccess = { access: access5, at: at2 };
    if (access5.enabled) lastBaseUrl = access5.baseUrl;
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
    const transport = (deps.createTransport ?? createSandConnectTransport)({
      baseUrl: access5.baseUrl,
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
    async probeBackend(signal) {
      if (lastBaseUrl === null) return "unknown";
      try {
        const status = await fetchBackendRouteStatus(
          `${lastBaseUrl.replace(/\/+$/, "")}/${BACKEND_PROBE_ROUTE}`,
          signal
        );
        return BACKEND_UNAVAILABLE_STATUSES.has(status) ? "down" : "up";
      } catch (error42) {
        if (signal.aborted) return "unknown";
        if (error42 instanceof TypeError || error42 instanceof DeadlineExceededError) return "down";
        throw error42;
      }
    },
    async *watch(request5, signal) {
      const client = clientFor(await requireRouteAccess({}));
      yield* client.watchGrokBotTranscripts(request5, { signal });
    },
    async list(request5, signal) {
      const client = clientFor(await requireRouteAccess({ agentId: request5.agentId ?? "" }));
      return await client.listGrokBotTranscriptEntries(request5, {
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
