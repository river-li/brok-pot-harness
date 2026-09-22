/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/ripwalk-cache.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist3();

// @recovered-fragment 2/2
var DEFAULT_RIPWALK_CACHE_TTL_MS = 2e4;
var RIPWALK_CACHE_TTL_ENV_VAR = "CURSOR_RIPWALK_CACHE_TTL_MS";
var ripwalkCacheTtlOverrideMs;
function getRipwalkCacheTtlMs(env = process.env) {
  if (ripwalkCacheTtlOverrideMs !== void 0) {
    return ripwalkCacheTtlOverrideMs;
  }
  const raw = env[RIPWALK_CACHE_TTL_ENV_VAR]?.trim();
  if (raw !== void 0 && raw !== "") {
    const parsed2 = Number(raw);
    if (Number.isFinite(parsed2) && parsed2 > 0) {
      return parsed2;
    }
  }
  return DEFAULT_RIPWALK_CACHE_TTL_MS;
}
function getAbortPromise(signal) {
  return new Promise((resolve29) => {
    if (signal.aborted) {
      resolve29("aborted");
      return;
    }
    signal.addEventListener("abort", () => resolve29("aborted"), {
      once: true
    });
  });
}
function getRipwalkCacheKey({ root, searchPaths = [], includeGlobs = [], excludeGlobs = [], caseSensitive = false, cursorIgnoreFiles = [], sandboxPolicy = { type: "insecure_none" }, noIgnoreVcs = false, followSymlinks = false }) {
  return JSON.stringify({
    root,
    searchPaths,
    includeGlobs,
    excludeGlobs,
    caseSensitive,
    cursorIgnoreFiles,
    sandboxPolicy,
    noIgnoreVcs,
    followSymlinks
  });
}
var RipwalkTtlCache = class {
  constructor(ttlMs = () => getRipwalkCacheTtlMs()) {
    this.cache = new TTLCache({ ttlMs });
  }
  clear() {
    this.cache.clear();
  }
  delete(options2) {
    this.cache.delete(getRipwalkCacheKey(options2));
  }
  walk(ctx, options2) {
    const cacheKey3 = getRipwalkCacheKey(options2);
    let abortResolved = false;
    let didTimeoutResolved = false;
    let resolveDidTimeout;
    const didTimeout = new Promise((resolve29) => {
      resolveDidTimeout = resolve29;
    });
    const resolveDidTimeoutOnce = (value) => {
      if (didTimeoutResolved) {
        return;
      }
      didTimeoutResolved = true;
      resolveDidTimeout(value);
    };
    const abortPromise = getAbortPromise(ctx.signal);
    const streamLines = async function* () {
      const cachedEntry = this.cache.get(cacheKey3);
      if (cachedEntry !== void 0) {
        const cachedResult = await Promise.race([
          cachedEntry.linesPromise.then((lines2) => ({ type: "lines", lines: lines2 }), (error42) => ({ type: "error", error: error42 })),
          abortPromise.then(() => ({ type: "aborted" }))
        ]);
        if (cachedResult.type === "aborted") {
          abortResolved = true;
          resolveDidTimeoutOnce(true);
          return;
        }
        if (cachedResult.type === "lines") {
          resolveDidTimeoutOnce(false);
          yield* cachedResult.lines;
          return;
        }
        if (this.cache.get(cacheKey3) === cachedEntry) {
          this.cache.delete(cacheKey3);
        }
      }
      let resolveCachedLines;
      let rejectCachedLines;
      const newEntry = {
        linesPromise: new Promise((resolve29, reject2) => {
          resolveCachedLines = resolve29;
          rejectCachedLines = reject2;
        })
      };
      newEntry.linesPromise.catch(() => {
      });
      this.cache.set(cacheKey3, newEntry);
      const collectedLines = [];
      let shouldCacheCollectedLines = false;
      let cacheFailureReason;
      try {
        const innerWalk = ripwalk(ctx, options2);
        for await (const line of innerWalk.lines) {
          collectedLines.push(line);
          yield line;
        }
        if (await innerWalk.didTimeout) {
          abortResolved = true;
          cacheFailureReason = new Error("Ripwalk aborted before cacheable result was available");
          resolveDidTimeoutOnce(true);
          return;
        }
        shouldCacheCollectedLines = true;
      } catch (error42) {
        cacheFailureReason = error42;
        throw error42;
      } finally {
        if (shouldCacheCollectedLines) {
          resolveCachedLines?.(collectedLines);
        } else {
          if (this.cache.get(cacheKey3) === newEntry) {
            this.cache.delete(cacheKey3);
          }
          rejectCachedLines?.(cacheFailureReason ?? new Error("Ripwalk terminated before cacheable result was available"));
        }
        if (!abortResolved) {
          resolveDidTimeoutOnce(false);
        }
      }
    }.bind(this);
    return {
      lines: streamLines(),
      didTimeout
    };
  }
};

