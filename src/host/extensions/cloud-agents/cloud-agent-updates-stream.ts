init_scheduling();
init_background_composer_pb();
init_esm2();
var CLOUD_AGENT_UPDATES_STREAM_POLICY_NAME = "cloud-agent-updates-stream";
var CLOUD_AGENT_UPDATES_IDLE_MS = 45e3;
var CLOUD_AGENT_UPDATES_RECONNECT_MIN_MS = 1e3;
var CLOUD_AGENT_UPDATES_RECONNECT_MAX_MS = 6e4;
var CLOUD_AGENT_UPDATES_GATE_RECHECK_MS = 6e4;
var CLOUD_AGENT_UPDATES_SNAPSHOT_N = 50;
function runStatusFromBackendStatus(status) {
  switch (status) {
    case CloudAgentWorkflowStatus.RUNNING:
    case CloudAgentWorkflowStatus.WAITING_FOR_BACKGROUND_WORK:
      return mapRunStatus(BackgroundComposerStatus.RUNNING);
    case CloudAgentWorkflowStatus.ERROR:
      return mapRunStatus(BackgroundComposerStatus.ERROR);
    case CloudAgentWorkflowStatus.IDLE:
    case CloudAgentWorkflowStatus.ARCHIVED:
      return mapRunStatus(BackgroundComposerStatus.FINISHED);
    case CloudAgentWorkflowStatus.EXPIRED:
      return mapRunStatus(BackgroundComposerStatus.EXPIRED);
    case CloudAgentWorkflowStatus.NOT_YET_STARTED:
      return mapRunStatus(BackgroundComposerStatus.CREATING);
    default:
      return mapRunStatus(BackgroundComposerStatus.UNSPECIFIED);
  }
}
var PUBLISH_TIME_STAMPED_KINDS = /* @__PURE__ */ new Set([
  BackgroundComposerUpdateKind.MEMBERSHIP_CHANGED,
  BackgroundComposerUpdateKind.VISIBILITY_CHANGED,
  BackgroundComposerUpdateKind.SUBSCRIPTIONS_CHANGED,
  BackgroundComposerUpdateKind.APPROVAL_CHANGED
]);
function toCloudAgentUpdateEvent(event) {
  const bcId = event.bcId.trim();
  if (bcId.length === 0 || PUBLISH_TIME_STAMPED_KINDS.has(event.kind)) return null;
  const updatedAtMs = Number(event.updatedAtMs);
  if (!(updatedAtMs > 0)) return null;
  return { bcId, status: runStatusFromBackendStatus(event.workflowStatus), updatedAtMs };
}
function snapshotToCloudAgentUpdateEvent(composer) {
  const bcId = composer.bcId.trim();
  const updatedAtMs = Math.trunc(composer.updatedAtMs);
  if (bcId.length === 0 || !(updatedAtMs > 0)) return null;
  return { bcId, status: mapRunStatus(composer.status), updatedAtMs };
}
function errorClassOf2(error42) {
  if (error42 instanceof ConnectError) return `ConnectError.${Code[error42.code]}`;
  if (error42 instanceof Error) return error42.name;
  return "Error";
}
var CloudAgentUpdatesStream = class {
  constructor(options2) {
    this.options = options2;
    this.reconnect = createRetryPolicy({
      name: CLOUD_AGENT_UPDATES_STREAM_POLICY_NAME,
      mode: "until-signal",
      initialDelayMs: CLOUD_AGENT_UPDATES_RECONNECT_MIN_MS,
      maxDelayMs: CLOUD_AGENT_UPDATES_RECONNECT_MAX_MS,
      jitter: "equal",
      clock: options2.clock,
      ...options2.randomFn === void 0 ? {} : { random: options2.randomFn }
    });
    this.watchdog = createIdleWatchdogPolicy({
      name: `${CLOUD_AGENT_UPDATES_STREAM_POLICY_NAME}-idle`,
      idleMs: CLOUD_AGENT_UPDATES_IDLE_MS,
      clock: options2.clock
    });
  }
  options;
  abort = new AbortController();
  reconnect;
  watchdog;
  cursor;
  started = false;
  gateWait = null;
  start() {
    if (this.started || this.abort.signal.aborted) return;
    this.started = true;
    void this.run().catch((error42) => {
      if (this.abort.signal.aborted) return;
      reportPolicyStop({
        policyName: CLOUD_AGENT_UPDATES_STREAM_POLICY_NAME,
        reason: "run-failed",
        errorClass: errorClassOf2(error42)
      });
    });
  }
  wake() {
    this.gateWait?.abort();
  }
  dispose() {
    this.abort.abort();
  }
  async run() {
    const signal = this.abort.signal;
    let failures = 0;
    while (!signal.aborted) {
      if (!this.options.isEnabled()) {
        await this.waitForGate();
        continue;
      }
      const outcome = await this.connectOnce(signal);
      if (signal.aborted) return;
      if (outcome === "ended") {
        failures = 0;
      } else {
        failures += 1;
        if (failures === 1) {
          reportHostDiagnostic({
            kind: "cloud_agent_updates_stream_failed",
            errorClass: outcome.errorClass
          });
        }
      }
      await this.wait(Math.max(failures, 1), this.abort.signal);
    }
  }
  async waitForGate() {
    const gateWait = new AbortController();
    const onAbort = () => gateWait.abort();
    this.abort.signal.addEventListener("abort", onAbort, { once: true });
    this.gateWait = gateWait;
    try {
      await this.wait(1, gateWait.signal, {
        kind: "replace",
        delayMs: CLOUD_AGENT_UPDATES_GATE_RECHECK_MS
      });
    } finally {
      this.gateWait = null;
      this.abort.signal.removeEventListener("abort", onAbort);
    }
  }
  async wait(attempt, signal, hint) {
    try {
      await this.reconnect.schedule(attempt, signal, hint).elapsed;
    } catch (error42) {
      if (!signal.aborted) throw error42;
    }
  }
  async connectOnce(parent) {
    const connection = new AbortController();
    const onParentAbort = () => connection.abort();
    parent.addEventListener("abort", onParentAbort, { once: true });
    const idle = this.watchdog.arm(() => connection.abort());
    try {
      const responses = this.options.getClient().streamBackgroundComposerUpdates(
        new StreamBackgroundComposerUpdatesRequest({
          ...this.cursor === void 0 ? {} : { resumeCursor: this.cursor },
          snapshotN: CLOUD_AGENT_UPDATES_SNAPSHOT_N
        }),
        { signal: connection.signal }
      );
      for await (const response of responses) {
        if (!this.options.isEnabled()) {
          connection.abort();
          break;
        }
        idle.kick();
        this.ingest(response);
      }
      return "ended";
    } catch (error42) {
      if (parent.aborted) return "ended";
      return { errorClass: connection.signal.aborted ? "IdleTimeout" : errorClassOf2(error42) };
    } finally {
      idle.dispose();
      parent.removeEventListener("abort", onParentAbort);
    }
  }
  ingest(response) {
    const body = response.response;
    switch (body.case) {
      case "snapshot": {
        this.cursor = body.value.resumeCursor;
        for (const composer of body.value.list?.composers ?? []) {
          const event = snapshotToCloudAgentUpdateEvent(composer);
          if (event !== null) this.options.onEvent(event);
        }
        return;
      }
      case "heartbeat":
        this.cursor = body.value.resumeCursor;
        return;
      case "event": {
        this.cursor = body.value.resumeCursor;
        const event = body.value.event === void 0 ? null : toCloudAgentUpdateEvent(body.value.event);
        if (event !== null) this.options.onEvent(event);
        return;
      }
      default:
        return;
    }
  }
};
