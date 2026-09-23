var MAX_BUFFER_SIZE = 1e3;
var STRUCTURED_LOG_SUBMIT_DEADLINE_MS = 15e3;
var DEADLINE_EXPIRY_CODE = "deadline_exceeded";
function isDeadlineExpiry(error42) {
  return typeof error42 === "object" && error42 !== null && error42.code === DEADLINE_EXPIRY_CODE;
}
function createDropCounterId() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  let result = "";
  for (const byte of bytes) {
    result += byte.toString(16).padStart(2, "0");
  }
  return result;
}
function emptyDropCounters() {
  return {
    ship_failed: { observed: 0, acknowledgedThrough: 0 },
    overflow_evicted: { observed: 0, acknowledgedThrough: 0 },
    replay_expired: { observed: 0, acknowledgedThrough: 0 },
    backend_dropped: { observed: 0, acknowledgedThrough: 0 },
    account_rotated: { observed: 0, acknowledgedThrough: 0 }
  };
}
function cloneDropCounters(counters) {
  return {
    ship_failed: { ...counters.ship_failed },
    overflow_evicted: { ...counters.overflow_evicted },
    replay_expired: { ...counters.replay_expired },
    backend_dropped: { ...counters.backend_dropped },
    account_rotated: { ...counters.account_rotated }
  };
}
function isValidLogShipReceipt(response, requestSize) {
  return Number.isSafeInteger(response.logsProcessed) && response.logsProcessed >= 0 && Number.isSafeInteger(response.logsDropped) && response.logsDropped >= 0 && response.logsProcessed + response.logsDropped === requestSize;
}
function cleanStructuredLogMetadata(metadata) {
  const result = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== void 0 && value.length > 0) {
      result[key] = value;
    }
  }
  return result;
}
function truncateStructuredLogValue(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}
function toClientLogLevel(level) {
  switch (level) {
    case "debug":
      return ClientLogLevel.DEBUG;
    case "info":
      return ClientLogLevel.INFO;
    case "warn":
      return ClientLogLevel.WARN;
    case "error":
      return ClientLogLevel.ERROR;
  }
}
var StructuredLogTransport = class {
  constructor(options2) {
    this.options = options2;
    this.platformTags = cleanStructuredLogMetadata(options2.platformTags);
    this.dropCounterId = options2.initialCheckpoint?.counterId ?? createDropCounterId();
    this.dropCounters = options2.initialCheckpoint ? cloneDropCounters(options2.initialCheckpoint.counters) : emptyDropCounters();
    this.buffer = (options2.initialCheckpoint?.records ?? []).slice(-MAX_BUFFER_SIZE).map((record2) => ({
      ...record2,
      metadata: { ...record2.metadata }
    }));
    this.flushHeldForIdentity = options2.holdForIdentity === true;
    if (options2.holdForIdentity === true) {
      this.identityHoldHandle = options2.identityHoldExpiry.arm(
        "structured-log-host-identity",
        () => this.releaseIdentityHold()
      );
    }
    this.ensurePolling();
  }
  options;
  platformTags;
  shipSchedule = new LogShipSchedule();
  dropCounterId;
  dropCounters;
  buffer = [];
  activeBatch = [];
  client;
  pollingHandle;
  identityHoldHandle;
  identityTags = {};
  isDisposed = false;
  deliveryGeneration = 0;
  requestAbortControllers = /* @__PURE__ */ new Set();
  flushHeldForIdentity;
  flushTickListener;
  flushSettledListener;
  flushChain = Promise.resolve(false);
  eagerFlushQueued = false;
  eagerDrainRequested = false;
  submitTimeoutStreakActive = false;
  setIdentityTags(tags) {
    this.identityTags = cleanStructuredLogMetadata(tags);
    this.releaseIdentityHold();
  }
  setFlushTickListener(listener) {
    this.flushTickListener = listener;
    if (listener !== void 0) {
      this.ensurePolling();
    } else if (this.options.disabled) {
      this.pollingHandle?.dispose();
      this.pollingHandle = void 0;
    }
  }
  setFlushSettledListener(listener) {
    this.flushSettledListener = listener;
  }
  enqueue(level, message, metadata, onSettled) {
    this.enqueueAt(level, message, metadata, Date.now(), onSettled);
  }
  enqueueAt(level, message, metadata, timestamp3, onSettled) {
    if (this.options.disabled || this.isDisposed) {
      onSettled?.("dropped");
      return;
    }
    this.buffer.push({
      level,
      message,
      metadata: {
        ...this.platformTags,
        ...cleanStructuredLogMetadata(metadata)
      },
      timestamp: timestamp3,
      ...onSettled !== void 0 ? { onSettled } : {}
    });
    this.dropBufferOverflow();
    if (level === "error") this.shipSchedule.shipNext();
    if (this.buffer.length >= LOG_SHIP_MAX_BATCH_ENTRIES) {
      this.eagerDrainRequested = true;
      this.queueEagerDrain();
    }
  }
  async shipConfirmed(level, message, metadata) {
    if (this.options.disabled) return true;
    if (this.isDisposed) return false;
    const generation = this.deliveryGeneration;
    const entry = this.buildLogEntry(
      level,
      message,
      {
        ...this.platformTags,
        ...cleanStructuredLogMetadata(metadata)
      },
      Date.now()
    );
    const result = await this.shipLogs([entry]);
    if (generation === this.deliveryGeneration) {
      this.recordSourceResult(result);
    }
    return result.delivered;
  }
  capturePending() {
    return [...this.activeBatch, ...this.buffer].map((record2) => ({
      ...record2,
      metadata: { ...record2.metadata }
    }));
  }
  captureCheckpoint() {
    return {
      counterId: this.dropCounterId,
      counters: cloneDropCounters(this.dropCounters),
      records: this.capturePending()
    };
  }
  recordDropped(reason, count) {
    this.recordDrop(reason, count);
  }
  clearPending() {
    this.deliveryGeneration += 1;
    for (const controller of this.requestAbortControllers) controller.abort();
    this.requestAbortControllers.clear();
    this.settle([...this.activeBatch, ...this.buffer], "dropped");
    this.activeBatch = [];
    this.buffer = [];
    this.eagerDrainRequested = false;
    this.client = void 0;
    this.dropCounterId = createDropCounterId();
    this.dropCounters = emptyDropCounters();
    this.flushChain = this.flushChain.then(
      () => false,
      () => false
    );
    return this.flushChain.then(() => void 0);
  }
  async flushNow() {
    if (this.isDisposed) {
      return this.pendingCount() === 0 && !this.hasPendingDrops();
    }
    return this.drain();
  }
  async dispose() {
    if (this.isDisposed) {
      return this.pendingCount() === 0 && !this.hasPendingDrops();
    }
    this.isDisposed = true;
    this.pollingHandle?.dispose();
    this.pollingHandle = void 0;
    this.flushHeldForIdentity = false;
    this.identityHoldHandle?.dispose();
    this.identityHoldHandle = void 0;
    const drained = await this.drain();
    if (!drained && this.options.retainUndeliveredOnDispose !== true) {
      const stranded = [...this.activeBatch, ...this.buffer];
      this.activeBatch = [];
      this.buffer = [];
      this.settle(stranded, "dropped");
    }
    return drained;
  }
  async drain() {
    while (this.pendingCount() > 0 || this.hasPendingDrops()) {
      const progressed = await this.flush();
      if (!progressed && (this.pendingCount() > 0 || this.hasPendingDrops())) {
        return false;
      }
    }
    return true;
  }
  pendingCount() {
    return this.activeBatch.length + this.buffer.length;
  }
  ensurePolling() {
    if (this.isDisposed || this.pollingHandle !== void 0 || this.options.disabled && this.flushTickListener === void 0) {
      return;
    }
    this.pollingHandle = this.options.polling.start(async () => {
      try {
        this.flushTickListener?.();
      } catch {
      }
      try {
        await this.flushIfDue(false);
      } catch (error42) {
        console.error(`[structured-log-transport] flush tick failed: ${errorLogTag(error42)}`);
      }
    });
  }
  releaseIdentityHold() {
    if (!this.flushHeldForIdentity) return;
    this.flushHeldForIdentity = false;
    this.identityHoldHandle?.dispose();
    this.identityHoldHandle = void 0;
    void this.flushIfDue(true);
  }
  async flushIfDue(eager) {
    if (this.buffer.length === 0 && !this.hasPendingDrops() || !this.shipSchedule.isDue(eager)) {
      return;
    }
    await this.flush();
    this.queueEagerDrain();
  }
  queueEagerDrain() {
    if (this.isDisposed || this.eagerFlushQueued || !this.eagerDrainRequested || this.flushHeldForIdentity || this.buffer.length === 0 || !this.shipSchedule.isDue(true)) {
      return;
    }
    this.eagerFlushQueued = true;
    void this.drainEager().finally(() => {
      this.eagerFlushQueued = false;
      this.queueEagerDrain();
    });
  }
  async drainEager() {
    while (!this.isDisposed && this.eagerDrainRequested && !this.flushHeldForIdentity && this.buffer.length > 0 && this.shipSchedule.isDue(true)) {
      await this.flush();
    }
    if (this.buffer.length === 0) {
      this.eagerDrainRequested = false;
    }
  }
  flush() {
    this.flushChain = this.flushChain.then(
      () => this.flushOnce(),
      () => this.flushOnce()
    );
    return this.flushChain;
  }
  async finishFlush(progressed) {
    await this.flushSettledListener?.();
    return progressed;
  }
  async flushOnce() {
    if (this.flushHeldForIdentity) return false;
    const generation = this.deliveryGeneration;
    if (this.buffer.length === 0) {
      const reportAttempt = await this.reportPendingDrops(generation);
      if (generation !== this.deliveryGeneration) {
        return this.finishFlush(true);
      }
      if (reportAttempt !== void 0) {
        this.shipSchedule.record(reportAttempt.result);
      }
      return this.finishFlush(reportAttempt?.acknowledged ?? false);
    }
    this.expireBufferedLogs();
    if (this.buffer.length === 0) {
      const reportAttempt = await this.reportPendingDrops(generation);
      if (generation !== this.deliveryGeneration) {
        return this.finishFlush(true);
      }
      if (reportAttempt !== void 0) {
        this.shipSchedule.record(reportAttempt.result);
      }
      return this.finishFlush(reportAttempt?.acknowledged ?? false);
    }
    const { batch, remaining } = takeLogShipBatch(this.buffer);
    this.buffer = [...remaining];
    this.activeBatch = batch;
    const logs = batch.map(
      (log5) => this.buildLogEntry(log5.level, log5.message, log5.metadata, log5.timestamp)
    );
    const result = await this.shipLogs(logs);
    if (generation !== this.deliveryGeneration) {
      this.activeBatch = [];
      return this.finishFlush(true);
    }
    if (!result.delivered) {
      this.buffer = [...batch, ...this.buffer];
      this.recordSourceResult(result);
      this.dropBufferOverflow();
      this.activeBatch = [];
      this.shipSchedule.record(result);
      return this.finishFlush(false);
    }
    this.activeBatch = [];
    this.settle(batch, "delivered");
    this.recordSourceResult(result);
    this.shipSchedule.record(result);
    await this.reportPendingDrops(generation);
    return this.finishFlush(true);
  }
  expireBufferedLogs() {
    const nowMs2 = Date.now();
    const expired = this.buffer.filter(
      (log5) => nowMs2 - log5.timestamp > STRUCTURED_LOG_REPLAY_MAX_AGE_MS
    );
    const fresh = this.buffer.filter(
      (log5) => nowMs2 - log5.timestamp <= STRUCTURED_LOG_REPLAY_MAX_AGE_MS
    );
    this.recordDrop("replay_expired", expired.length);
    this.settle(expired, "dropped");
    this.buffer = fresh;
  }
  recordDrop(reason, count) {
    if (count <= 0) return;
    const counter = this.dropCounters[reason];
    counter.observed += Math.min(count, Number.MAX_SAFE_INTEGER - counter.observed);
  }
  recordSourceResult(result) {
    if (!result.delivered) {
      this.recordDrop("ship_failed", 1);
      return;
    }
    this.recordDrop("backend_dropped", result.receipt?.logsDropped ?? 0);
  }
  hasPendingDrops() {
    return TELEMETRY_DROP_REASONS.some((reason) => {
      const counter = this.dropCounters[reason];
      return counter.observed > counter.acknowledgedThrough;
    });
  }
  snapshotPendingDrops() {
    const snapshot = [];
    for (const reason of TELEMETRY_DROP_REASONS) {
      const counter = this.dropCounters[reason];
      if (counter.observed > counter.acknowledgedThrough) {
        snapshot.push({ reason, through: counter.observed });
      }
    }
    return snapshot;
  }
  async reportPendingDrops(generation) {
    const snapshot = this.snapshotPendingDrops();
    if (snapshot.length === 0) return void 0;
    const timestampMs2 = Date.now();
    const reports = snapshot.map(
      ({ reason, through }) => this.buildLogEntry(
        "warn",
        TELEMETRY_DROPPED_EVENT,
        {
          ...this.platformTags,
          reason,
          unit: TELEMETRY_DROP_UNIT_BY_REASON[reason],
          count: String(through),
          counter_id: this.dropCounterId
        },
        timestampMs2
      )
    );
    const result = await this.shipLogs(reports);
    if (generation !== this.deliveryGeneration) {
      return { result, acknowledged: true };
    }
    if (!result.delivered || result.receipt?.logsProcessed !== reports.length || result.receipt?.logsDropped !== 0) {
      return { result, acknowledged: false };
    }
    for (const { reason, through } of snapshot) {
      const counter = this.dropCounters[reason];
      counter.acknowledgedThrough = Math.max(counter.acknowledgedThrough, through);
    }
    return { result, acknowledged: true };
  }
  dropBufferOverflow() {
    let overflow = this.buffer.length - MAX_BUFFER_SIZE;
    if (overflow <= 0) return;
    const evicted = [];
    this.buffer = this.buffer.filter((entry) => {
      if (overflow > 0 && (entry.message === HOST_LOG_EVENT || entry.message === BOX_LOG_EVENT || entry.message === DESKTOP_LOG_EVENT)) {
        overflow -= 1;
        evicted.push(entry);
        return false;
      }
      return true;
    });
    evicted.push(...this.buffer.splice(0, overflow));
    this.recordDrop("overflow_evicted", evicted.length);
    this.settle(evicted, "dropped");
  }
  settle(logs, settlement) {
    for (const log5 of logs) {
      log5.onSettled?.(settlement);
    }
  }
  buildLogEntry(level, message, metadata, timestampMs2) {
    return new ClientLogEntry({
      level: toClientLogLevel(level),
      message,
      metadata: { ...this.identityTags, ...metadata },
      timestamp: BigInt(timestampMs2),
      key: this.options.key
    });
  }
  reportSubmitTimeout(error42, batchEntries) {
    if (!isDeadlineExpiry(error42)) {
      this.submitTimeoutStreakActive = false;
      return;
    }
    if (this.submitTimeoutStreakActive) return;
    this.submitTimeoutStreakActive = true;
    this.enqueue(
      "warn",
      TELEMETRY_SHIP_TIMEOUT_EVENT,
      sandErrorTags(SandError.logShipTimeout({ batchEntries }))
    );
  }
  async shipLogs(logs) {
    if (logs.length === 0) {
      return {
        delivered: true,
        receipt: { logsProcessed: 0, logsDropped: 0 }
      };
    }
    const controller = new AbortController();
    this.requestAbortControllers.add(controller);
    let attemptedClient;
    try {
      const client = this.client ?? (this.client = this.options.createClient());
      attemptedClient = client;
      const response = await this.options.submitDeadline.run(
        (deadlineSignal) => client.submitLogs(new SubmitLogsRequest({ logs }), {
          signal: AbortSignal.any([deadlineSignal, controller.signal])
        })
      );
      this.submitTimeoutStreakActive = false;
      return {
        delivered: true,
        receipt: isValidLogShipReceipt(response, logs.length) ? {
          logsProcessed: response.logsProcessed,
          logsDropped: response.logsDropped
        } : void 0
      };
    } catch (error42) {
      if (this.client === attemptedClient) this.client = void 0;
      this.reportSubmitTimeout(error42, logs.length);
      return { delivered: false, error: error42 };
    } finally {
      this.requestAbortControllers.delete(controller);
    }
  }
};
