function createAgentStoreClient(deps) {
  const transport = new BcsAgentStoreTransport({
    transport: createSandBackendTransport({
      backend: deps.backend,
      getAccessToken: deps.getAccessToken,
      getMachineId: deps.getMachineId,
      getTeamId: deps.getTeamId
    }),
    rpcTimeoutMs: AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.rpcTimeoutMs
  });
  return new TokenCachingAgentStoreClient(transport, {});
}
function sandAgentStorePresignedUrlValidatorFor(backend) {
  return createAgentStorePresignedUrlValidatorForBackend(backend.backendUrl);
}
var AgentStoreMutableWriteEtags = class {
  etags = /* @__PURE__ */ new Map();
  get(sourceId, relPath) {
    return this.etags.get(`${sourceId}\0${relPath}`);
  }
  set(sourceId, relPath, etag) {
    this.etags.set(`${sourceId}\0${relPath}`, etag);
  }
  delete(sourceId, relPath) {
    this.etags.delete(`${sourceId}\0${relPath}`);
  }
};
async function presignSingleWrite(client, sourceId, file2, precondition) {
  const [presigned] = await client.presignWrites({
    agentId: sourceId,
    files: [{ ...file2, ...precondition }]
  });
  if (presigned == null) {
    throw new SandBoxStoreSyncError(`agent-store presign returned no write for ${file2.relPath}`);
  }
  return presigned;
}
function presignHasConditionalHeaders2(presigned) {
  return Object.keys(presigned.headers ?? {}).some((name17) => {
    const key = name17.toLowerCase();
    return key === "if-match" || key === "if-none-match";
  });
}
function warnIfConflictProtectionDowngraded(presigned, _relPath) {
  if (presigned.conflict != null) return;
  if (presignHasConditionalHeaders2(presigned)) return;
  reportBoxStoreDiagnostic({ extension: "box_store", kind: "conflict_protection_downgraded" });
}
function primaryPutHeaders(presigned) {
  return presigned.headers != null ? { ...presigned.headers } : { "x-amz-meta-content-sha256": presigned.sha };
}
function isConditionalWriteRejection(status) {
  return status === 412 || status === 409;
}
async function resolveMutableWriteBaseline(backend, client, sourceId, relPath, etags) {
  const known = etags.get(sourceId, relPath);
  if (known !== void 0) {
    return { precondition: { baseEtag: known }, source: "session" };
  }
  const probe = await probeAgentStoreObject({
    client,
    agentId: sourceId,
    relPath,
    fetchImpl: fetch,
    validatePresignedUrl: sandAgentStorePresignedUrlValidatorFor(backend)
  });
  if (probe.kind === "absent") {
    return { precondition: { expectAbsent: true }, source: "absent" };
  }
  return { precondition: { baseEtag: probe.etag }, source: "probe" };
}
async function putConflictObject(client, sourceId, file2, precondition, conflict, data) {
  let target = conflict;
  let response = await fetch(target.url, {
    method: "PUT",
    headers: { ...target.headers ?? {} },
    body: Buffer.from(data)
  });
  if (isConditionalWriteRejection(response.status)) {
    const fresh = await presignSingleWrite(client, sourceId, file2, precondition);
    if (fresh.conflict == null) {
      throw new SandBoxStoreSyncError(
        `agent-store conflict write for ${file2.relPath} collided and the fresh presign returned no conflict instruction`
      );
    }
    target = fresh.conflict;
    response = await fetch(target.url, {
      method: "PUT",
      headers: { ...target.headers ?? {} },
      body: Buffer.from(data)
    });
  }
  if (!response.ok) {
    throw new SandBoxStoreSyncError(
      `agent-store conflict write failed for ${file2.relPath} -> ${target.relPath}: ${response.status}`
    );
  }
  return target.relPath;
}
async function putAgentStoreObject(args) {
  const { backend, client, sourceId, relPath, data, etags } = args;
  const file2 = {
    relPath,
    sha: sha256Hex(data),
    size: data.byteLength
  };
  const { precondition, source: baselineSource } = await resolveMutableWriteBaseline(
    backend,
    client,
    sourceId,
    relPath,
    etags
  );
  const presigned = await presignSingleWrite(client, sourceId, file2, precondition);
  if (presigned.conflict == null && presignHasConditionalHeaders2(presigned)) {
    throw new SandBoxStoreSyncError(
      `agent-store presign for ${relPath} carries a conditional header but no conflict instruction`
    );
  }
  warnIfConflictProtectionDowngraded(presigned, relPath);
  const put = () => fetch(presigned.url, {
    method: "PUT",
    headers: primaryPutHeaders(presigned),
    body: Buffer.from(data)
  });
  let response = await put();
  if (response.status === 409) {
    response = await put();
  }
  if (isConditionalWriteRejection(response.status)) {
    etags.delete(sourceId, relPath);
    client.invalidateListCache?.({ agentId: sourceId });
    if (presigned.conflict == null) {
      throw new SandBoxStoreSyncError(
        `agent-store write failed for ${relPath}: ${response.status}`
      );
    }
    const conflictRelPath = await putConflictObject(
      client,
      sourceId,
      file2,
      precondition,
      presigned.conflict,
      data
    );
    reportBoxStoreDiagnostic({ extension: "box_store", kind: "write_conflict_preserved" });
    return {
      outcome: "conflict",
      conflictRelPath,
      baseEtag: "baseEtag" in precondition ? precondition.baseEtag : null,
      baselineSource
    };
  }
  if (!response.ok) {
    throw new SandBoxStoreSyncError(`agent-store write failed for ${relPath}: ${response.status}`);
  }
  const etag = normalizeS3Etag(response.headers.get("etag") ?? void 0);
  if (etag.length > 0) {
    etags.set(sourceId, relPath, etag);
  } else {
    etags.delete(sourceId, relPath);
    client.invalidateListCache?.({ agentId: sourceId });
  }
  return { outcome: "written" };
}
async function putAgentStoreObjectContentAddressed(args) {
  const { client, sourceId, relPath, data } = args;
  const presigned = await presignSingleWrite(
    client,
    sourceId,
    { relPath, sha: sha256Hex(data), size: data.byteLength },
    { expectAbsent: true }
  );
  warnIfConflictProtectionDowngraded(presigned, relPath);
  const put = () => fetch(presigned.url, {
    method: "PUT",
    headers: primaryPutHeaders(presigned),
    body: Buffer.from(data)
  });
  let response = await put();
  if (classifyConditionalPutStatus(response.status) === "concurrent-write") {
    response = await put();
  }
  if (classifyConditionalPutStatus(response.status) === "already-stored") {
    return;
  }
  if (!response.ok) {
    throw new SandBoxStoreSyncError(`agent-store write failed for ${relPath}: ${response.status}`);
  }
}
async function getAgentStoreObject(client, sourceId, relPath) {
  const [presigned] = await client.presignReads({
    agentId: sourceId,
    relPaths: [relPath]
  });
  if (presigned == null) return null;
  return fetchAgentStoreObjectFromUrl(presigned.url, relPath);
}
async function fetchAgentStoreObjectFromUrl(url2, label) {
  const response = await fetch(url2);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new SandBoxStoreSyncError(`agent-store read failed for ${label}: ${response.status}`, {
      httpStatus: response.status
    });
  }
  return new Uint8Array(await response.arrayBuffer());
}
var PRESIGN_READ_BATCH_MAX = AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.pullPresignWindowSize;
async function presignAgentStoreReadBatch(client, sourceId, relPaths) {
  const byRelPath = /* @__PURE__ */ new Map();
  for (let i = 0; i < relPaths.length; i += PRESIGN_READ_BATCH_MAX) {
    const chunk = relPaths.slice(i, i + PRESIGN_READ_BATCH_MAX);
    const presigned = await client.presignReads({
      agentId: sourceId,
      relPaths: [...chunk]
    });
    for (const instruction of presigned) {
      byRelPath.set(instruction.relPath, {
        url: instruction.url,
        expiresAtMs: instruction.expiresAtMs
      });
    }
  }
  return byRelPath;
}
async function streamPutFromFile(url2, headers, srcPath) {
  const parsedUrl = new URL(url2);
  const transport = parsedUrl.protocol === "http:" ? import_node_http.default : import_node_https.default;
  const body = (0, import_node_fs7.createReadStream)(srcPath);
  try {
    return await new Promise((resolve29, reject2) => {
      let settled = false;
      const settle = (error41, status) => {
        if (settled) return;
        settled = true;
        if (error41 == null) resolve29(status ?? 0);
        else reject2(error41);
      };
      const request3 = transport.request(parsedUrl, { method: "PUT", headers }, (response) => {
        response.on("error", (error41) => settle(error41));
        response.resume();
        response.on("end", () => {
          settle(void 0, response.statusCode ?? 0);
        });
      });
      request3.on("error", (error41) => settle(error41));
      void (0, import_promises9.pipeline)(body, request3).catch((error41) => settle(error41));
    });
  } catch (error41) {
    body.destroy();
    throw error41;
  }
}
async function putAgentStoreObjectFromFile(args) {
  const { client, sourceId, relPath, srcPath, sha, size } = args;
  const presigned = await presignSingleWrite(
    client,
    sourceId,
    { relPath, sha, size },
    { expectAbsent: true }
  );
  warnIfConflictProtectionDowngraded(presigned, relPath);
  const headers = {
    ...primaryPutHeaders(presigned),
    "content-length": String(size)
  };
  let status = await streamPutFromFile(presigned.url, headers, srcPath);
  if (status === 409) {
    status = await streamPutFromFile(presigned.url, headers, srcPath);
  }
  if (status === 412) {
    return;
  }
  if (status < 200 || status >= 300) {
    throw new SandBoxStoreSyncError(`agent-store write failed for ${relPath}: ${status}`);
  }
}
async function getAgentStoreObjectToFile(client, sourceId, relPath, destPath, maxBytes) {
  const [presigned] = await client.presignReads({
    agentId: sourceId,
    relPaths: [relPath]
  });
  if (presigned == null) return null;
  return fetchAgentStoreObjectToFileFromUrl(presigned.url, relPath, destPath, maxBytes);
}
async function fetchAgentStoreObjectToFileFromUrl(url2, label, destPath, maxBytes) {
  const response = await fetch(url2, { redirect: "error" });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new SandBoxStoreSyncError(`agent-store read failed for ${label}: ${response.status}`, {
      httpStatus: response.status
    });
  }
  if (response.body == null) {
    throw new SandBoxStoreSyncError(`agent-store read for ${label} returned no body`, {
      copyInFailureCode: "read-body-missing"
    });
  }
  await (0, import_promises8.mkdir)((0, import_node_path8.dirname)(destPath), { recursive: true });
  let written = 0;
  const sizeTap = new import_node_stream2.Transform({
    transform(chunk, _encoding, callback) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      written += buffer.byteLength;
      if (maxBytes != null && written > maxBytes) {
        callback(
          new SandBoxStoreSyncError(`agent-store object ${label} exceeded ${maxBytes}B`, {
            copyInFailureCode: "read-limit-exceeded"
          })
        );
        return;
      }
      callback(null, buffer);
    }
  });
  await (0, import_promises9.pipeline)(
    /*
     * The DOM lib's ReadableStream and the @types/node stream/web one that Readable.fromWeb takes are
     * not assignable to each other (TS2345: `values` and `[Symbol.asyncIterator]` missing; with
     * DOM.AsyncIterable, `getReader().closed` is Promise<void> vs Promise<undefined>), so the web
     * stream is cast; the runtime object is the same.
     * https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542
     */
    import_node_stream2.Readable.fromWeb(response.body),
    sizeTap,
    (0, import_node_fs7.createWriteStream)(destPath)
  );
  return written;
}
async function listAgentStoreObjects(client, sourceId, prefix) {
  const response = await client.listFiles({ agentId: sourceId, relPath: prefix });
  return response.files.map((file2) => file2.relPath);
}
