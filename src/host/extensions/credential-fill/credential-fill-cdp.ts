/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/credential-fill/credential-fill-cdp.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
init_zod();
init_errors();
var CDP_OPEN_DEADLINE = createDeadlinePolicy({
  name: "credential-fill.cdp-open",
  timeoutMs: 3e3
});
var CDP_COMMAND_DEADLINE = createDeadlinePolicy({
  name: "credential-fill.cdp-command",
  timeoutMs: 5e3
});
var cdpResponseSchema = external_exports.object({
  id: external_exports.number().int(),
  result: external_exports.unknown().optional(),
  error: external_exports.unknown().optional()
}).passthrough();
var WebSocketCdpConnection = class {
  constructor(socket, reportFailure) {
    this.socket = socket;
    this.reportFailure = reportFailure;
    socket.addEventListener("message", (event) => this.receive(event.data));
    socket.addEventListener("close", () => this.failPending("socket-closed"));
    socket.addEventListener("error", () => this.failPending("socket-error"));
  }
  socket;
  reportFailure;
  nextId = 1;
  pending = /* @__PURE__ */ new Map();
  async send(method, params = {}) {
    return await CDP_COMMAND_DEADLINE.run(
      (signal) => new Promise((resolve29, reject2) => {
        const id = this.nextId;
        this.nextId += 1;
        const abort = () => {
          this.pending.delete(id);
          reject2(new Error("CDP command deadline exceeded."));
        };
        signal.addEventListener("abort", abort, { once: true });
        this.pending.set(id, {
          resolve: (result) => {
            signal.removeEventListener("abort", abort);
            resolve29(result);
          },
          reject: (error42) => {
            signal.removeEventListener("abort", abort);
            reject2(error42);
          }
        });
        try {
          this.socket.send(JSON.stringify({ id, method, params }));
        } catch (error42) {
          this.pending.delete(id);
          signal.removeEventListener("abort", abort);
          reject2(new Error("CDP command send failed.", { cause: error42 }));
        }
      })
    );
  }
  close() {
    this.failPending("socket-closed");
    try {
      this.socket.close();
    } catch (error42) {
      this.reportFailure(`socket-close-${errorLogTag(error42)}`);
    }
  }
  receive(data) {
    if (typeof data !== "string") {
      this.reportFailure("response-type");
      return;
    }
    let decoded;
    try {
      decoded = JSON.parse(data);
    } catch (error42) {
      this.reportFailure(`response-parse-${errorLogTag(error42)}`);
      return;
    }
    const parsed2 = cdpResponseSchema.safeParse(decoded);
    if (!parsed2.success) return;
    const pending = this.pending.get(parsed2.data.id);
    if (pending === void 0) return;
    this.pending.delete(parsed2.data.id);
    if (parsed2.data.error !== void 0) {
      pending.reject(new Error("CDP command failed."));
      return;
    }
    pending.resolve(parsed2.data.result);
  }
  failPending(stage) {
    if (this.pending.size === 0) return;
    this.reportFailure(stage);
    for (const pending of this.pending.values()) {
      pending.reject(new Error("CDP connection closed."));
    }
    this.pending.clear();
  }
};
async function openCdpConnection(url2, reportFailure) {
  const socket = new WebSocket(url2);
  await CDP_OPEN_DEADLINE.run(
    (signal) => new Promise((resolve29, reject2) => {
      const abort = () => {
        socket.close();
        reject2(new Error("CDP connection deadline exceeded."));
      };
      const opened = () => {
        signal.removeEventListener("abort", abort);
        socket.removeEventListener("error", failed2);
        resolve29();
      };
      const failed2 = () => {
        signal.removeEventListener("abort", abort);
        socket.removeEventListener("open", opened);
        reject2(new Error("CDP connection failed."));
      };
      signal.addEventListener("abort", abort, { once: true });
      socket.addEventListener("open", opened, { once: true });
      socket.addEventListener("error", failed2, { once: true });
    })
  );
  return new WebSocketCdpConnection(socket, reportFailure);
}

