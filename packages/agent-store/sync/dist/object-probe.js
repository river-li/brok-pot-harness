/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/object-probe.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter6 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function probeAgentStoreObject(args) {
  return __awaiter6(this, void 0, void 0, function* () {
    var _a19, _b2;
    var _c2, _d, _e2;
    const runPresign = (_c2 = args.runPresign) !== null && _c2 !== void 0 ? _c2 : ((fn) => __awaiter6(this, void 0, void 0, function* () {
      return fn();
    }));
    const runS3 = (_d = args.runS3) !== null && _d !== void 0 ? _d : ((fn) => __awaiter6(this, void 0, void 0, function* () {
      return fn();
    }));
    const [presigned] = yield runPresign(() => args.client.presignReads({
      agentId: args.agentId,
      relPaths: [args.relPath],
      signal: args.signal
    }));
    if (presigned === void 0) {
      throw new Error(`agent-store baseline probe returned no read for ${args.relPath}`);
    }
    let canonicalRequested;
    let canonicalPresignPath;
    try {
      canonicalRequested = normalizeRelPath(args.relPath);
      canonicalPresignPath = normalizeRelPath(presigned.relPath);
    } catch (error42) {
      throw new Error(`agent-store baseline probe relPath mismatch for ${args.relPath}: ${error42 instanceof Error ? error42.message : String(error42)}`);
    }
    if (canonicalPresignPath !== canonicalRequested) {
      throw new Error(`agent-store baseline probe relPath mismatch for ${args.relPath} (got ${presigned.relPath})`);
    }
    assertPresignedUrlSafe({
      rawUrl: presigned.url,
      relPath: args.relPath,
      validatePresignedUrl: args.validatePresignedUrl
    });
    const probe = (range2) => __awaiter6(this, void 0, void 0, function* () {
      return args.fetchImpl(presigned.url, Object.assign(Object.assign({
        // Same redirect hardening as sync-engine downloads/uploads.
        redirect: "error"
      }, args.signal !== void 0 ? { signal: args.signal } : {}), range2 ? { headers: { Range: "bytes=0-0" } } : {}));
    });
    let response = yield runS3(() => probe(true));
    if (response.status === 416) {
      yield (_a19 = response.body) === null || _a19 === void 0 ? void 0 : _a19.cancel();
      response = yield runS3(() => probe(false));
    }
    try {
      if (response.status === 404) {
        return { kind: "absent" };
      }
      if (response.status !== 200 && response.status !== 206) {
        throw new Error(`agent-store baseline probe failed for ${args.relPath}: ${response.status}`);
      }
      const etag = normalizeS3Etag((_e2 = response.headers.get("etag")) !== null && _e2 !== void 0 ? _e2 : void 0);
      if (etag.length === 0) {
        throw new Error(`agent-store baseline probe for ${args.relPath} returned no usable etag`);
      }
      return { kind: "exists", etag };
    } finally {
      yield (_b2 = response.body) === null || _b2 === void 0 ? void 0 : _b2.cancel();
    }
  });
}

