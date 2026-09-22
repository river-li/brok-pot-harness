/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/blob-store.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter43 = function(thisArg, _arguments, P2, generator) {
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
function isBlobDurable(blobStore, blobId) {
  var _a19;
  var _b2;
  return (_b2 = (_a19 = blobStore.isBlobDurable) === null || _a19 === void 0 ? void 0 : _a19.call(blobStore, blobId)) !== null && _b2 !== void 0 ? _b2 : true;
}
function toUint8Array2(b2) {
  const buffer = b2.buffer;
  if (typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer)
    return new Uint8Array(b2);
  return new Uint8Array(buffer, b2.byteOffset, b2.byteLength);
}
function getBlobId(blobData) {
  return __awaiter43(this, void 0, void 0, function* () {
    const hash = yield crypto.subtle.digest("SHA-256", toUint8Array2(blobData));
    return new Uint8Array(hash);
  });
}
var inMemoryGetBlobLatency = createHistogram("agent_kv.in_memory.get_blob.duration_ms", {
  description: "Duration of InMemoryBlobStore getBlob operations in milliseconds"
});
var inMemorySetBlobLatency = createHistogram("agent_kv.in_memory.set_blob.duration_ms", {
  description: "Duration of InMemoryBlobStore setBlob operations in milliseconds"
});
var InMemoryBlobStore = class {
  constructor() {
    this.blobs = /* @__PURE__ */ new Map();
  }
  getBlob(ctx, blobId) {
    const startTime = performance.now();
    try {
      const blob = this.blobs.get(toHex3(blobId));
      return Promise.resolve(blob);
    } finally {
      const duration3 = performance.now() - startTime;
      inMemoryGetBlobLatency.histogram(ctx, duration3);
    }
  }
  setBlob(ctx, blobId, blobData) {
    const startTime = performance.now();
    try {
      this.blobs.set(toHex3(blobId), blobData);
      return Promise.resolve();
    } finally {
      const duration3 = performance.now() - startTime;
      inMemorySetBlobLatency.histogram(ctx, duration3);
    }
  }
  setBlobLocallyOnly(ctx, blobId, blobData) {
    return this.setBlob(ctx, blobId, blobData);
  }
  flush(_ctx) {
    return Promise.resolve();
  }
};

