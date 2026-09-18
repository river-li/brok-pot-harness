init_dist3();
var __awaiter44 = function(thisArg, _arguments, P2, generator) {
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
var logger22 = createLogger("@anysphere/agent-kv");
var cachedGetBlobLatency = createHistogram("agent_kv.cached.get_blob.duration_ms", {
  description: "Duration of CachedBlobStore getBlob operations in milliseconds"
});
var cachedSetBlobLatency = createHistogram("agent_kv.cached.set_blob.duration_ms", {
  description: "Duration of CachedBlobStore setBlob operations in milliseconds"
});
var cachedFlushLatency = createHistogram("agent_kv.cached.flush.duration_ms", {
  description: "Duration of CachedBlobStore flush operations in milliseconds"
});
var cachedCacheBytes = createHistogram("agent_kv.cached.cache_bytes", {
  description: "Resident bytes held in the CachedBlobStore in-memory cache, sampled on flush"
});
var cachedGetBlobResults = createCounter("agent_kv.cached.get_blob.results", {
  description: "Number of CachedBlobStore getBlob operations by cache result type",
  labelNames: ["cache_type"]
});
var cachedNearbyDecryptErrors = createCounter("agent_kv.nearby.decrypt_errors", {
  description: "Number of nearby blob reads that found ciphertext but failed to decrypt it (wrong encryption key)"
});
var cachedNearbyDecryptFallbackSuccess = createCounter("agent_kv.nearby.decrypt_fallback_success", {
  description: "Number of nearby blob reads where the primary encryption key failed but the fallback key decrypted the blob"
});
var encryptedGetBlobLatency = createHistogram("agent_kv.encrypted.get_blob.duration_ms", {
  description: "Duration of EncryptedBlobStore getBlob operations in milliseconds"
});
var encryptedSetBlobLatency = createHistogram("agent_kv.encrypted.set_blob.duration_ms", {
  description: "Duration of EncryptedBlobStore setBlob operations in milliseconds"
});
var NearbyBlobDecryptError = class extends Error {
  constructor(cause) {
    super("Failed to decrypt nearby blob (encryption key mismatch)", {
      cause
    });
    this.name = "NearbyBlobDecryptError";
  }
};
var EncryptedBlobStore = class _EncryptedBlobStore {
  /**
   * @param fallbackDecryptKeyStr Decrypt-only fallback tried when the primary
   * key fails on a read (see CachedBlobStoreOptions.nearbyFallbackDecryptKey).
   * Never used for writes.
   */
  constructor(blobStore, encryptionKeyStr, fallbackDecryptKeyStr = null) {
    this.blobStore = blobStore;
    this.encryptionKeyStr = encryptionKeyStr;
    this.fallbackDecryptKeyStr = fallbackDecryptKeyStr;
  }
  static deriveKey(keyStr) {
    return __awaiter44(this, void 0, void 0, function* () {
      const encoder2 = new TextEncoder();
      const keyMaterial = encoder2.encode(keyStr);
      const keyHash = yield crypto.subtle.digest("SHA-256", keyMaterial);
      return crypto.subtle.importKey("raw", keyHash, { name: _EncryptedBlobStore.ALGORITHM, length: 256 }, true, ["encrypt", "decrypt"]);
    });
  }
  getEncryptionKey() {
    return __awaiter44(this, void 0, void 0, function* () {
      if (this.encryptionKey === void 0) {
        this.encryptionKey = yield _EncryptedBlobStore.deriveKey(this.encryptionKeyStr);
      }
      return this.encryptionKey;
    });
  }
  getFallbackDecryptKey() {
    return __awaiter44(this, void 0, void 0, function* () {
      if (this.fallbackDecryptKeyStr === null) {
        return null;
      }
      if (this.fallbackDecryptKey === void 0) {
        this.fallbackDecryptKey = yield _EncryptedBlobStore.deriveKey(this.fallbackDecryptKeyStr);
      }
      return this.fallbackDecryptKey;
    });
  }
  getBlob(ctx, blobId) {
    return __awaiter44(this, void 0, void 0, function* () {
      const startTime = performance.now();
      try {
        const encryptedValue = yield this.blobStore.getBlob(ctx, blobId);
        if (encryptedValue === void 0) {
          return void 0;
        }
        const iv = encryptedValue.slice(0, _EncryptedBlobStore.IV_LENGTH);
        const ciphertext = encryptedValue.slice(_EncryptedBlobStore.IV_LENGTH);
        let decryptedValue;
        try {
          decryptedValue = yield crypto.subtle.decrypt({ name: _EncryptedBlobStore.ALGORITHM, iv }, yield this.getEncryptionKey(), ciphertext);
        } catch (primaryError) {
          const fallbackKey = yield this.getFallbackDecryptKey();
          if (fallbackKey === null) {
            throw new NearbyBlobDecryptError(primaryError);
          }
          try {
            decryptedValue = yield crypto.subtle.decrypt({ name: _EncryptedBlobStore.ALGORITHM, iv }, fallbackKey, ciphertext);
            cachedNearbyDecryptFallbackSuccess.increment(ctx, 1);
          } catch (_a19) {
            throw new NearbyBlobDecryptError(primaryError);
          }
        }
        return new Uint8Array(decryptedValue);
      } finally {
        const duration3 = performance.now() - startTime;
        encryptedGetBlobLatency.histogram(ctx, duration3);
      }
    });
  }
  encryptBlob(blobData) {
    return __awaiter44(this, void 0, void 0, function* () {
      const iv = crypto.getRandomValues(new Uint8Array(_EncryptedBlobStore.IV_LENGTH));
      const encryptedValue = yield crypto.subtle.encrypt({ name: _EncryptedBlobStore.ALGORITHM, iv }, yield this.getEncryptionKey(), toUint8Array2(blobData));
      const combined = new Uint8Array(iv.length + encryptedValue.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedValue), iv.length);
      return combined;
    });
  }
  setBlob(ctx, blobId, blobData) {
    return __awaiter44(this, void 0, void 0, function* () {
      const startTime = performance.now();
      try {
        const encryptedBlob = yield this.encryptBlob(blobData);
        yield this.blobStore.setBlob(ctx, blobId, encryptedBlob);
      } finally {
        const duration3 = performance.now() - startTime;
        encryptedSetBlobLatency.histogram(ctx, duration3);
      }
    });
  }
  setBlobLocallyOnly(ctx, blobId, blobData) {
    return __awaiter44(this, void 0, void 0, function* () {
      const startTime = performance.now();
      try {
        const encryptedBlob = yield this.encryptBlob(blobData);
        yield this.blobStore.setBlobLocallyOnly(ctx, blobId, encryptedBlob);
      } finally {
        const duration3 = performance.now() - startTime;
        encryptedSetBlobLatency.histogram(ctx, duration3);
      }
    });
  }
  flush(ctx) {
    return __awaiter44(this, void 0, void 0, function* () {
      return yield this.blobStore.flush(ctx);
    });
  }
};
EncryptedBlobStore.ALGORITHM = "AES-GCM";
EncryptedBlobStore.IV_LENGTH = 12;
