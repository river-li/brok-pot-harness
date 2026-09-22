/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/metrics/dist/index.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var defaultMetricsBackend = {
  record: () => {
  },
  increment: () => {
  },
  gauge: () => {
  },
  histogram: () => {
  }
};
var metricsKey = createKey(/* @__PURE__ */ Symbol("metricsBackend"), defaultMetricsBackend);
function getMetricsBackend(ctx) {
  return ctx.get(metricsKey);
}
function createCounter(name, options) {
  const handle = {
    name,
    type: "counter",
    description: options === null || options === void 0 ? void 0 : options.description,
    labelNames: options === null || options === void 0 ? void 0 : options.labelNames
  };
  return {
    increment: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.increment(ctx, handle, value !== null && value !== void 0 ? value : 1, labels);
    },
    record: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.record(ctx, handle, value, labels);
    }
  };
}
function createHistogram(name, options) {
  const handle = {
    name,
    type: "histogram",
    description: options === null || options === void 0 ? void 0 : options.description,
    labelNames: options === null || options === void 0 ? void 0 : options.labelNames
  };
  return {
    histogram: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.histogram(ctx, handle, value, labels);
    },
    record: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.record(ctx, handle, value, labels);
    }
  };
}

