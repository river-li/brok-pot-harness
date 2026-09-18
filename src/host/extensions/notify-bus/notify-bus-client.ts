init_errors();
init_cursor_inference();
init_sand_client_metadata();
var SAND_NOTIFY_TOPIC_FLAGS = {
  "automation-fires": true,
  "listener-events": true
};
var SAND_NOTIFY_TOPICS = Object.keys(
  SAND_NOTIFY_TOPIC_FLAGS
);
function isSandNotifyTopic(value) {
  return typeof value === "string" && SAND_NOTIFY_TOPICS.includes(value);
}
var HEALTHY_CONNECTION_MIN_LIFETIME_MS = 3e4;
var NOTIFY_REASSEMBLY_BUFFER_MAX_CHARS = 64 * 1024;
var SandNotifyStreamError = class extends SandDomainError {
  constructor(status) {
    super(`sand notify stream failed: ${status}`);
    this.status = status;
  }
  status;
  name = "SandNotifyStreamError";
};
var SandNotifyBufferOverflowError = class extends SandDomainError {
  name = "SandNotifyBufferOverflowError";
  constructor(bufferedChars) {
    super(
      `sand notify stream buffered ${bufferedChars} chars without a frame boundary (cap ${NOTIFY_REASSEMBLY_BUFFER_MAX_CHARS})`
    );
  }
};
var SandNotifyBusClient = class {
  constructor(deps) {
    this.deps = deps;
    this.fetchImpl = deps.fetchImpl ?? fetch;
  }
  deps;
  fetchImpl;
  stopController = null;
  streamController = null;
  connectedAtMs = null;
  isConnected() {
    return this.connectedAtMs != null;
  }
  start() {
    if (this.stopController != null) return;
    this.stopController = new AbortController();
    void this.runLoop(this.stopController.signal);
  }
  stop() {
    this.stopController?.abort();
    this.stopController = null;
    this.streamController?.abort();
    this.streamController = null;
    this.connectedAtMs = null;
  }
  async runLoop(stopSignal) {
    let attempt = 0;
    while (!stopSignal.aborted) {
      try {
        await this.streamOnce(stopSignal);
      } catch (error41) {
        if (!stopSignal.aborted) this.deps.onStreamError(error41);
      }
      if (stopSignal.aborted) return;
      const wasHealthy = this.connectedAtMs != null && Date.now() - this.connectedAtMs >= HEALTHY_CONNECTION_MIN_LIFETIME_MS;
      this.connectedAtMs = null;
      attempt = wasHealthy ? 0 : attempt + 1;
      if (attempt > 0) {
        const delay5 = this.deps.reconnectBackoff.schedule(attempt, stopSignal);
        try {
          await delay5.elapsed;
        } catch (error41) {
          if (!stopSignal.aborted) this.deps.onStreamError(error41);
          return;
        } finally {
          delay5.dispose();
        }
      }
    }
  }
  async streamOnce(stopSignal) {
    const backendUrl = this.deps.backend.backendUrl;
    const accessToken = await this.deps.getAccessToken({ backendUrl });
    const auth2 = await resolveSandBackendAuthContext({
      accessToken,
      getTeamId: this.deps.getTeamId
    });
    if (stopSignal.aborted) return;
    const controller = new AbortController();
    this.streamController = controller;
    const handleFrame = (frame) => {
      if (stopSignal.aborted) return;
      const parsed2 = parseNotifyFrame(frame);
      if (parsed2.kind === "connected") {
        this.connectedAtMs = Date.now();
        this.deps.onConnected();
      } else if (parsed2.kind === "notify") {
        this.deps.onNotify(parsed2.topic);
      }
    };
    const watchdog = this.deps.stallWatchdog.arm(() => controller.abort());
    try {
      const response = await this.fetchImpl(new URL("/sand/notify", backendUrl).toString(), {
        headers: {
          authorization: `Bearer ${auth2.accessToken}`,
          accept: "text/event-stream",
          ...auth2.teamId !== void 0 ? { "x-cursor-team-id": String(auth2.teamId) } : {},
          ...getSandBackendClientHeaders(this.deps.backend)
        },
        signal: controller.signal
      });
      if (!response.ok || response.body == null) {
        throw new SandNotifyStreamError(response.status);
      }
      const reader = response.body.getReader();
      const decoder2 = new TextDecoder();
      let buffer = "";
      for (; ; ) {
        const { value, done } = await reader.read();
        if (done) break;
        watchdog.kick();
        buffer += decoder2.decode(value, { stream: true });
        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const frame = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          boundary = buffer.indexOf("\n\n");
          handleFrame(frame);
        }
        if (buffer.length > NOTIFY_REASSEMBLY_BUFFER_MAX_CHARS) {
          throw new SandNotifyBufferOverflowError(buffer.length);
        }
      }
    } finally {
      watchdog.dispose();
      controller.abort();
      if (this.streamController === controller) this.streamController = null;
    }
  }
};
function parseNotifyFrame(frame) {
  let dataRaw = null;
  for (const line of frame.split("\n")) {
    if (line.startsWith("data: ")) dataRaw = line.slice("data: ".length);
  }
  if (dataRaw == null) return { kind: "ignored" };
  let payload;
  try {
    payload = JSON.parse(dataRaw);
  } catch {
    return { kind: "ignored" };
  }
  if (payload.kind === "connected") return { kind: "connected" };
  if (payload.kind === "notify" && isSandNotifyTopic(payload.topic)) {
    return { kind: "notify", topic: payload.topic };
  }
  return { kind: "ignored" };
}
