var __awaiter49 = function(thisArg, _arguments, P2, generator) {
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
var logger25 = createLogger("@anysphere/agent-kv:reference");
var LARGE_LAZY_REFERENCE_BLOB_BYTES = 512 * 1024;
var SLOW_LAZY_REFERENCE_DESERIALIZE_MS = 100;
var lazyReferenceCacheMiss = createCounter("agent_kv.lazy_reference.cache_miss", {
  description: "Number of large or slow LazyReference cache misses that require loading and deserializing a blob",
  labelNames: ["blob_type"]
});
var lazyReferenceDeserializeBytes = createHistogram("agent_kv.lazy_reference.deserialize_bytes", {
  description: "Blob byte size loaded on a large or slow LazyReference deserialize cache miss",
  labelNames: ["blob_type"]
});
var lazyReferenceDeserializeDuration = createHistogram("agent_kv.lazy_reference.deserialize_ms", {
  description: "Time spent deserializing a blob on a large or slow LazyReference cache miss",
  labelNames: ["blob_type"]
});
function getBlobTypeLabel(serde) {
  var _a19;
  const blobType = (_a19 = serde.getBlobType) === null || _a19 === void 0 ? void 0 : _a19.call(serde);
  if (blobType === void 0) {
    return "unknown";
  }
  switch (blobType.kind) {
    case "proto":
      return blobType.typeName;
    case "json":
      return "json";
    case "string":
      return "string";
    case "image":
      return `image:${blobType.mimeType}`;
    case "file":
      return blobType.mimeType ? `file:${blobType.mimeType}` : "file";
    default: {
      const _exhaustiveCheck = blobType;
      return _exhaustiveCheck;
    }
  }
}
var Writeable = class {
};
var EagerReference = class {
  constructor(serde, blobStore, value) {
    this.serde = serde;
    this.blobStore = blobStore;
    this.lastWrittenValue = void 0;
    this.value = value;
  }
  get(_ctx) {
    return Promise.resolve(this.value);
  }
  set(value) {
    this.value = value;
  }
  writeToBlobStore(ctx) {
    return __awaiter49(this, void 0, void 0, function* () {
      var _a19, _b2, _c2;
      if (this.value instanceof Writeable) {
        return this.value.writeToBlobStore(ctx);
      }
      if (this.value === ((_a19 = this.lastWrittenValue) === null || _a19 === void 0 ? void 0 : _a19.value)) {
        if (!isBlobDurable(this.blobStore, this.lastWrittenValue.blobId)) {
          yield this.blobStore.setBlob(ctx, this.lastWrittenValue.blobId, this.lastWrittenValue.blobData);
        }
        return this.lastWrittenValue.blobId;
      }
      const serialized = this.serde.serialize(this.value);
      const blobId = yield getBlobId(serialized);
      const onBlobMetadata = getBlobMetadataCallback(this.blobStore);
      const blobType = (_c2 = (_b2 = this.serde).getBlobType) === null || _c2 === void 0 ? void 0 : _c2.call(_b2);
      if (onBlobMetadata && blobType) {
        onBlobMetadata({ blobId, blobType });
      }
      yield this.blobStore.setBlob(ctx, blobId, serialized);
      this.lastWrittenValue = {
        value: this.value,
        blobId,
        blobData: serialized
      };
      return blobId;
    });
  }
};
var LazyReference = class {
  constructor(serde, blobStore, blobId) {
    this.serde = serde;
    this.blobStore = blobStore;
    this.blobId = blobId;
    this.valuePromise = void 0;
    this.lastWrittenValue = void 0;
    this.lastWrittenBlobData = void 0;
  }
  get(ctx) {
    return __awaiter49(this, void 0, void 0, function* () {
      if (this.valuePromise === void 0) {
        const blobType = getBlobTypeLabel(this.serde);
        this.valuePromise = this.blobStore.getBlob(ctx, this.blobId).then((blob) => {
          if (blob === void 0) {
            throw new BlobNotFoundError([toHex3(this.blobId)]);
          }
          const deserializeStart = performance.now();
          const value = this.serde.deserialize(blob);
          this.lastWrittenBlobData = blob;
          const deserializeDurationMs = performance.now() - deserializeStart;
          if (blob.byteLength >= LARGE_LAZY_REFERENCE_BLOB_BYTES || deserializeDurationMs >= SLOW_LAZY_REFERENCE_DESERIALIZE_MS) {
            lazyReferenceCacheMiss.increment(ctx, 1, { blob_type: blobType });
            lazyReferenceDeserializeBytes.histogram(ctx, blob.byteLength, {
              blob_type: blobType
            });
            lazyReferenceDeserializeDuration.histogram(ctx, deserializeDurationMs, {
              blob_type: blobType
            });
            logger25.warn(ctx, "Large lazy reference deserialize", {
              blobType,
              blobBytes: blob.byteLength,
              deserializeDurationMs
            });
          }
          return value;
        });
        this.valuePromise.then(
          (value) => {
            this.lastWrittenValue = value;
          },
          // Rejections (e.g. BlobNotFoundError) surface to the caller through
          // the returned promise; this internal bookkeeping chain must not
          // ALSO reject unhandled.
          () => {
          }
        );
      }
      return this.valuePromise;
    });
  }
  set(value) {
    this.valuePromise = Promise.resolve(value);
  }
  writeToBlobStore(ctx) {
    return __awaiter49(this, void 0, void 0, function* () {
      var _a19, _b2;
      if (this.valuePromise === void 0) {
        return this.blobId;
      }
      const value = yield this.get(ctx);
      if (value instanceof Writeable) {
        return value.writeToBlobStore(ctx);
      }
      if (value === this.lastWrittenValue) {
        if (this.lastWrittenBlobData !== void 0 && !isBlobDurable(this.blobStore, this.blobId)) {
          yield this.blobStore.setBlob(ctx, this.blobId, this.lastWrittenBlobData);
        }
        return this.blobId;
      }
      const serialized = this.serde.serialize(value);
      const blobId = yield getBlobId(serialized);
      const onBlobMetadata = getBlobMetadataCallback(this.blobStore);
      const blobType = (_b2 = (_a19 = this.serde).getBlobType) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
      if (onBlobMetadata && blobType) {
        onBlobMetadata({ blobId, blobType });
      }
      yield this.blobStore.setBlob(ctx, blobId, serialized);
      this.lastWrittenValue = value;
      this.lastWrittenBlobData = serialized;
      this.blobId = blobId;
      return blobId;
    });
  }
};
