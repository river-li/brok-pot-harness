function sandBoxStoreTransportOptions(deps) {
  return {
    backend: deps.backend,
    getAccessToken: deps.getAccessToken,
    getMachineId: deps.getMachineId,
    getTeamId: deps.getTeamId
  };
}
function createSandBoxStoreServiceClient(deps) {
  return createPromiseClient(
    GrokBotService,
    createSandBackendTransport(sandBoxStoreTransportOptions(deps))
  );
}
var PREFETCHED_READ_FRESHNESS_MARGIN_MS = 3e4;
var fencedManifestWriterEnvelopeSchema = external_exports.object({
  header: external_exports.object({ writer: external_exports.string(), epoch: external_exports.number().int() }),
  body: external_exports.string()
});
function unwrapSandBoxManifestEnvelope(bytes) {
  let parsed2;
  try {
    parsed2 = JSON.parse(Buffer.from(bytes).toString("utf8"));
  } catch {
    return bytes;
  }
  const envelope = fencedManifestWriterEnvelopeSchema.safeParse(parsed2);
  if (!envelope.success) return bytes;
  return new Uint8Array(Buffer.from(envelope.data.body, "utf8"));
}
var SandBoxStoreManifestFencedError = class extends SandBoxStoreSyncError {
  name = "SandBoxStoreManifestFencedError";
  constructor() {
    super(
      "sand-box-store manifest commit refused: this pod is not the store's writer; only a backend lifecycle takeover crowns a new writer, so the save fails and the next snapshot sweep retries"
    );
  }
};
var SAND_BOX_STORE_MULTIPART_THRESHOLD_BYTES = 64 * 1024 * 1024;
var SAND_BOX_STORE_MULTIPART_PART_SIZE_BYTES = 128 * 1024 * 1024;
var S3_MAX_SINGLE_PUT_BYTES = 5 * 1024 * 1024 * 1024;
var MULTIPART_COMPLETE_MAX_ATTEMPTS = 3;
var WORKING_STATE_NAMESPACE_PREFIX = "working-state/";
var WORKING_STATE_BLOB_KEY = /^working-state\/blobs\/([0-9a-f]{64})$/;
function assertWorkingStateContentAddressedKeyMatchesSha(key, sha2563) {
  if (key.startsWith(WORKING_STATE_NAMESPACE_PREFIX) && WORKING_STATE_BLOB_KEY.exec(key)?.[1] !== sha2563) {
    throw new SandBoxStoreBlobHashMismatchError();
  }
}
async function planSandBoxStoreMultipartParts(srcPath, sizeBytes, partSizeBytes = SAND_BOX_STORE_MULTIPART_PART_SIZE_BYTES) {
  if (sizeBytes <= 0 || !Number.isSafeInteger(sizeBytes)) {
    throw new SandBoxStoreSyncError(`multipart plan requires a positive size, got ${sizeBytes}`);
  }
  if (partSizeBytes <= 0 || !Number.isSafeInteger(partSizeBytes)) {
    throw new SandBoxStoreSyncError(
      `multipart plan requires a positive part size, got ${partSizeBytes}`
    );
  }
  const parts = [];
  const wholeHash = (0, import_node_crypto7.createHash)("sha256");
  let partHash = (0, import_node_crypto7.createHash)("sha256");
  let partStart = 0;
  let position = 0;
  const finishPart = () => {
    parts.push({
      partNumber: parts.length + 1,
      offsetBytes: partStart,
      sizeBytes: position - partStart,
      sha256: partHash.digest("hex")
    });
    partHash = (0, import_node_crypto7.createHash)("sha256");
    partStart = position;
  };
  for await (const chunk of (0, import_node_fs8.createReadStream)(srcPath)) {
    let buffer = chunk;
    while (buffer.byteLength > 0) {
      const take2 = Math.min(partStart + partSizeBytes - position, buffer.byteLength);
      const slice = buffer.subarray(0, take2);
      partHash.update(slice);
      wholeHash.update(slice);
      position += take2;
      buffer = buffer.subarray(take2);
      if (position - partStart === partSizeBytes) finishPart();
    }
  }
  if (position !== sizeBytes) {
    throw new SandBoxStoreSyncError(
      `multipart plan read ${position}B but expected ${sizeBytes}B: the file changed under the plan`
    );
  }
  if (position > partStart) finishPart();
  return { parts, wholeSha256: wholeHash.digest("hex") };
}
async function streamPutRangeFromFile(url2, headers, srcPath, offsetBytes, sizeBytes) {
  const parsedUrl = new URL(url2);
  const transport = parsedUrl.protocol === "http:" ? import_node_http2.default : import_node_https2.default;
  const body = (0, import_node_fs8.createReadStream)(srcPath, {
    start: offsetBytes,
    end: offsetBytes + sizeBytes - 1
  });
  try {
    return await new Promise((resolve29, reject2) => {
      let settled = false;
      const settle = (error41, result) => {
        if (settled) return;
        settled = true;
        if (error41 == null) resolve29(result ?? { status: 0, etag: "" });
        else reject2(error41);
      };
      const request3 = transport.request(parsedUrl, { method: "PUT", headers }, (response) => {
        response.on("error", (error41) => settle(error41));
        const rawEtag = response.headers.etag;
        const etag = typeof rawEtag === "string" ? rawEtag.replaceAll('"', "").trim() : "";
        response.resume();
        response.on("end", () => {
          settle(void 0, { status: response.statusCode ?? 0, etag });
        });
      });
      request3.on("error", (error41) => settle(error41));
      void (0, import_promises10.pipeline)(body, request3).catch((error41) => settle(error41));
    });
  } catch (error41) {
    body.destroy();
    throw error41;
  }
}
var READ_PRESIGN_BATCH_MAX = AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.pullPresignWindowSize;
var WRITE_PRESIGN_BATCH_MAX = 64;
var SandBoxStoreServiceProvider = class {
  client;
  multipartThresholdBytes;
  multipartPartSizeBytes;
  manifestCommit;
  storeInstance;
  constructor(deps) {
    this.client = deps.client ?? createSandBoxStoreServiceClient(deps);
    this.multipartThresholdBytes = deps.multipartThresholdBytes ?? SAND_BOX_STORE_MULTIPART_THRESHOLD_BYTES;
    this.multipartPartSizeBytes = deps.multipartPartSizeBytes ?? SAND_BOX_STORE_MULTIPART_PART_SIZE_BYTES;
    this.manifestCommit = deps.manifestCommit ?? false;
  }
  forStore(_storeId) {
    this.storeInstance ??= new SandBoxStoreServiceObjectStore(
      this.client,
      this.multipartThresholdBytes,
      this.multipartPartSizeBytes,
      this.manifestCommit
    );
    return this.storeInstance;
  }
};
var SandBoxStoreServiceObjectStore = class {
  constructor(client, multipartThresholdBytes, multipartPartSizeBytes, manifestCommit = false) {
    this.client = client;
    this.multipartThresholdBytes = multipartThresholdBytes;
    this.multipartPartSizeBytes = multipartPartSizeBytes;
    this.manifestCommit = manifestCommit;
    this.writePresignCoalescer = createRequestCoalescer({
      maxBatchSize: WRITE_PRESIGN_BATCH_MAX,
      run: (files) => this.presignWriteBatch(files),
      conflictKey: (file2) => file2.relPath,
      shouldSplitOnError: isInvalidArgumentConnectError
    });
  }
  client;
  multipartThresholdBytes;
  multipartPartSizeBytes;
  manifestCommit;
  sessionEtags = /* @__PURE__ */ new Map();
  prefetchedReads = /* @__PURE__ */ new Map();
  writePresignCoalescer;
  async prefetchReads(keys) {
    for (let i = 0; i < keys.length; i += READ_PRESIGN_BATCH_MAX) {
      const chunk = keys.slice(i, i + READ_PRESIGN_BATCH_MAX);
      const response = await this.client.presignSandBoxStoreReads({
        relPaths: [...chunk]
      });
      for (const instruction of response.instructions) {
        this.prefetchedReads.set(instruction.relPath, {
          url: instruction.url,
          expiresAtMs: Number(instruction.expiresAtMs)
        });
      }
    }
  }
  takePrefetchedRead(key) {
    const cached2 = this.prefetchedReads.get(key);
    if (cached2 == null) return void 0;
    this.prefetchedReads.delete(key);
    return cached2.expiresAtMs - Date.now() > PREFETCHED_READ_FRESHNESS_MARGIN_MS ? cached2 : void 0;
  }
  async presignRead(key) {
    const response = await this.client.presignSandBoxStoreReads({
      relPaths: [key]
    });
    return response.instructions[0]?.url ?? null;
  }
  async get(key) {
    const bytes = await this.getRaw(key);
    if (bytes == null || key !== BOX_STORE_MANIFEST_REL_PATH) return bytes;
    return unwrapSandBoxManifestEnvelope(bytes);
  }
  async getRaw(key) {
    const cached2 = this.takePrefetchedRead(key);
    if (cached2 != null) {
      try {
        const viaCache = await fetchAgentStoreObjectFromUrl(cached2.url, key);
        if (viaCache != null) return viaCache;
      } catch {
      }
    }
    const url2 = await this.presignRead(key);
    if (url2 == null) return null;
    return fetchAgentStoreObjectFromUrl(url2, key);
  }
  async getToFile(key, destPath, opts) {
    const cached2 = this.takePrefetchedRead(key);
    if (cached2 != null) {
      try {
        const viaCache = await fetchAgentStoreObjectToFileFromUrl(
          cached2.url,
          key,
          destPath,
          opts?.maxBytes
        );
        if (viaCache != null) return viaCache;
      } catch {
      }
    }
    const url2 = await this.presignRead(key);
    if (url2 == null) return null;
    return fetchAgentStoreObjectToFileFromUrl(url2, key, destPath, opts?.maxBytes);
  }
  async put(key, bytes, opts) {
    if (opts?.contentAddressed === true) {
      await this.putContentAddressed(key, bytes, opts.signal);
      return;
    }
    if (this.manifestCommit && key === BOX_STORE_MANIFEST_REL_PATH) {
      await this.commitManifest(key, bytes, opts?.signal);
      return;
    }
    await this.putMutable(key, bytes, opts?.signal);
  }
  async commitManifest(key, bytes, signal) {
    const { baseEtag, baselineSource } = await this.resolveMutableBaseline(key);
    const response = await this.client.commitSandBoxStoreManifest(
      { manifest: new Uint8Array(bytes), baseEtag: baseEtag ?? "" },
      { signal }
    );
    switch (response.status) {
      case SandBoxStoreManifestCommitStatus.COMMITTED: {
        const etag = response.etag.replaceAll('"', "").trim();
        if (etag.length > 0) {
          this.sessionEtags.set(key, etag);
        } else {
          this.sessionEtags.delete(key);
        }
        return;
      }
      case SandBoxStoreManifestCommitStatus.RETRY:
        this.sessionEtags.delete(key);
        throw new BoxStoreCanonicalWriteConflictError({
          key,
          conflictRelPath: null,
          baseEtag,
          baselineSource
        });
      case SandBoxStoreManifestCommitStatus.FENCED:
        this.sessionEtags.delete(key);
        throw new SandBoxStoreManifestFencedError();
      default:
        throw new SandBoxStoreSyncError(
          `sand-box-store manifest commit for ${key} returned an unknown status: ${response.status}`
        );
    }
  }
  async putContentAddressed(key, bytes, signal) {
    const sha2563 = sha256Hex(bytes);
    assertWorkingStateContentAddressedKeyMatchesSha(key, sha2563);
    const instruction = await this.presignWrite({
      relPath: key,
      sha256: sha2563,
      sizeBytes: BigInt(bytes.byteLength),
      contentAddressed: true,
      ifMatchEtag: "",
      expectAbsent: false
    });
    const putOnce = () => fetch(instruction.url, {
      method: "PUT",
      headers: { ...instruction.headers },
      body: Buffer.from(bytes),
      signal
    });
    let response = await putOnce();
    if (classifyConditionalPutStatus(response.status) === "concurrent-write") {
      response = await putOnce();
    }
    if (classifyConditionalPutStatus(response.status) === "already-stored") {
      return;
    }
    if (!response.ok) {
      throw new SandBoxStoreSyncError(`sand-box-store write failed for ${key}: ${response.status}`);
    }
  }
  async resolveMutableBaseline(key) {
    const known = this.sessionEtags.get(key);
    if (known !== void 0) {
      return { baseEtag: known, baselineSource: "session" };
    }
    const stat28 = await this.client.statSandBoxStoreObject({ relPath: key });
    if (stat28.exists) {
      if (stat28.etag.length === 0) {
        throw new SandBoxStoreSyncError(
          `sand-box-store write for ${key} has no usable baseline: the object exists but stat carried no etag`
        );
      }
      return { baseEtag: stat28.etag, baselineSource: "probe" };
    }
    return { baseEtag: null, baselineSource: "absent" };
  }
  async putMutable(key, bytes, signal) {
    const { baseEtag, baselineSource } = await this.resolveMutableBaseline(key);
    const instruction = await this.presignWrite({
      relPath: key,
      sha256: sha256Hex(bytes),
      sizeBytes: BigInt(bytes.byteLength),
      contentAddressed: false,
      ifMatchEtag: baseEtag ?? "",
      expectAbsent: baseEtag == null
    });
    const putOnce = () => fetch(instruction.url, {
      method: "PUT",
      headers: { ...instruction.headers },
      body: Buffer.from(bytes),
      signal
    });
    let response = await putOnce();
    if (response.status === 409) {
      response = await putOnce();
    }
    if (response.status === 412 || response.status === 409) {
      this.sessionEtags.delete(key);
      throw new BoxStoreCanonicalWriteConflictError({
        key,
        conflictRelPath: null,
        baseEtag,
        baselineSource
      });
    }
    if (!response.ok) {
      throw new SandBoxStoreSyncError(
        `sand-box-store write failed for ${key}: ${response.status}`,
        {
          httpStatus: response.status
        }
      );
    }
    const etag = response.headers.get("etag");
    const normalized = etag == null ? "" : etag.replaceAll('"', "").trim();
    if (normalized.length > 0) {
      this.sessionEtags.set(key, normalized);
    } else {
      this.sessionEtags.delete(key);
    }
  }
  async putFromFile(key, srcPath, sha, size) {
    assertWorkingStateContentAddressedKeyMatchesSha(key, sha);
    const multipartParts = size >= this.multipartThresholdBytes ? await this.planMultipartParts(key, srcPath, sha, size) : void 0;
    const instruction = await this.writePresignCoalescer({
      relPath: key,
      sha256: sha,
      sizeBytes: BigInt(size),
      contentAddressed: true,
      ifMatchEtag: "",
      expectAbsent: false,
      ...multipartParts !== void 0 ? { multipartParts } : {}
    });
    if (instruction.multipart != null) {
      await this.uploadMultipart(key, srcPath, instruction.multipart);
      return;
    }
    if (size > S3_MAX_SINGLE_PUT_BYTES) {
      throw new SandBoxStoreSyncError(
        `sand-box-store write for ${key} is ${size}B, over the S3 single-PUT maximum, and the backend returned no multipart instruction`
      );
    }
    const headers = {
      ...instruction.headers,
      "content-length": String(size)
    };
    let status = await streamPutFromFile(instruction.url, headers, srcPath);
    if (status === 409) {
      status = await streamPutFromFile(instruction.url, headers, srcPath);
    }
    if (status === 412) {
      return;
    }
    if (status < 200 || status >= 300) {
      throw new SandBoxStoreSyncError(`sand-box-store write failed for ${key}: ${status}`);
    }
  }
  async planMultipartParts(key, srcPath, sha, size) {
    const plan = await planSandBoxStoreMultipartParts(srcPath, size, this.multipartPartSizeBytes);
    if (plan.wholeSha256 !== sha) {
      throw new SandBoxStoreSyncError(
        `sand-box-store multipart plan for ${key} hashed ${plan.wholeSha256} but the caller expected ${sha}`
      );
    }
    return plan.parts.map((part) => ({
      partNumber: part.partNumber,
      sizeBytes: BigInt(part.sizeBytes),
      sha256: part.sha256
    }));
  }
  async uploadMultipart(key, srcPath, multipart) {
    const context2 = multipart.context;
    if (context2 == null) {
      throw new SandBoxStoreSyncError(
        `sand-box-store multipart instruction for ${key} carries no upload context`
      );
    }
    try {
      const uploaded = [];
      const parts = [...multipart.parts].sort((a, b2) => a.partNumber - b2.partNumber);
      for (const part of parts) {
        const headers = {
          ...part.headers,
          "content-length": String(part.sizeBytes)
        };
        const putPart = () => streamPutRangeFromFile(
          part.url,
          headers,
          srcPath,
          Number(part.offsetBytes),
          Number(part.sizeBytes)
        );
        let result = await putPart();
        if (result.status < 200 || result.status >= 300) {
          result = await putPart();
        }
        if (result.status < 200 || result.status >= 300) {
          throw new SandBoxStoreSyncError(
            `sand-box-store multipart part ${part.partNumber} failed for ${key}: ${result.status}`
          );
        }
        if (result.etag.length === 0) {
          throw new SandBoxStoreSyncError(
            `sand-box-store multipart part ${part.partNumber} for ${key} returned no etag`
          );
        }
        uploaded.push({ partNumber: part.partNumber, etag: result.etag });
      }
      let lastFailure = "no result";
      for (let attempt = 1; attempt <= MULTIPART_COMPLETE_MAX_ATTEMPTS; attempt++) {
        let result;
        try {
          const response = await this.client.completeSandBoxStoreMultipartWrites({
            completions: [{ context: context2, parts: uploaded }]
          });
          result = response.results[0];
        } catch (error41) {
          lastFailure = error41 instanceof Error ? error41.message : String(error41);
          continue;
        }
        if (result?.outcome.case === "success") {
          return;
        }
        const code = result?.outcome.case === "failure" ? result.outcome.value.code : void 0;
        if (code === SandBoxStoreMultipartOperationFailureCode.PRECONDITION_FAILED) {
          return;
        }
        lastFailure = code == null ? "no result" : SandBoxStoreMultipartOperationFailureCode[code];
        if (code !== SandBoxStoreMultipartOperationFailureCode.TRANSIENT) {
          break;
        }
      }
      throw new SandBoxStoreSyncError(
        `sand-box-store multipart complete failed for ${key}: ${lastFailure}`
      );
    } catch (error41) {
      await this.bestEffortAbortMultipart(context2);
      throw error41;
    }
  }
  async bestEffortAbortMultipart(context2) {
    try {
      await this.client.abortSandBoxStoreMultipartWrites({
        uploads: [{ context: context2 }]
      });
    } catch {
    }
  }
  async presignWriteBatch(files) {
    const response = await this.client.presignSandBoxStoreWrites({
      files: files.map(({ multipartParts, ...file2 }) => ({
        ...file2,
        ...multipartParts !== void 0 ? { multipartParts: multipartParts.map((part) => ({ ...part })) } : {}
      }))
    });
    return files.map((file2, index) => {
      const instruction = response.instructions[index];
      if (instruction?.relPath !== file2.relPath) {
        throw new SandBoxStoreSyncError(
          `sand-box-store presign returned ${instruction?.relPath ?? "nothing"} for ${file2.relPath}`,
          { copyInFailureCode: "presign-response-mismatch" }
        );
      }
      return instruction;
    });
  }
  async presignWrite(file2) {
    const instruction = await this.writePresignCoalescer(file2);
    return { url: instruction.url, headers: { ...instruction.headers } };
  }
  async list(prefix, opts) {
    const keys = [];
    let cursor = "";
    for (; ; ) {
      const page = await this.client.listSandBoxStoreObjects(
        {
          prefix,
          cursor,
          maxEntries: 0
        },
        { signal: opts?.signal }
      );
      const pageKeys = page.entries.map((entry) => entry.relPath);
      keys.push(...pageKeys);
      opts?.onPage?.({ keys: pageKeys });
      if (!page.truncated || page.nextCursor.length === 0) return keys;
      cursor = page.nextCursor;
    }
  }
};
