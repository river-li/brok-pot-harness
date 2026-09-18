var __awaiter46 = function(thisArg, _arguments, P2, generator) {
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
var BLOB_METADATA_CALLBACK_SYMBOL = /* @__PURE__ */ Symbol.for("anysphere.blobMetadataCallback");
function getBlobMetadataCallback(blobStore) {
  if (BLOB_METADATA_CALLBACK_SYMBOL in blobStore) {
    return blobStore[BLOB_METADATA_CALLBACK_SYMBOL];
  }
  return void 0;
}
function unwrapBlobStore(blobStore) {
  if (blobStore instanceof TypedBlobStore) {
    return unwrapBlobStore(blobStore.getInnerBlobStore());
  }
  return blobStore;
}
function isWritethroughBlobStore(blobStore) {
  return blobStore instanceof WritethroughBlobStore || typeof blobStore.setBlobAwaitingSecondary === "function";
}
function setBlobReadableFromCloudMirror(options2) {
  return __awaiter46(this, void 0, void 0, function* () {
    const target = unwrapBlobStore(options2.blobStore);
    if (isWritethroughBlobStore(target)) {
      yield target.setBlobAwaitingSecondary(options2.ctx, options2.blobId, options2.blobData);
      return;
    }
    yield options2.blobStore.setBlob(options2.ctx, options2.blobId, options2.blobData);
    yield options2.blobStore.flush(options2.ctx);
  });
}
var TypedBlobStore = class {
  constructor(inner, onBlobMetadata) {
    this.inner = inner;
    this[BLOB_METADATA_CALLBACK_SYMBOL] = onBlobMetadata;
  }
  getInnerBlobStore() {
    return this.inner;
  }
  // Forward all standard BlobStore methods to the inner store
  getBlob(ctx, blobId) {
    return __awaiter46(this, void 0, void 0, function* () {
      return this.inner.getBlob(ctx, blobId);
    });
  }
  setBlob(ctx, blobId, blobData) {
    return __awaiter46(this, void 0, void 0, function* () {
      return this.inner.setBlob(ctx, blobId, blobData);
    });
  }
  setBlobLocallyOnly(ctx, blobId, blobData) {
    return __awaiter46(this, void 0, void 0, function* () {
      return this.inner.setBlobLocallyOnly(ctx, blobId, blobData);
    });
  }
  flush(ctx) {
    return __awaiter46(this, void 0, void 0, function* () {
      return this.inner.flush(ctx);
    });
  }
  isBlobDurable(blobId) {
    var _a19, _b2;
    var _c2;
    return (_c2 = (_b2 = (_a19 = this.inner).isBlobDurable) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, blobId)) !== null && _c2 !== void 0 ? _c2 : true;
  }
};
