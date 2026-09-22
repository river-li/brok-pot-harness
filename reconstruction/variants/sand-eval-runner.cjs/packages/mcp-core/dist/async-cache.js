/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/async-cache.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter25, AsyncCache;
var init_async_cache = __esm({
  "../packages/mcp-core/dist/async-cache.js"() {
    "use strict";
    __awaiter25 = function(thisArg, _arguments, P2, generator) {
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
    AsyncCache = class {
      constructor(ttl = 1e3 * 60 * 60 * 24) {
        this.ttl = ttl;
        this.staleDirty = false;
        this.refreshGeneration = 0;
      }
      get(fetcher) {
        return __awaiter25(this, void 0, void 0, function* () {
          const now = performance.now();
          if (this.state && this.state.expiresAt > now && !this.staleDirty) {
            return this.state.value;
          }
          if (this.staleDirty && this.state) {
            const staleValue = this.state.value;
            if (!this.refreshInFlight) {
              const gen = this.refreshGeneration;
              let refreshPromise;
              refreshPromise = (() => __awaiter25(this, void 0, void 0, function* () {
                try {
                  const value2 = yield fetcher();
                  if (gen !== this.refreshGeneration) {
                    return;
                  }
                  this.state = { expiresAt: performance.now() + this.ttl, value: value2 };
                  this.staleDirty = false;
                } catch (_a20) {
                } finally {
                  if (refreshPromise && this.refreshInFlight === refreshPromise) {
                    this.refreshInFlight = void 0;
                  }
                }
              }))();
              this.refreshInFlight = refreshPromise;
            }
            return staleValue;
          }
          const value = yield fetcher();
          this.state = { expiresAt: performance.now() + this.ttl, value };
          this.staleDirty = false;
          return value;
        });
      }
      invalidate() {
        this.refreshGeneration++;
        this.state = void 0;
        this.staleDirty = false;
        this.refreshInFlight = void 0;
      }
      /**
       * Mark the cache stale but keep the last resolved value visible.
       * The next `get` returns that value immediately and kicks off a single in-flight refresh.
       * No-op if there is no cached value.
       */
      invalidateKeepingStale() {
        if (!this.state) {
          return;
        }
        this.staleDirty = true;
      }
    };
  }
});

