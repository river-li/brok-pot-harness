/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/request-coalescer.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createRequestCoalescer(options2) {
  const maxBatchSize = Math.max(1, Math.floor(options2.maxBatchSize));
  const queue = [];
  let draining = false;
  function takeBatch() {
    const batch = [];
    const claimed = /* @__PURE__ */ new Set();
    const deferred = [];
    while (batch.length < maxBatchSize) {
      const pending = queue.shift();
      if (pending === void 0) break;
      const key = options2.conflictKey?.(pending.request);
      if (key !== void 0 && claimed.has(key)) {
        deferred.push(pending);
        continue;
      }
      if (key !== void 0) claimed.add(key);
      batch.push(pending);
    }
    queue.unshift(...deferred);
    return batch;
  }
  async function runBatch(batch) {
    try {
      const results = await options2.run(batch.map((pending) => pending.request));
      if (results.length !== batch.length) {
        throw new SandBoxStoreSyncError(
          `Batched request returned ${results.length} results for ${batch.length} requests`
        );
      }
      batch.forEach((pending, index) => {
        pending.resolve(results[index]);
      });
    } catch (error42) {
      if (batch.length > 1 && (options2.shouldSplitOnError?.(error42) ?? false)) {
        await runIndividually(batch);
        return;
      }
      for (const pending of batch) pending.reject(error42);
    }
  }
  async function runIndividually(batch) {
    for (const pending of batch) {
      try {
        const results = await options2.run([pending.request]);
        const result = results[0];
        if (result === void 0) {
          throw new SandBoxStoreSyncError("Batched request returned no result for its request");
        }
        pending.resolve(result);
      } catch (error42) {
        pending.reject(error42);
      }
    }
  }
  async function drain() {
    if (draining) return;
    draining = true;
    try {
      while (queue.length > 0) {
        const batch = takeBatch();
        if (batch.length === 0) break;
        await runBatch(batch);
      }
    } finally {
      draining = false;
    }
  }
  return (request5) => new Promise((resolve29, reject2) => {
    queue.push({ request: request5, resolve: resolve29, reject: reject2 });
    void drain();
  });
}

