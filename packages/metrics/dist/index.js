init_dist3();
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
function createCounter(name17, options2) {
  const handle = {
    name: name17,
    type: "counter",
    description: options2 === null || options2 === void 0 ? void 0 : options2.description,
    labelNames: options2 === null || options2 === void 0 ? void 0 : options2.labelNames
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
function createGauge(name17, options2) {
  const handle = {
    name: name17,
    type: "gauge",
    description: options2 === null || options2 === void 0 ? void 0 : options2.description,
    labelNames: options2 === null || options2 === void 0 ? void 0 : options2.labelNames
  };
  return {
    gauge: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.gauge(ctx, handle, value, labels);
    },
    record: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.record(ctx, handle, value, labels);
    }
  };
}
function createHistogram(name17, options2) {
  const handle = {
    name: name17,
    type: "histogram",
    description: options2 === null || options2 === void 0 ? void 0 : options2.description,
    labelNames: options2 === null || options2 === void 0 ? void 0 : options2.labelNames
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
