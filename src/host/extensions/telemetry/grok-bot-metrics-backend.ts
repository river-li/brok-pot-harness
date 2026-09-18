init_telemetry_pb();
init_cursor_inference();
var GROK_BOT_METRICS_FLUSH_INTERVAL_MS = 3e4;
var MAX_METRIC_KEYS_PER_BUFFER = 2e3;
var MAX_DISTRIBUTION_SAMPLES_PER_KEY = 100;
var MAX_METRICS_PER_REQUEST = 1e3;
var MAX_TAG_VALUE_LENGTH = 128;
function metricKey(name17, tags) {
  const keys = Object.keys(tags);
  if (keys.length === 0) return name17;
  keys.sort();
  let key = name17;
  for (const tagKey of keys) {
    key += `|${tagKey}:${tags[tagKey]}`;
  }
  return key;
}
function reservoirSample(entry, value) {
  entry.observed += 1;
  if (entry.samples.length < MAX_DISTRIBUTION_SAMPLES_PER_KEY) {
    entry.samples.push(value);
    return;
  }
  const slot = Math.floor(Math.random() * entry.observed);
  if (slot < MAX_DISTRIBUTION_SAMPLES_PER_KEY) {
    entry.samples[slot] = value;
  }
}
var GrokBotMetricsBackend = class {
  constructor(options2) {
    this.options = options2;
    this.commonTags = {
      client: SAND_CLIENT_TYPE,
      client_version: options2.backend.clientVersion
    };
    this.polling = options2.flushPolling.start(async () => {
      await this.flush();
    });
  }
  options;
  incrementBuffer = /* @__PURE__ */ new Map();
  gaugeBuffer = /* @__PURE__ */ new Map();
  distributionBuffer = /* @__PURE__ */ new Map();
  commonTags;
  polling;
  client;
  record(ctx, metric, value, labels) {
    this.gauge(ctx, metric, value, labels);
  }
  increment(_ctx, metric, value, labels) {
    if (!this.options.isEnabled()) return;
    const tags = this.boundedTags(labels);
    const key = metricKey(metric.name, tags);
    const existing = this.incrementBuffer.get(key);
    if (existing !== void 0) {
      existing.value += value ?? 1;
      return;
    }
    if (this.incrementBuffer.size >= MAX_METRIC_KEYS_PER_BUFFER) return;
    this.incrementBuffer.set(key, { name: metric.name, tags, value: value ?? 1 });
  }
  gauge(_ctx, metric, value, labels) {
    if (!this.options.isEnabled()) return;
    const tags = this.boundedTags(labels);
    const key = metricKey(metric.name, tags);
    const existing = this.gaugeBuffer.get(key);
    if (existing !== void 0) {
      existing.value = value;
      return;
    }
    if (this.gaugeBuffer.size >= MAX_METRIC_KEYS_PER_BUFFER) return;
    this.gaugeBuffer.set(key, { name: metric.name, tags, value });
  }
  histogram(_ctx, metric, value, labels) {
    if (!this.options.isEnabled()) return;
    const tags = this.boundedTags(labels);
    const key = metricKey(metric.name, tags);
    const existing = this.distributionBuffer.get(key);
    if (existing !== void 0) {
      reservoirSample(existing, value);
      return;
    }
    if (this.distributionBuffer.size >= MAX_METRIC_KEYS_PER_BUFFER) return;
    this.distributionBuffer.set(key, {
      name: metric.name,
      tags,
      samples: [value],
      observed: 1
    });
  }
  async dispose() {
    this.polling.dispose();
    await this.flush();
  }
  boundedTags(labels) {
    const tags = { ...this.commonTags };
    if (labels === void 0) return tags;
    for (const [key, value] of Object.entries(labels)) {
      tags[key] = value.length > MAX_TAG_VALUE_LENGTH ? value.slice(0, MAX_TAG_VALUE_LENGTH) : value;
    }
    return tags;
  }
  async flush() {
    if (this.incrementBuffer.size === 0 && this.gaugeBuffer.size === 0 && this.distributionBuffer.size === 0) {
      return;
    }
    const client = this.getOrCreateClient();
    const sends = [];
    for (const request3 of drainNamedMetrics(this.incrementBuffer.values())) {
      sends.push(client.reportIncrement(request3));
    }
    this.incrementBuffer.clear();
    for (const request3 of drainNamedMetrics(this.gaugeBuffer.values())) {
      sends.push(client.reportGauge(request3));
    }
    this.gaugeBuffer.clear();
    for (const request3 of drainDistributions(this.distributionBuffer.values())) {
      sends.push(client.reportDistribution(request3));
    }
    this.distributionBuffer.clear();
    const settled = await Promise.allSettled(sends);
    for (const result of settled) {
      if (result.status === "rejected") {
        this.options.onFlushError?.(result.reason);
      }
    }
  }
  getOrCreateClient() {
    this.client ??= this.options.createClient?.() ?? createSandCursorBackendClient(MetricsService, {
      backend: this.options.backend,
      getAccessToken: this.options.getAccessToken,
      getTeamId: this.options.getTeamId,
      getMachineId: this.options.getMachineId
    });
    return this.client;
  }
};
function* drainNamedMetrics(entries) {
  let metricsList = [];
  for (const entry of entries) {
    metricsList.push(
      new ReportMetricsRequest_NamedMetric({
        name: entry.name,
        value: entry.value,
        tags: entry.tags
      })
    );
    if (metricsList.length >= MAX_METRICS_PER_REQUEST) {
      yield new ReportMetricsRequest({ metricsList });
      metricsList = [];
    }
  }
  if (metricsList.length > 0) {
    yield new ReportMetricsRequest({ metricsList });
  }
}
function* drainDistributions(entries) {
  let metricsList = [];
  for (const entry of entries) {
    for (const sample of entry.samples) {
      metricsList.push(
        new ReportMetricsRequest_NamedMetric({
          name: entry.name,
          value: sample,
          tags: entry.tags
        })
      );
    }
    if (metricsList.length >= MAX_METRICS_PER_REQUEST) {
      yield new ReportMetricsRequest({ metricsList });
      metricsList = [];
    }
  }
  if (metricsList.length > 0) {
    yield new ReportMetricsRequest({ metricsList });
  }
}
