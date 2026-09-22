var initialized = false;
var hostTracing;
var NOOP_HOST_TRACING = {
  flush: () => {
  },
  dispose: async () => {
  }
};
var TokenRefreshingSpanExporter = class {
  constructor(url2, getToken, baseHeaders, insecure, reportHostLog) {
    this.url = url2;
    this.getToken = getToken;
    this.baseHeaders = baseHeaders;
    this.insecure = insecure;
    this.reportHostLog = reportHostLog;
  }
  url;
  getToken;
  baseHeaders;
  insecure;
  reportHostLog;
  delegate;
  delegateToken;
  resolveDelegate() {
    let token = null;
    try {
      token = this.getToken();
    } catch {
      token = null;
    }
    if (token == null || token.length === 0) {
      return this.delegate;
    }
    if (this.delegate === void 0 || token !== this.delegateToken) {
      const previous = this.delegate;
      this.delegate = new import_exporter_trace_otlp_proto.OTLPTraceExporter({
        url: this.url,
        headers: { ...this.baseHeaders, authorization: `Bearer ${token}` },
        ...this.insecure ? { httpAgentOptions: { rejectUnauthorized: false } } : {}
      });
      this.delegateToken = token;
      if (previous !== void 0) {
        void previous.shutdown().catch((error42) => {
          this.reportHostLog(
            "warn",
            `[sand-tracing] replaced exporter shutdown failed (${errorLogTag(error42)})`
          );
        });
      }
    }
    return this.delegate;
  }
  export(spans, resultCallback) {
    let delegate;
    try {
      delegate = this.resolveDelegate();
    } catch {
      delegate = void 0;
    }
    if (delegate === void 0) {
      resultCallback({ code: import_core71.ExportResultCode.FAILED });
      return;
    }
    try {
      delegate.export(spans, resultCallback);
    } catch {
      resultCallback({ code: import_core71.ExportResultCode.FAILED });
    }
  }
  async shutdown() {
    try {
      await this.delegate?.shutdown();
    } catch {
    }
  }
  async forceFlush() {
    try {
      await this.delegate?.forceFlush?.();
    } catch {
    }
  }
};
function initSandHostTracing(options2) {
  if (initialized) return hostTracing ?? NOOP_HOST_TRACING;
  try {
    const traceUrl = `${options2.backendUrl.replace(/\/+$/, "")}/v1/traces`;
    const exporter = new TokenRefreshingSpanExporter(
      traceUrl,
      options2.getToken,
      {
        "x-cursor-client-type": SAND_CLIENT_TYPE,
        "x-cursor-client-version": "sand-host"
      },
      options2.insecure ?? false,
      options2.reportHostLog
    );
    const provider = new import_sdk_trace_node3.NodeTracerProvider({
      resource: (0, import_resources.resourceFromAttributes)({
        "service.name": "sand-host",
        "service.version": options2.serviceVersion ?? "unknown",
        "host.name": import_node_os27.default.hostname(),
        "os.type": import_node_os27.default.platform(),
        "process.runtime.name": "node",
        "process.runtime.version": process.version,
        "deployment.environment": "box"
      }),
      sampler: createSendTraceSampler(),
      spanProcessors: [new import_sdk_trace_node3.BatchSpanProcessor(exporter)]
    });
    provider.register();
    let disposed = false;
    const shutdown = () => {
      void tracing.dispose();
    };
    const tracing = {
      flush: () => {
        try {
          void provider.forceFlush().catch((error42) => {
            options2.reportHostLog(
              "warn",
              `[sand-tracing] span flush failed (${errorLogTag(error42)})`
            );
          });
        } catch {
          return;
        }
      },
      dispose: async () => {
        if (disposed) return;
        disposed = true;
        process.off("SIGTERM", shutdown);
        process.off("SIGINT", shutdown);
        process.off("beforeExit", shutdown);
        try {
          await provider.shutdown();
        } catch {
          return;
        }
      }
    };
    process.once("SIGTERM", shutdown);
    process.once("SIGINT", shutdown);
    process.once("beforeExit", shutdown);
    hostTracing = tracing;
    initialized = true;
    return tracing;
  } catch {
    return NOOP_HOST_TRACING;
  }
}
