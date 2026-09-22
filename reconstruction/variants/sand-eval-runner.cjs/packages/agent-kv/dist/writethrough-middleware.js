/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/writethrough-middleware.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
var __awaiter52 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
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
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __addDisposableResource29 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources29 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var logger44 = createLogger("@anysphere/agent-kv");
var writethroughGetBlobLatency = createHistogram("agent_kv.writethrough.get_blob.duration_ms", {
  description: "Duration of WritethroughBlobStore getBlob operations in milliseconds"
});
var writethroughSetBlobLatency = createHistogram("agent_kv.writethrough.set_blob.duration_ms", {
  description: "Duration of WritethroughBlobStore setBlob operations in milliseconds"
});
var writethroughFlushLatency = createHistogram("agent_kv.writethrough.flush.duration_ms", {
  description: "Duration of WritethroughBlobStore flush operations in milliseconds"
});
var WritethroughBlobStore = class {
  constructor(primaryStore, secondaryStore) {
    this.primaryStore = primaryStore;
    this.secondaryStore = secondaryStore;
  }
  getBlob(ctx, blobId) {
    return __awaiter52(this, void 0, void 0, function* () {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource29(env_1, createSpan(ctx.withName("WritethroughBlobStore.getBlob")), false);
        const startTime = performance.now();
        try {
          return yield this.primaryStore.getBlob(span.ctx, blobId);
        } finally {
          const duration3 = performance.now() - startTime;
          writethroughGetBlobLatency.histogram(ctx, duration3);
        }
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources29(env_1);
      }
    });
  }
  setBlob(ctx, blobId, blobData) {
    return __awaiter52(this, void 0, void 0, function* () {
      const env_2 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource29(env_2, createSpan(ctx.withName("WritethroughBlobStore.setBlob")), false);
        const startTime = performance.now();
        try {
          yield this.writeBothStores(span.ctx, blobId, blobData, {
            awaitSecondary: false
          });
        } finally {
          const duration3 = performance.now() - startTime;
          writethroughSetBlobLatency.histogram(ctx, duration3);
        }
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        __disposeResources29(env_2);
      }
    });
  }
  /**
   * Like setBlob, but also waits for the secondary store write before returning.
   * Use when a blob id may be read from the secondary store before the next flush.
   */
  setBlobAwaitingSecondary(ctx, blobId, blobData) {
    return __awaiter52(this, void 0, void 0, function* () {
      const env_3 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource29(env_3, createSpan(ctx.withName("WritethroughBlobStore.setBlobAwaitingSecondary")), false);
        const startTime = performance.now();
        try {
          yield this.writeBothStores(span.ctx, blobId, blobData, {
            awaitSecondary: true
          });
        } finally {
          const duration3 = performance.now() - startTime;
          writethroughSetBlobLatency.histogram(ctx, duration3);
        }
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        __disposeResources29(env_3);
      }
    });
  }
  writeBothStores(ctx, blobId, blobData, options2) {
    return __awaiter52(this, void 0, void 0, function* () {
      const primaryWritePromise = this.primaryStore.setBlob(ctx, blobId, blobData);
      const secondaryWritePromise = this.secondaryStore.setBlob(ctx, blobId, blobData).catch((error3) => {
        logger44.error(ctx, "Secondary store write failed in WritethroughBlobStore", error3);
      });
      yield primaryWritePromise;
      if (options2.awaitSecondary) {
        yield secondaryWritePromise;
        yield this.secondaryStore.flush(ctx).catch((error3) => {
          logger44.error(ctx, "Secondary store flush failed in WritethroughBlobStore.setBlobAwaitingSecondary", error3);
        });
      } else {
        void secondaryWritePromise;
      }
    });
  }
  setBlobLocallyOnly(ctx, blobId, blobData) {
    return __awaiter52(this, void 0, void 0, function* () {
      const env_4 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource29(env_4, createSpan(ctx.withName("WritethroughBlobStore.setBlobLocallyOnly")), false);
        return this.setBlob(span.ctx, blobId, blobData);
      } catch (e_4) {
        env_4.error = e_4;
        env_4.hasError = true;
      } finally {
        __disposeResources29(env_4);
      }
    });
  }
  flush(ctx) {
    return __awaiter52(this, void 0, void 0, function* () {
      const env_5 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource29(env_5, createSpan(ctx.withName("WritethroughBlobStore.flush")), false);
        const startTime = performance.now();
        try {
          const primaryFlushPromise = this.primaryStore.flush(span.ctx);
          const secondaryFlushPromise = this.secondaryStore.flush(span.ctx).catch((error3) => {
            logger44.error(span.ctx, "Secondary store flush failed in WritethroughBlobStore", error3);
          });
          yield primaryFlushPromise;
          void secondaryFlushPromise;
        } finally {
          const duration3 = performance.now() - startTime;
          writethroughFlushLatency.histogram(ctx, duration3);
        }
      } catch (e_5) {
        env_5.error = e_5;
        env_5.hasError = true;
      } finally {
        __disposeResources29(env_5);
      }
    });
  }
  isBlobDurable(blobId) {
    var _a20, _b2;
    var _c2;
    return (_c2 = (_b2 = (_a20 = this.primaryStore).isBlobDurable) === null || _b2 === void 0 ? void 0 : _b2.call(_a20, blobId)) !== null && _c2 !== void 0 ? _c2 : true;
  }
};

