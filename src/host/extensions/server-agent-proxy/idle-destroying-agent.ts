var import_node_http5 = require("node:http");
var import_node_https4 = require("node:https");
init_errors();
var SERVER_TRANSCRIPT_SOCKET_IDLE_MS = 6e4;
var ServerTranscriptSocketIdleError = class extends SandDomainError {
  name = "ServerTranscriptSocketIdleError";
};
function destroyOnIdle(socket, idleMs) {
  socket.on("timeout", () => {
    socket.destroy(
      new ServerTranscriptSocketIdleError(`server transcript socket idle for ${idleMs}ms`)
    );
  });
  return socket;
}
var IdleDestroyingHttpAgent = class extends import_node_http5.Agent {
  constructor(idleMs) {
    super({ keepAlive: true, timeout: idleMs });
    this.idleMs = idleMs;
  }
  idleMs;
  createConnection(options2, callback) {
    return destroyOnIdle(super.createConnection(options2, callback), this.idleMs);
  }
};
var IdleDestroyingHttpsAgent = class extends import_node_https4.Agent {
  constructor(idleMs) {
    super({ keepAlive: true, timeout: idleMs });
    this.idleMs = idleMs;
  }
  idleMs;
  createConnection(options2, callback) {
    return destroyOnIdle(super.createConnection(options2, callback), this.idleMs);
  }
};
function createIdleDestroyingAgent({
  baseUrl,
  idleMs
}) {
  return new URL(baseUrl).protocol === "https:" ? new IdleDestroyingHttpsAgent(idleMs) : new IdleDestroyingHttpAgent(idleMs);
}
