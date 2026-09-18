init_esm2();
init_esm3();
init_protocol();
init_protocol_connect();
init_system_errno();
function createBoxTransport(endpoint) {
  const httpClient = createNodeHttpClient({ httpVersion: "1.1" });
  return createTransport({
    baseUrl: `http://${endpoint.host}:${endpoint.port}`,
    httpClient: (request3) => httpClient(
      request3.signal !== void 0 ? request3 : { ...request3, signal: new AbortController().signal }
    ),
    useBinaryFormat: true,
    interceptors: [
      (next) => async (request3) => {
        request3.header.set("Authorization", `Bearer ${endpoint.authToken}`);
        for (const [name17, value] of Object.entries(endpoint.headers ?? {})) {
          request3.header.set(name17, value);
        }
        return await next(request3);
      }
    ],
    sendCompression: null,
    acceptCompression: [compressionGzip, compressionBrotli],
    ...validateReadWriteMaxBytes(void 0, void 0, void 0)
  });
}
var BoxRemoteExecManager = class {
  constructor(client) {
    this.client = client;
  }
  client;
  nextId = 0;
  async *createExecInstance(ctx, argsSerializer) {
    const response = this.client.exec(ctx, argsSerializer(this.nextId++));
    for await (const message of response) {
      if (message.element.case === "execClientMessage") {
        yield message.element.value;
      } else if (message.element.case === "execClientControlMessage" && message.element.value.message.case === "throw") {
        const thrown = message.element.value.message.value;
        const error41 = new Error(thrown.error);
        if (thrown.stackTrace !== void 0 && thrown.stackTrace.length > 0) {
          error41.stack = thrown.stackTrace;
        }
        throw error41;
      }
    }
  }
};
function createBoxRemoteResourceAccessorFromTransport(transport) {
  return new RemoteResourceAccessor(
    new BoxRemoteExecManager(createContextPropagatingClient(ExecService, transport))
  );
}
function createBoxRemoteResourceAccessor(endpoint) {
  return createBoxRemoteResourceAccessorFromTransport(createBoxTransport(endpoint));
}
function classifyPingFailure(error41) {
  const connectError = error41 instanceof ConnectError ? error41 : ConnectError.from(error41);
  const errno = findSystemErrno(error41);
  const codeName = Code[connectError.code] ?? "unknown";
  const causeSummary = errno != null ? `${codeName}/${errno}` : codeName;
  if (connectError.code === Code.DeadlineExceeded) {
    return { outcome: "timeout", causeSummary };
  }
  if (errno === "ECONNREFUSED" || /ECONNREFUSED/i.test(connectError.message)) {
    return { outcome: "refused", causeSummary };
  }
  return { outcome: "crash", causeSummary };
}
async function pingBoxTransportClassified(ctx, transport, timeoutMs = 1500) {
  const control = createContextPropagatingClient(ControlService, transport);
  const start = Date.now();
  try {
    await control.ping(ctx, new PingRequest(), { timeoutMs });
    return { outcome: "ok", latencyMs: Date.now() - start };
  } catch (error41) {
    const { outcome, causeSummary } = classifyPingFailure(error41);
    return { outcome, latencyMs: Date.now() - start, causeSummary };
  }
}
async function pingBoxClassified(ctx, endpoint, timeoutMs = 1500) {
  return await pingBoxTransportClassified(ctx, createBoxTransport(endpoint), timeoutMs);
}
async function pingBoxTransport(ctx, transport, timeoutMs = 1500) {
  return (await pingBoxTransportClassified(ctx, transport, timeoutMs)).outcome === "ok";
}
async function pingBox(ctx, endpoint, timeoutMs = 1500) {
  return await pingBoxTransport(ctx, createBoxTransport(endpoint), timeoutMs);
}
